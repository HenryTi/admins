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
        this.timeout = env.isDevelopment === true? 500000:50000;
    }

    private startWait = (waiting: boolean) => {
        if (waiting === true) {
            if (this.ui !== undefined) this.ui.startWait();
        }
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
        return await this.innerFetch(urlPrefix + path, options, caller.waiting);
    }

    private async innerFetchResult(url: string, options: any, waiting: boolean): Promise<any> {
        let ret = await this.innerFetch(url, options, waiting);
        return ret.res;
    }

    async get(url: string, params: any = undefined, waiting?: boolean): Promise<any> {
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
        return await this.innerFetchResult(url, options, waiting);
    }

    async post(url: string, params: any, waiting?: boolean): Promise<any> {
        let options = this.buildOptions();
        options.method = 'POST';
        options.body = JSON.stringify(params);
        return await this.innerFetchResult(url, options, waiting);
    }

    async put(url: string, params: any, waiting?: boolean): Promise<any> {
        let options = this.buildOptions();
        options.method = 'PUT';
        options.body = JSON.stringify(params);
        return await this.innerFetchResult(url, options, waiting);
    }

    async delete(url: string, params: any, waiting?: boolean): Promise<any> {
        let options = this.buildOptions();
        options.method = 'DELETE';
        options.body = JSON.stringify(params);
        return await this.innerFetchResult(url, options, waiting);
    }
    async fetch(url: string, options: any, waiting: boolean, resolve:(value?:any)=>any, reject:(reason?:any)=>void):Promise<void> {
        let that = this;
        this.startWait(waiting);
        let path = url;
        function buildError(err: any, ex?: string) {
            switch (typeof err) {
                case 'string':
                    if (ex !== undefined) err += ' ' + ex;
                    break;
                case 'object':
                    let retErr = {
                        ex: ex,
                        message: err.message,
                    };
                    err = retErr;
                    break;
            }
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
            console.log('%s-%s %s', options.method, path, options.body);
            let now = Date.now();
            let timeOutHandler = env.setTimeout(
                'httpChannel.fetch',
                () => {
                    that.endWait(url + ' timeout endWait: ' + (Date.now() - now) + 'ms', reject);
                },
                this.timeout);
            let res = await fetch(encodeURI(path), options);
            if (res.ok === false) {
                env.clearTimeout(timeOutHandler);
                console.log('ok false endWait');       
                that.endWait();
                console.log('call error %s', res.statusText);
                throw res.statusText;
            }
            let ct = res.headers.get('content-type');
            if (ct && ct.indexOf('json')>=0) {
                return res.json().then(async retJson => {
                    env.clearTimeout(timeOutHandler);
                    that.endWait();
                    if (retJson.ok === true) {
                        if (typeof retJson !== 'object') {
                            debugger;
                        }
                        else if (Array.isArray(retJson) === true) {
                            debugger;
                        }
                        return resolve(retJson);
                    }
                    let retError = retJson.error;
                    if (retError === undefined) {
                        await that.showError(buildError('not valid tonva json'));
                    }
                    else {
                        await that.showError(buildError(retError, 'retJson.error'));
                        reject(retError);
                    }
                }).catch(async error => {
                    await that.showError(buildError(error, 'catch res.json()'));
                });
            }
            else {
                let text = await res.text();
                env.clearTimeout(timeOutHandler);
                console.log('text endWait');
                that.endWait();
                resolve(text);
            }
        }
        catch(error) {
            this.endWait(url, reject);
            if (typeof error === 'string') {
                let err = error.toLowerCase();
                if (err.startsWith('unauthorized') === true) {
                    nav.logout();
                    return;
                }
            }
            console.error('fecth error (no nav.showError): ' + url);
            // await this.showError(buildError(error, 'catch outmost'));
        };
    }

    protected abstract async innerFetch(url: string, options: any, waiting: boolean): Promise<any>;

    async callFetch(url:string, method:string, body:any):Promise<any> {
        let options = this.buildOptions();
        options.method = method;
        options.body = body;
        return await new Promise<any>(async (resolve, reject) => {
            await this.fetch(url, options, true, resolve, reject);
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
    protected async innerFetch(url: string, options: any, waiting: boolean): Promise<any> {
        let u = this.hostUrl + url;
        if (this.apiToken === undefined && isBridged())
            return await bridgeCenterApi(u, options.method, options.body);
        return await new Promise<any>(async (resolve, reject) => {
            await this.fetch(u, options, waiting, resolve, reject);
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
    protected async innerFetch(url: string, options: any, waiting: boolean): Promise<any> {
        let u = this.hostUrl + url;
        return await new Promise<any>(async (resolve, reject) => {
            await this.fetch(u, options, waiting, resolve, reject);
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
