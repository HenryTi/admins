import _ from 'lodash';
import {HttpChannel, CenterHttpChannel, UqHttpChannel} from './httpChannel';
import {HttpChannelNavUI} from './httpChannelUI';
import {appUq, logoutUqTokens, buildAppUq} from './appBridge';
import {ApiBase} from './apiBase';
import { host } from './host';
import { nav } from '../components';
import { LocalCache, LocalMap, env } from '../tool';
import {decodeUserToken} from '../tool/user';

let channelUIs:{[name:string]: HttpChannel} = {};
let channelNoUIs:{[name:string]: HttpChannel} = {};

export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutUnitxApis();
    logoutUqTokens();
}

interface UqLocal {
    user: number;
    unit: number;
    value: any;
    tick?: number;
    isNet?: boolean;
}
interface UqLocals {
    user: number;
    unit: number;
    uqs: {[uq:string]: UqLocal};
}
/*
const uqLocalEntities = 'uqLocalEntities';
class CacheUqLocals {
    private local:UqLocals;

    async loadAccess(uqApi: UqApi):Promise<any> {
        try {
            let {uqOwner, uqName} = uqApi;
            if (this.local === undefined) {
                let ls = null; // localStorage.getItem(uqLocalEntities);
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
                //this.saveLocal(un, ret);
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
        if (this.local === undefined) return false;
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
*/
export class UqApi extends ApiBase {
    private access:string[];
    uqOwner: string;
    uqName: string;
    uq: string;
    //uqVersion: number;

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

    //setUqVersion(uqVersion:number) {this.uqVersion = undefined}

    async init() {
        await buildAppUq(this.uq, this.uqOwner, this.uqName);
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
        let uqToken = appUq(this.uq); //, this.uqOwner, this.uqName);
        if (!uqToken) {
            debugger;
            await this.init();
            uqToken = appUq(this.uq);
        }
        let {url, token} = uqToken;
        this.token = token;
        channel = new UqHttpChannel(url, token, channelUI);
        return channels[this.uq] = channel;
    }

    /*async update():Promise<string> {
        return await this.get('update');
    }*/

    /*
    async __loadAccess():Promise<any> {
        let acc = this.access === undefined?
            '' :
            this.access.join('|');
        let ret = await this.get('access', {acc:acc});
        return ret;
    }
    */
    async loadAccess():Promise<any> {
        //return await localUqs.loadAccess(this);
        let acc = this.access === undefined?
            '' :
            this.access.join('|');
        let ret = await this.get('access', {acc:acc});
        return ret;
    }

    /*async loadEntities():Promise<any> {
        return await this.get('entities');
    }*/

    /*
    async checkAccess():Promise<boolean> {
        return await localUqs.checkAccess(this);
    }
    */

    async schema(name:string):Promise<any> {
        return await this.get('schema/' + name);
    }

    async queueModify(start:number, page:number, entities:string) {
        return await this.post('queue-modify', {start:start, page:page, entities:entities});
    }

    /*async schemas(names:string[]):Promise<any[]> {
        return await this.post('schema', names);
    }*/

    /*
    async tuidGet(name:string, id:number):Promise<any> {
        return await this.get('tuid/' + name + '/' + id);
    }

    async tuidGetAll(name:string):Promise<any[]> {
        return await this.get('tuid-all/' + name + '/');
    }

    async tuidSave(name:string, params:any):Promise<any> {
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
    async tuidArrSave(name:string, arr:string, owner:number, params:any):Promise<any> {
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
    */
    /*async sheetSave(name:string, data:object):Promise<any> {
        return await this.post('sheet/' + name, data);
    }*/

    /*async sheetAction(name:string, data:object) {
        return await this.put('sheet/' + name, data);
    }*/

    /*async stateSheets(name:string, data:object) {
        return await this.post('sheet/' + name + '/states', data);
    }*/

    /*async stateSheetCount(name:string):Promise<any> {
        return await this.get('sheet/' + name + '/statecount');
    }*/

    /*async mySheets(name:string, data:object) {
        return await this.post('sheet/' + name + '/my-sheets', data);
    }*/

