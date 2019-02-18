var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import _ from 'lodash';
import { nav } from '../ui';
import { uid } from '../uid';
import { uqTokenApi as uqTokenApi, callCenterapi, CenterAppApi, centerToken, setCenterToken } from './uqApi';
import { setSubAppWindow } from './wsChannel';
import { host } from './host';
const uqTokens = {};
export function logoutUqTokens() {
    for (let i in uqTokens)
        uqTokens[i] = undefined;
}
const appsInFrame = {};
class AppInFrameClass {
    get unit() { return this._unit; } // unit id
    set unit(val) { this._unit = val; }
}
export let meInFrame = new AppInFrameClass();
/* {
    hash: undefined,
    get unit():number {return } undefined, //debugUnitId,
    page: undefined;
    param: undefined,
}*/
export function isBridged() {
    return self !== window.parent;
}
window.addEventListener('message', function (evt) {
    return __awaiter(this, void 0, void 0, function* () {
        var message = evt.data;
        switch (message.type) {
            case 'sub-frame-started':
                subFrameStarted(evt);
                break;
            case 'ws':
                //wsBridge.receive(message.msg);
                yield nav.onReceive(message.msg);
                break;
            case 'init-sub-win':
                yield initSubWin(message);
                break;
            case 'pop-app':
                nav.navBack();
                break;
            case 'center-api':
                yield callCenterApiFromMessage(evt.source, message);
                break;
            case 'center-api-return':
                bridgeCenterApiReturn(message);
                break;
            case 'app-api':
                console.log("receive PostMessage: %s", JSON.stringify(message));
                let ret = yield onReceiveAppApiMessage(message.hash, message.apiName);
                console.log("onReceiveAppApiMessage: %s", JSON.stringify(ret));
                evt.source.postMessage({
                    type: 'app-api-return',
                    apiName: message.apiName,
                    url: ret.url,
                    urlDebug: ret.urlDebug,
                    token: ret.token
                }, "*");
                break;
            case 'app-api-return':
                console.log("app-api-return: %s", JSON.stringify(message));
                console.log('await onAppApiReturn(message);');
                yield onAppApiReturn(message);
                break;
            default:
                this.console.log('message: %s', JSON.stringify(message));
                break;
        }
    });
});
function subFrameStarted(evt) {
    var message = evt.data;
    let subWin = evt.source;
    setSubAppWindow(subWin);
    hideFrameBack(message.hash);
    let msg = _.clone(nav.user);
    msg.type = 'init-sub-win';
    subWin.postMessage(msg, '*');
}
function hideFrameBack(hash) {
    let el = document.getElementById(hash);
    if (el !== undefined)
        el.hidden = true;
}
function initSubWin(message) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('initSubWin: set nav.user', message);
        let { id, token } = message;
        setCenterToken(id, token);
        nav.user = message;
        yield nav.showAppView();
    });
}
function onReceiveAppApiMessage(hash, apiName) {
    return __awaiter(this, void 0, void 0, function* () {
        let appInFrame = appsInFrame[hash];
        if (appInFrame === undefined)
            return { name: apiName, url: undefined, urlDebug: undefined, token: undefined };
        let { unit } = appInFrame;
        let parts = apiName.split('/');
        let ret = yield uqTokenApi.uq({ unit: unit, uqOwner: parts[0], uqName: parts[1] });
        if (ret === undefined) {
            console.log('apiTokenApi.api return undefined. api=%s, unit=%s', apiName, unit);
            throw 'api not found';
        }
        return { name: apiName, url: ret.url, urlDebug: ret.urlDebug, token: ret.token };
    });
}
function onAppApiReturn(message) {
    return __awaiter(this, void 0, void 0, function* () {
        let { apiName, url, urlDebug, token } = message;
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
    });
}
export function setMeInFrame(appHash) {
    let parts = appHash.split('-');
    let len = parts.length;
    meInFrame.hash = parts[0].substr(3);
    if (len > 0)
        meInFrame.unit = Number(parts[1]);
    if (len > 1)
        meInFrame.page = parts[2];
    if (len > 2)
        meInFrame.param = parts.slice(3);
    return meInFrame;
}
export function appUrl(url, unitId, page, param) {
    let u;
    for (;;) {
        u = uid();
        let a = appsInFrame[u];
        if (a === undefined) {
            appsInFrame[u] = { hash: u, unit: unitId };
            break;
        }
    }
    url += '#tv' + u + '-' + unitId;
    if (page !== undefined) {
        url += '-' + page;
        if (param !== undefined) {
            for (let i = 0; i < param.length; i++) {
                url += '-' + param[i];
            }
        }
    }
    return { url: url, hash: u };
}
export function loadAppUqs(appOwner, appName) {
    return __awaiter(this, void 0, void 0, function* () {
        let centerAppApi = new CenterAppApi('tv/', undefined);
        let unit = meInFrame.unit;
        let ret = yield centerAppApi.uqs(unit, appOwner, appName);
        centerAppApi.checkUqs(unit, appOwner, appName).then(v => {
            if (v === false)
                nav.start();
        });
        return ret;
    });
}
export function appUq(uq, uqOwner, uqName) {
    return __awaiter(this, void 0, void 0, function* () {
        let uqToken = uqTokens[uq];
        if (uqToken !== undefined)
            return uqToken;
        if (!isBridged()) {
            uqToken = yield uqTokenApi.uq({ unit: meInFrame.unit, uqOwner: uqOwner, uqName: uqName });
            if (uqToken === undefined) {
                let err = 'unauthorized call: uqTokenApi center return undefined!';
                throw err;
            }
            if (uqToken.token === undefined)
                uqToken.token = centerToken;
            let { url, urlDebug } = uqToken;
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
        return new Promise((resolve, reject) => {
            uqToken.resolve = (at) => __awaiter(this, void 0, void 0, function* () {
                let a = yield at;
                console.log('return from parent window: %s', JSON.stringify(a));
                uqToken.url = a.url;
                uqToken.urlDebug = a.urlDebug;
                uqToken.token = a.token;
                resolve(uqToken);
            });
            uqToken.reject = reject;
            (window.opener || window.parent).postMessage({
                type: 'app-api',
                apiName: uq,
                hash: meInFrame.hash,
            }, "*");
        });
    });
}
const brideCenterApis = {};
export function bridgeCenterApi(url, method, body) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('bridgeCenterApi: url=%s, method=%s', url, method);
        return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let callId;
            for (;;) {
                callId = uid();
                let bca = brideCenterApis[callId];
                if (bca === undefined) {
                    brideCenterApis[callId] = {
                        id: callId,
                        resolve: resolve,
                        reject: reject,
                    };
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
        }));
    });
}
function callCenterApiFromMessage(from, message) {
    return __awaiter(this, void 0, void 0, function* () {
        let { callId, url, method, body } = message;
        let result = yield callCenterapi.directCall(url, method, body);
        from.postMessage({
            type: 'center-api-return',
            callId: callId,
            result: result,
        }, '*');
    });
}
function bridgeCenterApiReturn(message) {
    let { callId, result } = message;
    let bca = brideCenterApis[callId];
    if (bca === undefined)
        return;
    brideCenterApis[callId] = undefined;
    bca.resolve(result);
}
//# sourceMappingURL=appBridge.js.map