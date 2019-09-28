import {bridgeCenterApi, isBridged} from './appBridge';
import {FetchError} from './fetchError';
import {HttpChannelUI} from './httpChannelUI';
import {nav} from '../components/nav';
import { Caller } from './caller';
import { env } from '../tool';

/*
export async function httpGet(url:string, params?:any):Promise<any> {
    let channel = new HttpChannel(false, url, undefined, undefined);
    let ret = await channel.get('', params);
    return ret;
}

export async function httpPost(url:string, params?:any):Promise<any> {
    let channel = new HttpChannel(false, url, undefined, undefined);
    let ret = await channel.post('', params);
    return ret;
}
*/

const methodsWithBody = ['POST', 'PUT'];

export abstract class HttpChannel {
    private timeout: number;
    protected ui?: HttpChannelUI;
    protected hostUrl: string;
    protected apiToken: string;

    constructor(hostUrl: string, apiToken:string, ui?: HttpChannelUI) {
        this.hostUrl = hostUrl;
        this.apiToken = apiToken;
        this.ui = ui;
        this.timeout = env.isDevelopment === true? 500000:5000;
    }

    private startWait = () => {
        if (this.ui !== undefined) this.ui.startWait();
    }

    private endWait = (url?:string, reject?:(reason?:any)=>void) => {
        if (this.ui !== undefined) this.ui.endWait();
        if (reject !== undefined) reject('访问webapi超时 ' + url);
    }

    private showError = async (error:FetchError) => {
        if (this.ui !== undefined) await this.ui.showError(error);
    }

    used() {
        this.post('', {});
    }

    async xcall(urlPrefix:string, caller:Caller<any>): Promise<void> {
        let options = this.buildOptions();
        let {headers, path, method} = caller;
        if (headers !== undefined) {
            let h = options.headers;
            for (let i in headers) {
                h.append(i, encodeURI(headers[i]));
            }
        }
        options.method = method;
        let p = caller.buildParams();
        if (methodsWithBody.indexOf(method) >= 0 && p !== undefined) {
            options.body = JSON.stringify(p)
        }
        return await this.innerFetch(urlPrefix + path, options);
    }

    private async innerFetchResult(url: string, options: any): Promise<any> {
        let ret = await this.innerFetch(url, options);
        return ret.res;
    }

    async get(url: string, params: any = undefined): Promise<any> {
        if (params) {
            let keys = Object.keys(params);
            if (keys.length > 0) {
                let c = '?';
                for (let k of keys) {
                    let v = params[k];
                    if (v === undefined) continue;
                    url += c + k + '=' + params[k];
                    c = '&';
                }
            }
        }
        let options = this.buildOptions();
        options.method = 'GET';
        return await this.innerFetchResult(url, options);
    }

    async post(url: string, params: any): Promise<any> {
        let options = this.buildOptions();
        options.method = 'POST';
        options.body = JSON.stringify(params);
        return await this.innerFetchResult(url, options);
    }

    async put(url: string, params: any): Promise<any> {
        let options = this.buildOptions();
        options.method = 'PUT';
        options.body = JSON.stringify(params);
        return await this.innerFetchResult(url, options);
    }

