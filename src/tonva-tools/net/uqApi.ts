import _ from 'lodash';
import {HttpChannel} from './httpChannel';
import {HttpChannelUI, HttpChannelNavUI} from './httpChannelUI';
import {appUq, appInFrame, logoutUqTokens} from './appBridge';
import {ApiBase} from './apiBase';
import { host } from './host';
import { nav } from '../ui';

let channelUIs:{[name:string]: HttpChannel} = {};
let channelNoUIs:{[name:string]: HttpChannel} = {};

export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutUnitxApis();
    logoutUqTokens();
}

interface UqLocal {
    value: any;
    tick?: number;
    isNet?: boolean;
}
interface UqLocals {
    user: number;
    unit: number;
    uqs: {[uq:string]: UqLocal};
}

const uqLocalEntities = 'uqLocalEntities';
class CacheUqLocals {
    private local:UqLocals;

    async loadAccess(uqApi: UqApi):Promise<any> {
        try {
            let {uqOwner, uqName} = uqApi;
            if (this.local === undefined) {
                let ls = localStorage.getItem(uqLocalEntities);
                if (ls !== null) {
                    this.local = JSON.parse(ls);
                }
            }
            if (this.local !== undefined) {
                let {user, uqs} = this.local;
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

            let ret: any;
            let un = uqOwner+'/'+uqName;
            let uq = this.local.uqs[un];
            if (uq !== undefined) {
                let {value} = uq;
                ret = value;
            }
            if (ret === undefined) {
                ret = await uqApi.__loadAccess();
                this.saveLocal(un, ret);
            }
            return _.cloneDeep(ret);
        }
        catch (err) {
            this.local = undefined;
            localStorage.removeItem(uqLocalEntities);
            throw err;
        }
    }

    private saveLocal(uqName:string, accessValue: any) {
        this.local.uqs[uqName] = {
            value: accessValue,
            isNet: true,
        }
        let str = JSON.stringify(this.local);
        localStorage.setItem(uqLocalEntities, str);
    }

    async checkAccess(uqApi: UqApi):Promise<boolean> {
        let {uqOwner, uqName} = uqApi;
        let un = uqOwner+'/'+uqName;
        let uq = this.local.uqs[un];
        if (uq === undefined) return false;
        let {isNet, value} = uq;
        if (isNet === true) return true;
        let ret = await uqApi.__loadAccess();
        let isMatch = _.isMatch(value, ret);
        if (isMatch === false) {
            this.saveLocal(un, ret);
            return false;
        }
        uq.isNet = true;
        return true;
    }
}

const localUqs = new CacheUqLocals;
export class UqApi extends ApiBase {
    private access:string[];
    uqOwner: string;
    uqName: string;
    uq: string;

    constructor(basePath: string, uqOwner: string, uqName: string, access:string[], showWaiting?: boolean) {
        super(basePath, showWaiting);
        if (uqName) {
            this.uqOwner = uqOwner;
            this.uqName = uqName;
            this.uq = uqOwner + '/' + uqName;
        }
        this.access = access;
        this.showWaiting = showWaiting;
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        let channels: {[name:string]: HttpChannel};
        let channelUI: HttpChannelNavUI;
        if (this.showWaiting === true || this.showWaiting === undefined) {
            channels = channelUIs;
            channelUI = new HttpChannelNavUI();
        }
        else {
            channels = channelNoUIs;
        }
        let channel = channels[this.uq];
        if (channel !== undefined) return channel;
        let uqToken = await appUq(this.uq, this.uqOwner, this.uqName);
        this.token = uqToken.token;
        channel = new HttpChannel(false, uqToken.url, uqToken.token, channelUI);
        return channels[this.uq] = channel;
    }


    async update():Promise<string> {
        return await this.get('update');
    }

    async __loadAccess():Promise<any> {
        let acc = this.access === undefined?
            '' :
            this.access.join('|');
        let ret = await this.get('access', {acc:acc});
        return ret;
    }

    async loadAccess():Promise<any> {
        return await localUqs.loadAccess(this);
    }

    async loadEntities():Promise<any> {
        return await this.get('entities');
    }

    async checkAccess():Promise<boolean> {
        return await localUqs.checkAccess(this);
    }

    async schema(name:string):Promise<any> {
        return await this.get('schema/' + name);
    }

    async schemas(names:string[]):Promise<any[]> {
        return await this.post('schema', names);
    }

    async tuidGet(name:string, id:number):Promise<any> {
        return await this.get('tuid/' + name + '/' + id);
    }

    async tuidGetAll(name:string):Promise<any[]> {
        return await this.get('tuid-all/' + name + '/');
    }

    async tuidSave(name:string, params):Promise<any> {
        return await this.post('tuid/' + name, params);
    }