    /*async getSheet(name:string, id:number):Promise<any> {
        return await this.get('sheet/' + name + '/get/' + id);
    }*/

    /*async sheetArchives(name:string, data:object):Promise<any> {
        return await this.post('sheet/' + name + '/archives', data);
    }

    async sheetArchive(name:string, id:number):Promise<any> {
        return await this.get('sheet/' + name + '/archive/' + id);
    }*/

    /*async action(name:string, data:object):Promise<any> {
        return await this.post('action/' + name, data);
    }

    async actionReturns(name:string, data:object):Promise<any[][]> {
        return await this.post('action/' + name + '/returns', data);
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
    */
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
    /*async user():Promise<any> {
        return await this.get('user');
    }*/
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
        let {token, db, url, urlTest} = ret;
        let realUrl = host.getUrlOrTest(db, url, urlTest);
        this.token = token;
        return new UqHttpChannel(realUrl, token, channelUI);
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
    return centerChannelUI = new CenterHttpChannel(centerHost, centerToken, new HttpChannelNavUI());
}
function getCenterChannel():HttpChannel {
    if (centerChannel !== undefined) return centerChannel;
    return centerChannel = new CenterHttpChannel(centerHost, centerToken);
}

export abstract class CenterApiBase extends ApiBase {
    /*
    constructor(path: string, showWaiting?: boolean) {
        super(path, showWaiting);
    }*/

    protected async getHttpChannel(): Promise<HttpChannel> {
        return (this.showWaiting === true || this.showWaiting === undefined)?
            getCenterChannelUI():
            getCenterChannel();
    }
}

const uqTokensName = 'uqTokens';
export class UqTokenApi extends CenterApiBase {
    private localMap: LocalMap = env.localDb.map(uqTokensName);

    async uq(params: {unit:number, uqOwner:string, uqName:string}):Promise<any> {
        let {uqOwner, uqName} = params;
        let un = uqOwner+'/'+uqName;
        let localCache = this.localMap.child(un);
        try {
            let uqToken:UqLocal = localCache.get();
            if (uqToken !== undefined) {
                let {unit, user} = uqToken;
                if (unit !== params.unit || user !== loginedUserId) {
                    localCache.remove();
                    uqToken = undefined;
                }
            }
            let nowTick = Math.floor(Date.now() / 1000);
            if (uqToken !== undefined) {
                let {tick, value} = uqToken;
                if (value !== undefined && (nowTick - tick) < 24*3600) {
                    return _.clone(value);
                }
            }
            let appUqParams:any = _.clone(params);
            appUqParams.testing = host.testing;
            let ret = await this.get('app-uq', appUqParams);
            if (ret === undefined) {
                let {unit, uqOwner, uqName} = params;
                let err = `center get app-uq(unit=${unit}, '${uqOwner}/${uqName}') - not exists or no unit-service`;
                throw err;
            }

            uqToken = {
                unit: params.unit,
                user: loginedUserId,
                tick: nowTick,
                value: ret,
            }
            localCache.set(uqToken);
            return _.clone(ret);
        }
        catch (err) {
            localCache.remove();
            throw err;
        }
    }
}

export const uqTokenApi = new UqTokenApi('tv/tie/', undefined);

export class CallCenterApi extends CenterApiBase {
    directCall(url:string, method:string, body:any):Promise<any> {
        return this.call(url, method, body);
    }
}
export const callCenterapi = new CallCenterApi('', undefined);

export interface UqAppData {
    appName: string;
    appOwner: string;
    id: number;
    version: string;        // AppUI version
    uqs: UqData[];
}

export interface UqData {
    id: number;
    uqOwner: string;
    uqName: string;
    access: string;
    newVersion: boolean;
}

export interface UqServiceData {
    id: number;
    db: string;
    url: string;
    urlTest: string;
    token: string;
}

const appUqsName = 'appUqs';

