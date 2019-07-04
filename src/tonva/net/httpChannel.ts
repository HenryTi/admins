import {bridgeCenterApi, isBridged} from './appBridge';
import {FetchError} from '../fetchError';
import {HttpChannelUI} from './httpChannelUI';
import {nav} from '../ui/nav';
import { isDevelopment } from './host';

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

export class HttpChannel {
    private isCenter: boolean;
    private hostUrl: string;
    private apiToken: string;
    private ui?: HttpChannelUI;
    private timeout: number;

    constructor(isCenter: boolean, hostUrl: string, apiToken:string, ui?: HttpChannelUI) {
        this.isCenter = isCenter;
        this.hostUrl = hostUrl;
        this.apiToken = apiToken;
        this.ui = ui;
        this.timeout = isDevelopment === true? 500000:5000;
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
        return await this.innerFetch(url, options);
    }

    async post(url: string, params: any): Promise<any> {
        let options = this.buildOptions();
        options.method = 'POST';
        options.body = JSON.stringify(params);
        return await this.innerFetch(url, options);
    }

    async put(url: string, params: any): Promise<any> {
        let options = this.buildOptions();
        options.method = 'PUT';
        options.body = JSON.stringify(params);
        return await this.innerFetch(url, options);
    }

    async delete(url: string, params: any): Promise<any> {
        let options = this.buildOptions();
        options.method = 'DELETE';
        options.body = JSON.stringify(params);
        return await this.innerFetch(url, options);
    }
    async fetch(url: string, options: any, resolve:(value?:any)=>any, reject:(reason?:any)=>void):Promise<void> {
        let that = this;
        this.startWait();
        let path = url;
        function buildError(err: string) {
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
                        return resolve(retJson.res);
                    }
                    if (retJson.error === undefined) {
                        await that.showError(buildError('not valid tonva json'));
                    }
                    else {
                        await that.showError(buildError(retJson.error));
                        reject(retJson.error);
                    }
                    //throw retJson.error;
                }).catch(async error => {
                    await that.showError(buildError(error.message));
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
                if (error.toLowerCase().startsWith('unauthorized') === true) {
                    nav.logout();
                    return;
                }
            }
            await this.showError(buildError(error.message));
        };
    }

    private async innerFetch(url: string, options: any): Promise<any> {
        let u = this.hostUrl + url;
        if (this.isCenter === true && this.apiToken === undefined && isBridged())
            return await bridgeCenterApi(u, options.method, options.body);
        return await new Promise<any>(async (resolve, reject) => {
            await this.fetch(u, options, resolve, reject);
        });
    }

    async callFetch(url:string, method:string, body:any):Promise<any> {
        let options = this.buildOptions();
        options.method = method;
        options.body = body;
        return await new Promise<any>(async (resolve, reject) => {
            await this.fetch(url, options, resolve, reject);
        });
    }

    private buildOptions(): any {
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
        let options = {
            headers: headers,
            // cache: 'no-cache',
        };
        return options;
    }
}
