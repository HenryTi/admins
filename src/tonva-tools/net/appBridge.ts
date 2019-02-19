import _ from 'lodash';
import {nav} from '../ui';
import {uid} from '../uid';
import {uqTokenApi as uqTokenApi, callCenterapi, CenterAppApi, AppUq, centerToken, App} from './uqApi';
import {setSubAppWindow} from './wsChannel';
import { host } from './host';

export interface UqToken {
    name: string;
    url: string;
    urlDebug: string;
    token: string;
}
interface UqTokenAction extends UqToken {
    resolve: (value?: UqToken | PromiseLike<UqToken>) => void;
    reject: (reason?: any) => void;
}
const uqTokens:{[uqName:string]: UqTokenAction}  = {};
export function logoutUqTokens() {
    for (let i in uqTokens) uqTokens[i] = undefined;
}

export interface AppInFrame {
    hash: string;
    unit: number;       // unit id
    page?: string;
    param?: string[];
}
const appsInFrame:{[key:string]:AppInFrame} = {};

class AppInFrameClass implements AppInFrame {
    hash: string;
    private _unit: number;
    get unit(): number {return this._unit;}       // unit id
    set unit(val:number) { this._unit=val;}
    page?: string;
    param?: string[];
}

export let meInFrame:AppInFrame = new AppInFrameClass();
/* {
    hash: undefined,
    get unit():number {return } undefined, //debugUnitId,
    page: undefined;
    param: undefined,
}*/

export function isBridged():boolean {
    return self !== window.parent;
}

window.addEventListener('message', async function(evt) {
    var message = evt.data;
    switch (message.type) {
        case 'sub-frame-started':
            subFrameStarted(evt);
            break;
        case 'ws':
            //wsBridge.receive(message.msg);
            await nav.onReceive(message.msg);
            break;
        case 'init-sub-win':
            await initSubWin(message);
            break;
        case 'pop-app':
            nav.navBack();
            break;
        case 'center-api':
            await callCenterApiFromMessage(evt.source as Window, message);
            break;
        case 'center-api-return':
            bridgeCenterApiReturn(message);
            break;
        case 'app-api':
            console.log("receive PostMessage: %s", JSON.stringify(message));
            let ret = await onReceiveAppApiMessage(message.hash, message.apiName);
            console.log("onReceiveAppApiMessage: %s", JSON.stringify(ret));
            (evt.source as Window).postMessage({
                type: 'app-api-return', 
                apiName: message.apiName,
                url: ret.url,
                urlDebug: ret.urlDebug,
                token: ret.token} as any, "*");
            break;
        case 'app-api-return':
            console.log("app-api-return: %s", JSON.stringify(message));
            console.log('await onAppApiReturn(message);');
            await onAppApiReturn(message);
            break;
        default:
            this.console.log('message: %s', JSON.stringify(message));
            break;
    }
});

function subFrameStarted(evt:any) {
    var message = evt.data;
    let subWin = evt.source as Window;
    setSubAppWindow(subWin);
    hideFrameBack(message.hash);
    let msg:any = _.clone(nav.user);
    msg.type = 'init-sub-win';
    subWin.postMessage(msg, '*');
}
function hideFrameBack(hash:string) {
    let el = document.getElementById(hash);
    if (el !== undefined) el.hidden = true;
}
async function initSubWin(message:any) {
    console.log('initSubWin: set nav.user', message);
    nav.user = message; // message.user;
    await nav.showAppView();
}
async function onReceiveAppApiMessage(hash: string, apiName: string): Promise<UqToken> {
    let appInFrame = appsInFrame[hash];
    if (appInFrame === undefined) return {name:apiName, url:undefined, urlDebug:undefined, token:undefined};
    let {unit} = appInFrame;
    let parts = apiName.split('/');
    let ret = await uqTokenApi.uq({unit: unit, uqOwner: parts[0], uqName: parts[1]});
    if (ret === undefined) {
        console.log('apiTokenApi.api return undefined. api=%s, unit=%s', apiName, unit);
        throw 'api not found';
    }
    return {name: apiName, url: ret.url, urlDebug:ret.urlDebug, token: ret.token};
}

async function onAppApiReturn(message:any) {
    let {apiName, url, urlDebug, token} = message;
    let action = uqTokens[apiName];
    if (action === undefined) {
        throw 'error app api return';
        //return;
    }
    let realUrl = host.getUrlOrDebug(url, urlDebug);
    console.log('onAppApiReturn(message:any): url=' + url + ', debug=' + urlDebug + ', real=' + realUrl);
    action.url = realUrl;
    action.token = token;
    action.resolve(action);
}