export class CenterAppApi extends CenterApiBase {
    private local: LocalCache = env.localDb.item(appUqsName);
    //private cachedUqs: UqAppData;
    async uqs(appOwner:string, appName:string):Promise<UqAppData> {
        let ret:UqAppData;
        let appUqs = this.local.get();
        if (appUqs) {
            let {appOwner:rAppOwner, appName:rAppName} = appUqs;
            if (appOwner === rAppOwner && appName === rAppName) ret = appUqs;
        }
        if (ret === undefined) {
            ret = await this.uqsPure(appOwner, appName);
            ret.appName = appName;
            ret.appOwner = appOwner;
            //localStorage.setItem(JSON.stringify(obj));
            this.local.set(ret);
        }
        //return this.cachedUqs = _.cloneDeep(ret);
        return ret;
    }
    private async uqsPure(appOwner:string, appName:string):Promise<UqAppData> {
        return await this.get('tie/app-uqs', {appOwner:appOwner, appName:appName});
    }
    private async isOkCheckUqs(appOwner:string, appName:string):Promise<boolean> {
        let ret = await this.uqsPure(appOwner, appName);
        let {id:cachedId, uqs:cachedUqs} = this.local.get(); //.cachedUqs;
        let {id:retId, uqs:retUqs} = ret;
        if (cachedId !== retId) return false;
        if (cachedUqs.length !== retUqs.length) return false;
        let len = cachedUqs.length;
        for (let i=0; i<len; i++) {
            if (_.isMatch(cachedUqs[i], retUqs[i]) === false) return false;
        }
        return true;
    }
    async checkUqs(appOwner:string, appName:string):Promise<boolean> {
        let ret = await this.isOkCheckUqs(appOwner, appName);
        if (ret === false) {
            this.local.remove();
            nav.start();
        }
        return ret;
    }
    async unitxUq(unit:number):Promise<UqServiceData> {
        return await this.get('tie/unitx-uq', {unit:unit});
    }
    async changePassword(param: {orgPassword:string, newPassword:string}) {
        return await this.post('tie/change-password', param);
    }
}

export async function loadAppUqs(appOwner:string, appName:string): Promise<UqAppData> {
    let centerAppApi = new CenterAppApi('tv/', undefined);
    //let unit = meInFrame.unit;
    let ret = await centerAppApi.uqs(appOwner, appName);
    await centerAppApi.checkUqs(appOwner, appName);
    /*
    .then(v => {
        if (v === false) {
            localStorage.removeItem(appUqs);
            nav.start();
        }
    });
    */
    return ret;
}

//import { nav } from '../ui';

export interface RegisterParameter {
    nick:string, 
    user:string, 
    pwd:string,
    country:number, 
    mobile:number, 
    mobileCountry:number,
    email:string,
    verify:string,
};

export class UserApi extends CenterApiBase {
    async login(params: {user: string, pwd: string, guest: number}): Promise<any> {
        //(params as any).device = nav.local.device.get();
        let ret = await this.get('user/login', params);
        switch (typeof ret) {
            default: return;
            case 'string': return decodeUserToken(ret);
            case 'object':
                let token = ret.token;
                let user = decodeUserToken(token);
                let {nick, icon} = ret;
                if (nick) user.nick = nick;
                if (icon) user.icon = icon;
                return user;
        }
        // !== undefined) return decodeToken(token);
    }
    async register(params: RegisterParameter): Promise<any>
    {
        return await this.post('user/register', params);
    }

    async setVerify(account:string, type:'mobile'|'email', oem:string) {
        return await this.post('user/set-verify', {account:account, type:type});
    }

    async checkVerify(account:string, verify:string) {
        return await this.post('user/check-verify', {account:account, verify:verify});
    }

    async isExists(account:string) {
        return await this.get('user/is-exists', {account:account});
    }

    async resetPassword(account:string, password:string, verify:string, type:'mobile'|'email') {
        return await this.post('user/reset-password', {account:account, password, verify, type});
    }
    
    async userSetProp(prop:string, value:any) {
        await this.post('tie/user-set-prop', {prop:prop, value:value});
    }

    async me():Promise<any> {
        return await this.get('tie/me');
    }
}

export const userApi = new UserApi('tv/', undefined);