    async tuidSearch(name:string, arr:string, owner:number, key:string, pageStart:string|number, pageSize:number):Promise<any> {
        let ret = await this.post('tuids/' + name, {
            arr: arr,
            owner: owner,
            key: key,
            pageStart: pageStart,
            pageSize: pageSize
        });
        return ret;
    }
    async tuidArrGet(name:string, arr:string, owner:number, id:number):Promise<any> {
        return await this.get('tuid-arr/' + name + '/' + owner + '/' + arr + '/' + id);
    }
    async tuidArrGetAll(name:string, arr:string, owner:number):Promise<any[]> {
        return await this.get('tuid-arr-all/' + name + '/' + owner + '/' + arr + '/');
    }
    async tuidArrSave(name:string, arr:string, owner:number, params):Promise<any> {
        return await this.post('tuid-arr/' + name + '/' + owner + '/' + arr + '/', params);
    }
    async tuidArrPos(name:string, arr:string, owner:number, id:number, order:number):Promise<any> {
        return await this.post('tuid-arr-pos/' + name + '/' + owner + '/' + arr + '/', {
            id: id,
            $order: order
        });
    }

    async tuidIds(name:string, arr:string, ids:number[]):Promise<any[]> {
        try {
            let url = 'tuidids/' + name + '/';
            if (arr !== undefined) url += arr;
            else url += '$';
            let ret = await this.post(url, ids);
            return ret;
        }
        catch (e) {
            console.error(e);
        }
    }

    async proxied(name:string, proxy:string, id:number):Promise<any> {
        try {
            let url = 'tuid-proxy/' + name + '/' + proxy + '/' + id;
            let ret = await this.get(url);
            return ret;
        }
        catch (e) {
            console.error(e);
        }
    }

    async sheetSave(name:string, data:object):Promise<any> {
        return await this.post('sheet/' + name, data);
    }

    async sheetAction(name:string, data:object) {
        return await this.put('sheet/' + name, data);
    }

    async stateSheets(name:string, data:object) {
        return await this.post('sheet/' + name + '/states', data);
    }

    async stateSheetCount(name:string):Promise<any> {
        return await this.get('sheet/' + name + '/statecount');
    }

    async getSheet(name:string, id:number):Promise<any> {
        return await this.get('sheet/' + name + '/get/' + id);
    }

    async sheetArchives(name:string, data:object):Promise<any> {
        return await this.post('sheet/' + name + '/archives', data);
    }

    async sheetArchive(name:string, id:number):Promise<any> {
        return await this.get('sheet/' + name + '/archive/' + id);
    }

    async action(name:string, data:object):Promise<any> {
        return await this.post('action/' + name, data);
    }

    async page(name:string, pageStart:any, pageSize:number, params:any):Promise<string> {
        let p:any;
        switch (typeof params) {
            case 'undefined': p = {key: ''}; break;
            default: p = _.clone(params); break;
        }
        p['$pageStart'] = pageStart;
        p['$pageSize'] = pageSize;
        return await this.post('query-page/' + name, p);
    }

    async query(name:string, params:any):Promise<any> {
        let ret = await this.post('query/' + name, params);
        return ret;
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
    async user():Promise<any> {
        return await this.get('user');
    }
}

let channels:{[unitId:number]: HttpChannel} = {};

export function logoutUnitxApis() {
    channels = {};
}

export class UnitxApi extends UqApi {
    private unitId:number;
    constructor(unitId:number) {
        super('tv/', undefined, undefined, undefined, true);
        this.unitId = unitId;
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        let channel = channels[this.unitId];
        if (channel !== undefined) return channel;
        return channels[this.unitId] = await this.buildChannel();
    }