export function setMeInFrame(appHash: string):AppInFrame {
    let parts = appHash.split('-');
    let len = parts.length;
    meInFrame.hash = parts[0].substr(3);
    if (len>0) meInFrame.unit = Number(parts[1]);
    if (len>1) meInFrame.page = parts[2];
    if (len>2) meInFrame.param = parts.slice(3);
    return meInFrame;
}

export function appUrl(url: string, unitId: number, page?:string, param?:any[]):{url:string; hash:string} {
    let u:string;
    for (;;) {
        u = uid();
        let a = appsInFrame[u];
        if (a === undefined) {
            appsInFrame[u] = {hash:u, unit:unitId};
            break;
        }
    }
    url += '#tv' + u + '-' + unitId;
    if (page !== undefined) {
        url += '-' + page;
        if (param !== undefined) {
            for (let i=0; i<param.length; i++) {
                url += '-' + param[i];
            }
        }
    }
    return {url: url, hash: u};
}

export async function loadAppUqs(appOwner:string, appName): Promise<App> {
    let centerAppApi = new CenterAppApi('tv/', undefined);
    let unit = meInFrame.unit;
    let ret = await centerAppApi.uqs(unit, appOwner, appName);
    centerAppApi.checkUqs(unit, appOwner, appName).then(v => {
        if (v === false) nav.start();
    });
    return ret;
}

export async function appUq(uq:string, uqOwner:string, uqName:string): Promise<UqToken> {
    let uqToken = uqTokens[uq];
    if (uqToken !== undefined) return uqToken;
    if (!isBridged()) {
        uqToken = await uqTokenApi.uq({unit: meInFrame.unit, uqOwner:uqOwner, uqName:uqName});
        if (uqToken === undefined) {
            let err = 'unauthorized call: uqTokenApi center return undefined!';
            throw err;
        }
        if (uqToken.token === undefined) uqToken.token = centerToken;
        let {url, urlDebug} = uqToken;
        let realUrl = host.getUrlOrDebug(url, urlDebug);
        console.log('realUrl: %s', realUrl);
        uqToken.url = realUrl;
        uqTokens[uq] = uqToken;
        return uqToken;
    }
    console.log("appApi parent send: %s", meInFrame.hash);
    uqToken = {
        name: uq,
        url: undefined,
        urlDebug: undefined,
        token: undefined,
        resolve: undefined,
        reject: undefined,
    };
    uqTokens[uq] = uqToken;
    return new Promise<UqToken>((resolve, reject) => {
        uqToken.resolve = async (at) => {
            let a = await at;
            console.log('return from parent window: %s', JSON.stringify(a));
            uqToken.url = a.url;
            uqToken.urlDebug = a.urlDebug;
            uqToken.token = a.token;
            resolve(uqToken);
        }
        uqToken.reject = reject;
        (window.opener || window.parent).postMessage({
            type: 'app-api',
            apiName: uq,
            hash: meInFrame.hash,
        }, "*");
    });
}

interface BridgeCenterApi {
    id: string;
    resolve: (value?:any)=>any;
    reject: (reason?:any)=>void;
}
const brideCenterApis:{[id:string]: BridgeCenterApi} = {};
export async function bridgeCenterApi(url:string, method:string, body:any):Promise<any> {
    console.log('bridgeCenterApi: url=%s, method=%s', url, method);
    return await new Promise<any>(async (resolve, reject) => {
        let callId:string;
        for (;;) {
            callId = uid();
            let bca = brideCenterApis[callId];
            if (bca === undefined) {
                brideCenterApis[callId] = {
                    id: callId,
                    resolve: resolve,
                    reject: reject,
                }
                break;
            }
        }
        (window.opener || window.parent).postMessage({
            type: 'center-api',
            callId: callId,
            url: url,
            method: method,
            body: body
        }, '*');
    });
}

async function callCenterApiFromMessage(from:Window, message):Promise<void> {
    let {callId, url, method, body} = message;
    let result = await callCenterapi.directCall(url, method, body);
    from.postMessage({
        type: 'center-api-return',
        callId: callId,
        result: result,
    }, '*');
}

function bridgeCenterApiReturn(message:any) {
    let {callId, result} = message;
    let bca = brideCenterApis[callId];
    if (bca === undefined) return;
    brideCenterApis[callId] = undefined;
    bca.resolve(result);
}