    async delete(url: string, params: any): Promise<any> {
        let options = this.buildOptions();
        options.method = 'DELETE';
        options.body = JSON.stringify(params);
        return await this.innerFetchResult(url, options);
    }
    async fetch(url: string, options: any, resolve:(value?:any)=>any, reject:(reason?:any)=>void):Promise<void> {
        let that = this;
        this.startWait();
        let path = url;
        function buildError(err: any) {
            return {
                channel: that,
                url: path,
                options: options,
                resolve: resolve,
                reject: reject,
                error: err,
            }
        }
        try {
            console.log('%s %s', options.method, path);
            let timeOutHandler = setTimeout(() => that.endWait(url, reject), this.timeout);
            let res = await fetch(encodeURI(path), options);
            if (res.ok === false) {
                clearTimeout(timeOutHandler);
                that.endWait();
                console.log('call error %s', res.statusText);
                throw res.statusText;
            }
            let ct = res.headers.get('content-type');
            if (ct && ct.indexOf('json')>=0) {
                return res.json().then(async retJson => {
                    clearTimeout(timeOutHandler);
                    that.endWait();
                    if (retJson.ok === true) {
                        if (typeof retJson !== 'object') {
                            debugger;
                        }
                        else if (Array.isArray(retJson) === true) {
                            debugger;
                        }
                        /*
                        let json = retJson.res;
                        if (json === undefined) {
                            json = {
                                $uq: retJson.$uq
                            }
                        }
                        */
                        //json.$modify = retJson.$modify;
                        //return resolve(json);
                        return resolve(retJson);
                    }
                    let retError = retJson.error;
                    if (retError === undefined) {
                        await that.showError(buildError('not valid tonva json'));
                    }
                    else {
                        await that.showError(buildError(retError));
                        reject(retError);
                    }
                }).catch(async error => {
                    await that.showError(buildError(error));
                });
            }
            else {
                let text = await res.text();
                clearTimeout(timeOutHandler);
                that.endWait();
                resolve(text);
            }
        }
        catch(error) {
            if (typeof error === 'string') {
                let err = error.toLowerCase();
                if (err.startsWith('unauthorized') === true) {
                    nav.logout();
                    return;
                }
            }
            await this.showError(buildError(error.message));
        };
    }

    protected abstract async innerFetch(url: string, options: any): Promise<any>;

    async callFetch(url:string, method:string, body:any):Promise<any> {
        let options = this.buildOptions();
        options.method = method;
        options.body = body;
        return await new Promise<any>(async (resolve, reject) => {
            await this.fetch(url, options, resolve, reject);
        });
    }

    private buildOptions(): {method:string; headers:Headers; body:any} {
        let headers = this.buildHeaders();
        let options = {
            headers: headers,
            method: undefined as any,
            body: undefined as any,
            // cache: 'no-cache',
        };
        return options;
    }

    protected buildHeaders():Headers {
        let {language, culture} = nav;
        let headers = new Headers();
        //headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        let lang = language;
        if (culture) lang += '-' + culture;
        headers.append('Accept-Language', lang);
        if (this.apiToken) { 
            headers.append('Authorization', this.apiToken); 
        }
        return headers;
    }
}

export class CenterHttpChannel extends HttpChannel {
    protected async innerFetch(url: string, options: any): Promise<any> {
        let u = this.hostUrl + url;
        if (this.apiToken === undefined && isBridged())
            return await bridgeCenterApi(u, options.method, options.body);
        return await new Promise<any>(async (resolve, reject) => {
            await this.fetch(u, options, resolve, reject);
        });
    }
}

export class UqHttpChannel extends HttpChannel {
    /*
    private uqForChannel: IUqForChannel;
    constructor(hostUrl: string, apiToken:string, uqForChannel: IUqForChannel, ui?: HttpChannelUI) {
        super(hostUrl, apiToken, ui);
        this.uqForChannel = uqForChannel;
    }
    */
    protected async innerFetch(url: string, options: any): Promise<any> {
        let u = this.hostUrl + url;
        return await new Promise<any>(async (resolve, reject) => {
            await this.fetch(u, options, resolve, reject);
        });
    }

    /*
    protected buildHeaders():Headers {
        let headers = super.buildHeaders();
        if (this.uqForChannel !== undefined) {
            let {uqVersion} = this.uqForChannel;
            if (uqVersion !== undefined) {
                headers.append('tonva-uq-version', String(uqVersion));
            }
        }
        return headers;
    }

    protected async showSpecificError(err:string):Promise<boolean> {
        if (err === 'unmatched uq version') {
            if (this.ui !== undefined) {
                let uq:string, uqVersion:number;
                if (this.uqForChannel !== undefined) {
                    uq = this.uqForChannel.uq;
                    uqVersion = this.uqForChannel.uqVersion;
                }
                else {
                    uq = 'undefined uq';
                    uqVersion = 0;
                }
                await this.ui.showUpgradeUq(uq, uqVersion);
                return true;
            }
        }
        return false;
    }
    */
}