    private async buildChannel():Promise<HttpChannel> {
        let channelUI = new HttpChannelNavUI();
        let centerAppApi = new CenterAppApi('tv/', undefined);
        let ret = await centerAppApi.unitxUq(this.unitId);
        let {token, url, urlDebug} = ret;
        let realUrl = host.getUrlOrDebug(url, urlDebug);
        this.token = token;
        return new HttpChannel(false, realUrl, token, channelUI);
    }
}

let centerHost:string;

export function setCenterUrl(url:string) {
    console.log('setCenterUrl %s', url);
    centerHost = url;
    centerToken = undefined;
    centerChannel = undefined;
    centerChannelUI = undefined;
}

export let centerToken:string|undefined = undefined;

let loginedUserId:number = 0;
export function setCenterToken(userId:number, t?:string) {
    loginedUserId = userId;
    centerToken = t;
    console.log('setCenterToken %s', t);
    centerChannel = undefined;
    centerChannelUI = undefined;
}

let centerChannelUI:HttpChannel;
let centerChannel:HttpChannel;
function getCenterChannelUI():HttpChannel {
    if (centerChannelUI !== undefined) return centerChannelUI;
    return centerChannelUI = new HttpChannel(true, centerHost, centerToken, new HttpChannelNavUI());
}
function getCenterChannel():HttpChannel {
    if (centerChannel !== undefined) return centerChannel;
    return centerChannel = new HttpChannel(true, centerHost, centerToken);
}

export abstract class CenterApi extends ApiBase {
    constructor(path: string, showWaiting?: boolean) {
        super(path, showWaiting);
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        return (this.showWaiting === true || this.showWaiting === undefined)?
            getCenterChannelUI():
            getCenterChannel();
    }
}

const uqTokens = 'uqTokens';
export class UqTokenApi extends CenterApi {
    private local: UqLocals;
    async uq(params: {unit:number, uqOwner:string, uqName:string}):Promise<any> {
        try {
            let {unit:unitParam, uqOwner, uqName} = params;
            if (this.local === undefined) {
                let ls = localStorage.getItem(uqTokens);
                if (ls !== null) {
                    this.local = JSON.parse(ls);
                }
            }
            if (this.local !== undefined) {
                let {unit, user} = this.local;
                if (unit !== unitParam || user !== loginedUserId) this.local = undefined;
            }
            if (this.local === undefined) {
                this.local = {
                    user: loginedUserId,
                    unit: params.unit,
                    uqs: {}
                };
            }

            let un = uqOwner+'/'+uqName;
            let nowTick = new Date().getTime();
            let uq = this.local.uqs[un];
            if (uq !== undefined) {
                let {tick, value} = uq;
                if ((nowTick - tick) < 24*3600*1000) {
                    return _.clone(value);
                }
            }
            let ret = await this.get('app-uq', params);
            this.local.uqs[un] = {
                tick: nowTick,
                value: ret,
            }
            localStorage.setItem(uqTokens, JSON.stringify(this.local));
            return _.clone(ret);
        }
        catch (err) {
            this.local = undefined;
            localStorage.removeItem(uqTokens);
            throw err;
        }
    }
}

export const uqTokenApi = new UqTokenApi('tv/tie/', undefined);

export class CallCenterApi extends CenterApi {
    directCall(url:string, method:string, body:any):Promise<any> {
        return this.call(url, method, body);
    }
}
export const callCenterapi = new CallCenterApi('', undefined);

export interface App {
    id: number;
    uqs: AppUq[];
}

export interface AppUq {
    id: number;
    uqOwner: string;
    uqName: string;
    access: string;
}

export interface UqService {
    id: number;
    url: string;
    urlDebug: string;
    token: string;
}

const appUqs = 'appUqs';

export class CenterAppApi extends CenterApi {
    private cachedUqs: App;
    async uqs(appOwner:string, appName:string):Promise<App> {
        let ret:any;
        let ls = localStorage.getItem(appUqs);
        if (ls !== null) {
            let rLs = JSON.parse(ls);
            let {appOwner:rAppOwner, appName:rAppName, value} = rLs;
            if (appOwner === rAppOwner && appName === rAppName) ret = value;
        }
        if (ret === undefined) {
            ret = await this.uqsPure(appOwner, appName);
            let obj = {
                appOwner:appOwner, 
                appName:appName, 
                value: ret,
            }
            localStorage.setItem(appUqs, JSON.stringify(obj));
        }
        return this.cachedUqs = _.cloneDeep(ret);
    }
    private async uqsPure(appOwner:string, appName:string):Promise<App> {
        return await this.get('tie/app-uqs', {appOwner:appOwner, appName:appName});
    }
    async checkUqs(appOwner:string, appName:string):Promise<boolean> {
        let ret = await this.uqsPure(appOwner, appName);
        let {id:cachedId, uqs:cachedUqs} = this.cachedUqs;
        let {id:retId, uqs:retUqs} = ret;
        if (cachedId !== retId) return false;
        if (cachedUqs.length !== retUqs.length) return false;
        let len = cachedUqs.length;
        for (let i=0; i<len; i++) {
            if (_.isMatch(cachedUqs[i], retUqs[i]) === false) return false;
        }
        return true;
    }
    async unitxUq(unit:number):Promise<UqService> {
        return await this.get('tie/unitx-uq', {unit:unit});
    }
    async changePassword(param: {orgPassword:string, newPassword:string}) {
        return await this.post('tie/reset-password', param);
    }
}

export async function loadAppUqs(appOwner:string, appName:string): Promise<App> {
    let centerAppApi = new CenterAppApi('tv/', undefined);
    //let unit = meInFrame.unit;
    let ret = await centerAppApi.uqs(appOwner, appName);
    centerAppApi.checkUqs(appOwner, appName).then(v => {
        if (v === false) {
            localStorage.removeItem(appUqs);
            nav.start();
        }
    });
    return ret;
}
