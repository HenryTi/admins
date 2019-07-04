var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import _ from 'lodash';
import { HttpChannel } from './httpChannel';
import { HttpChannelNavUI } from './httpChannelUI';
import { appUq, logoutUqTokens, buildAppUq } from './appBridge';
import { ApiBase } from './apiBase';
import { host } from './host';
import { nav } from '../ui';
let channelUIs = {};
let channelNoUIs = {};
export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutUnitxApis();
    logoutUqTokens();
}
const uqLocalEntities = 'uqLocalEntities';
class CacheUqLocals {
    loadAccess(uqApi) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { uqOwner, uqName } = uqApi;
                if (this.local === undefined) {
                    let ls = localStorage.getItem(uqLocalEntities);
                    if (ls !== null) {
                        this.local = JSON.parse(ls);
                    }
                }
                if (this.local !== undefined) {
                    let { user, uqs } = this.local;
                    if (user !== loginedUserId || uqs === undefined) {
                        this.local = undefined;
                    }
                    else {
                        for (let i in uqs) {
                            let ul = uqs[i];
                            ul.isNet = undefined;
                        }
                    }
                }
                if (this.local === undefined) {
                    this.local = {
                        user: loginedUserId,
                        unit: undefined,
                        uqs: {}
                    };
                }
                let ret;
                let un = uqOwner + '/' + uqName;
                let uq = this.local.uqs[un];
                if (uq !== undefined) {
                    let { value } = uq;
                    ret = value;
                }
                if (ret === undefined) {
                    ret = yield uqApi.__loadAccess();
                    this.saveLocal(un, ret);
                }
                return _.cloneDeep(ret);
            }
            catch (err) {
                this.local = undefined;
                localStorage.removeItem(uqLocalEntities);
                throw err;
            }
        });
    }
    saveLocal(uqName, accessValue) {
        this.local.uqs[uqName] = {
            value: accessValue,
            isNet: true,
        };
        let str = JSON.stringify(this.local);
        localStorage.setItem(uqLocalEntities, str);
    }
    checkAccess(uqApi) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.local === undefined)
                return false;
            let { uqOwner, uqName } = uqApi;
            let un = uqOwner + '/' + uqName;
            let uq = this.local.uqs[un];
            if (uq === undefined)
                return false;
            let { isNet, value } = uq;
            if (isNet === true)
                return true;
            let ret = yield uqApi.__loadAccess();
            let isMatch = _.isMatch(value, ret);
            if (isMatch === false) {
                this.saveLocal(un, ret);
                return false;
            }
            uq.isNet = true;
            return true;
        });
    }
}
const localUqs = new CacheUqLocals;
export class UqApi extends ApiBase {
    constructor(basePath, uqOwner, uqName, access, showWaiting) {
        super(basePath, showWaiting);
        if (uqName) {
            this.uqOwner = uqOwner;
            this.uqName = uqName;
            this.uq = uqOwner + '/' + uqName;
        }
        this.access = access;
        this.showWaiting = showWaiting;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield buildAppUq(this.uq, this.uqOwner, this.uqName);
        });
    }
    getHttpChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            let channels;
            let channelUI;
            if (this.showWaiting === true || this.showWaiting === undefined) {
                channels = channelUIs;
                channelUI = new HttpChannelNavUI();
            }
            else {
                channels = channelNoUIs;
            }
            let channel = channels[this.uq];
            if (channel !== undefined)
                return channel;
            let uqToken = appUq(this.uq); //, this.uqOwner, this.uqName);
            if (!uqToken)
                debugger;
            let { url, token } = uqToken;
            this.token = token;
            channel = new HttpChannel(false, url, token, channelUI);
            return channels[this.uq] = channel;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('update');
        });
    }
    __loadAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            let acc = this.access === undefined ?
                '' :
                this.access.join('|');
            let ret = yield this.get('access', { acc: acc });
            return ret;
        });
    }
    loadAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield localUqs.loadAccess(this);
        });
    }
    loadEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('entities');
        });
    }
    checkAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield localUqs.checkAccess(this);
        });
    }
    schema(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('schema/' + name);
        });
    }
    schemas(names) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('schema', names);
        });
    }
    tuidGet(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid/' + name + '/' + id);
        });
    }
    tuidGetAll(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid-all/' + name + '/');
        });
    }
    tuidSave(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('tuid/' + name, params);
        });
    }
    tuidSearch(name, arr, owner, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post('tuids/' + name, {
                arr: arr,
                owner: owner,
                key: key,
                pageStart: pageStart,
                pageSize: pageSize
            });
            return ret;
        });
    }
    tuidArrGet(name, arr, owner, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid-arr/' + name + '/' + owner + '/' + arr + '/' + id);
        });
    }
    tuidArrGetAll(name, arr, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid-arr-all/' + name + '/' + owner + '/' + arr + '/');
        });
    }
    tuidArrSave(name, arr, owner, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('tuid-arr/' + name + '/' + owner + '/' + arr + '/', params);
        });
    }
    tuidArrPos(name, arr, owner, id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('tuid-arr-pos/' + name + '/' + owner + '/' + arr + '/', {
                id: id,
                $order: order
            });
        });
    }
    tuidIds(name, arr, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = 'tuidids/' + name + '/';
                if (arr !== undefined)
                    url += arr;
                else
                    url += '$';
                let ret = yield this.post(url, ids);
                return ret;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    sheetSave(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('sheet/' + name, data);
        });
    }
    sheetAction(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.put('sheet/' + name, data);
        });
    }
    stateSheets(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('sheet/' + name + '/states', data);
        });
    }
    stateSheetCount(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('sheet/' + name + '/statecount');
        });
    }
    mySheets(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('sheet/' + name + '/my-sheets', data);
        });
    }
    getSheet(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('sheet/' + name + '/get/' + id);
        });
    }
    sheetArchives(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('sheet/' + name + '/archives', data);
        });
    }
    sheetArchive(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('sheet/' + name + '/archive/' + id);
        });
    }
    action(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('action/' + name, data);
        });
    }
    page(name, pageStart, pageSize, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let p;
            switch (typeof params) {
                case 'undefined':
                    p = { key: '' };
                    break;
                default:
                    p = _.clone(params);
                    break;
            }
            p['$pageStart'] = pageStart;
            p['$pageSize'] = pageSize;
            return yield this.post('query-page/' + name, p);
        });
    }
    query(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post('query/' + name, params);
            return ret;
        });
    }
    /*
        async history(name:string, pageStart:any, pageSize:number, params:any):Promise<string> {
            let p = _.clone(params);
            p['$pageStart'] = pageStart;
            p['$pageSize'] = pageSize;
            let ret = await this.post('history/' + name, p);
            return ret;
        }
    
        async book(name:string, pageStart:any, pageSize:number, params:any):Promise<string> {
            let p = _.clone(params);
            p['$pageStart'] = pageStart;
            p['$pageSize'] = pageSize;
            let ret = await this.post('history/' + name, p);
            return ret;
        }
    */
    user() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('user');
        });
    }
}
let channels = {};
export function logoutUnitxApis() {
    channels = {};
}
export class UnitxApi extends UqApi {
    constructor(unitId) {
        super('tv/', undefined, undefined, undefined, true);
        this.unitId = unitId;
    }
    getHttpChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            let channel = channels[this.unitId];
            if (channel !== undefined)
                return channel;
            return channels[this.unitId] = yield this.buildChannel();
        });
    }
    buildChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            let channelUI = new HttpChannelNavUI();
            let centerAppApi = new CenterAppApi('tv/', undefined);
            let ret = yield centerAppApi.unitxUq(this.unitId);
            let { token, url, urlDebug } = ret;
            let realUrl = host.getUrlOrDebug(url, urlDebug);
            this.token = token;
            return new HttpChannel(false, realUrl, token, channelUI);
        });
    }
}
let centerHost;
export function setCenterUrl(url) {
    console.log('setCenterUrl %s', url);
    centerHost = url;
    centerToken = undefined;
    centerChannel = undefined;
    centerChannelUI = undefined;
}
export let centerToken = undefined;
let loginedUserId = 0;
export function setCenterToken(userId, t) {
    loginedUserId = userId;
    centerToken = t;
    console.log('setCenterToken %s', t);
    centerChannel = undefined;
    centerChannelUI = undefined;
}
let centerChannelUI;
let centerChannel;
function getCenterChannelUI() {
    if (centerChannelUI !== undefined)
        return centerChannelUI;
    return centerChannelUI = new HttpChannel(true, centerHost, centerToken, new HttpChannelNavUI());
}
function getCenterChannel() {
    if (centerChannel !== undefined)
        return centerChannel;
    return centerChannel = new HttpChannel(true, centerHost, centerToken);
}
export class CenterApiBase extends ApiBase {
    constructor(path, showWaiting) {
        super(path, showWaiting);
    }
    getHttpChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (this.showWaiting === true || this.showWaiting === undefined) ?
                getCenterChannelUI() :
                getCenterChannel();
        });
    }
}
const uqTokens = 'uqTokens';
export class UqTokenApi extends CenterApiBase {
    uq(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { unit: unitParam, uqOwner, uqName } = params;
                if (this.local === undefined) {
                    let ls = localStorage.getItem(uqTokens);
                    if (ls !== null) {
                        this.local = JSON.parse(ls);
                    }
                }
                if (this.local !== undefined) {
                    let { unit, user } = this.local;
                    if (unit !== unitParam || user !== loginedUserId)
                        this.local = undefined;
                }
                if (this.local === undefined) {
                    this.local = {
                        user: loginedUserId,
                        unit: params.unit,
                        uqs: {}
                    };
                }
                let un = uqOwner + '/' + uqName;
                let nowTick = new Date().getTime();
                let uq = this.local.uqs[un];
                if (uq !== undefined) {
                    let { tick, value } = uq;
                    if (value !== undefined && (nowTick - tick) < 24 * 3600 * 1000) {
                        return _.clone(value);
                    }
                }
                let ret = yield this.get('app-uq', params);
                if (ret === undefined) {
                    let { unit, uqOwner, uqName } = params;
                    let err = `center get app-uq(unit=${unit}, '${uqOwner}/${uqName}') - not exists or no unit-service`;
                    throw err;
                }
                this.local.uqs[un] = {
                    tick: nowTick,
                    value: ret,
                };
                localStorage.setItem(uqTokens, JSON.stringify(this.local));
                return _.clone(ret);
            }
            catch (err) {
                this.local = undefined;
                localStorage.removeItem(uqTokens);
                throw err;
            }
        });
    }
}
export const uqTokenApi = new UqTokenApi('tv/tie/', undefined);
export class CallCenterApi extends CenterApiBase {
    directCall(url, method, body) {
        return this.call(url, method, body);
    }
}
export const callCenterapi = new CallCenterApi('', undefined);
const appUqs = 'appUqs';
export class CenterAppApi extends CenterApiBase {
    uqs(appOwner, appName) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret;
            let ls = localStorage.getItem(appUqs);
            if (ls !== null) {
                let rLs = JSON.parse(ls);
                let { appOwner: rAppOwner, appName: rAppName, value } = rLs;
                if (appOwner === rAppOwner && appName === rAppName)
                    ret = value;
            }
            if (ret === undefined) {
                ret = yield this.uqsPure(appOwner, appName);
                let obj = {
                    appOwner: appOwner,
                    appName: appName,
                    value: ret,
                };
                localStorage.setItem(appUqs, JSON.stringify(obj));
            }
            return this.cachedUqs = _.cloneDeep(ret);
        });
    }
    uqsPure(appOwner, appName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/app-uqs', { appOwner: appOwner, appName: appName });
        });
    }
    checkUqs(appOwner, appName) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.uqsPure(appOwner, appName);
            let { id: cachedId, uqs: cachedUqs } = this.cachedUqs;
            let { id: retId, uqs: retUqs } = ret;
            if (cachedId !== retId)
                return false;
            if (cachedUqs.length !== retUqs.length)
                return false;
            let len = cachedUqs.length;
            for (let i = 0; i < len; i++) {
                if (_.isMatch(cachedUqs[i], retUqs[i]) === false)
                    return false;
            }
            return true;
        });
    }
    unitxUq(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/unitx-uq', { unit: unit });
        });
    }
    changePassword(param) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('tie/reset-password', param);
        });
    }
}
export function loadAppUqs(appOwner, appName) {
    return __awaiter(this, void 0, void 0, function* () {
        let centerAppApi = new CenterAppApi('tv/', undefined);
        //let unit = meInFrame.unit;
        let ret = yield centerAppApi.uqs(appOwner, appName);
        centerAppApi.checkUqs(appOwner, appName).then(v => {
            if (v === false) {
                localStorage.removeItem(appUqs);
                nav.start();
            }
        });
        return ret;
    });
}
//# sourceMappingURL=uqApi.js.map