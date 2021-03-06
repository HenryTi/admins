import {observable, autorun} from 'mobx';
import _ from 'lodash';
import {devApi} from '../api';
import {DevModel, Unit} from '../model';
import {Store} from './index';

interface Counts {
    uq: number;
    app: number;
    bus: number;
    server: number;
    service: number;
    //uqdb: number;
}

export abstract class ObjItems<T extends DevModel.ObjBase> {
    protected store:Store;
    protected dev:Dev;
    constructor(store:Store, dev:Dev) {
        this.store = store;
        this.dev = dev;
    }

    @observable items: T[] = undefined;
    @observable cur: T = undefined;

    async load():Promise<void> {
         let ret = await this._load();
         this.items = ret;
    }
    protected abstract _load():Promise<T[]>;
    async saveCur(item:T):Promise<boolean> {
        let values:any = {};
        if (this.cur !== undefined) {
            _.assign(values, this.cur, item);
        }
        else {
            _.assign(values, item);
        }

        values.unit = item.unit = this.store.unit.id;
        let id = await this._save(values);
        if (this.cur === undefined) {
            if (id === 0) return false;
            values.id = id;
            if (this.items !== undefined) this.items.unshift(values);
            this._inc();
            this.cur = observable(values);
        }
        else {
            _.assign(this.cur, values);
        }
        return true;
    }
    async check(item:T):Promise<boolean> {
        return true;
    }
    async save(item:T):Promise<T> {
        let values:any = {};
        _.assign(values, item);

        values.unit = item.unit = this.store.unit.id;
        let id = await this._save(values);
        if (id === 0) return;
        values.id = id;
        return values;
    }
    protected abstract _save(item:T):Promise<number>;
    async del():Promise<void> {
        let c = this.cur;
        if (c === undefined) return;
        let id = c.id;
        await this._del(c);
        if (this.items === undefined) return;
        let index = this.items.findIndex(v => v.id === id);
        if (index>=0) {
            this.items.splice(index, 1);
            this._dec();
        }
    }
    protected abstract _del(item:T):Promise<void>;
    protected abstract _inc();
    protected abstract _dec();
}

class Apps extends ObjItems<DevModel.App> {
    @observable uqs: DevModel.UQ[] = undefined;
    @observable searchedUqs: DevModel.UQ[] = undefined;
    //@observable service: DevModel.Service = null;
    protected async _load() {
        return await devApi.apps(this.store.unit.id);
    }
    protected async _save(item:DevModel.App):Promise<number> {
        return await devApi.saveApp(item);
    }
    protected async _del(item:DevModel.App):Promise<void> {
        await devApi.delApp(this.store.unit.id, item.id);
    }
    protected _inc() { this.dev.counts.app++; }
    protected _dec() { this.dev.counts.app--; }

    public async loadCurUqs() {
        let ret = await devApi.loadAppUqs(this.cur.id);
        this.uqs = ret;
    }
    public async searchUq(key:string) {
        this.searchedUqs = await devApi.searchUq(this.store.unit.id, key, 0, searchPageSize);
    }
    public async appBindUq(uqs:{id:number, access:string[]}[], bind:boolean) {
        let allUqs:{id:number, access:string[]}[] = this.uqs.map(v => {
            let {id, access} = v;
            return {id: id, access: [access]};
        });
        for (let uq of uqs) {
            let index = allUqs.findIndex(v => v.id === uq.id);
            if (bind === true) {
                if (index < 0) allUqs.unshift(uq);
            }
            else {
                allUqs.splice(index, 1);
            }
        }
        await devApi.appBindUq(this.store.unit.id, this.cur.id, allUqs);
        for (let uq of uqs) {
            let index = this.uqs.findIndex(a => a.id === uq.id);
            if (index>=0) this.uqs.splice(index, 1);
            if (bind === true) {
                if (this.searchedUqs !== undefined) {
                    let find = this.searchedUqs.find(a => a.id === uq.id);
                    if (find !== undefined) this.uqs.unshift(find);
                }
            }
            else {
                // 已经删除，不需要处理
            }
        }
    }
}

class Uqs extends ObjItems<DevModel.UQ> {
    protected async _load() {
        let ret = await devApi.uqs(this.store.unit.id);
        return ret;
    }
    protected async _save(item:DevModel.UQ):Promise<number> {
        //let {access} = item;
        //if (!access) access = "*';
        //let parts = access.split(',').map(v => v.trim()).filter(v => v!=='');
        //item.access = parts.join(',');
        return await devApi.saveUq(item);
    }
    protected async _del(item:DevModel.UQ):Promise<void> {
        await devApi.delUq(this.store.unit.id, item.id);
    }
    protected _inc() { this.dev.counts.uq++; }
    protected _dec() { this.dev.counts.uq--; }
}

class Buses extends ObjItems<DevModel.Bus> {
    protected async _load() {
        let ret = await devApi.buses(this.store.unit.id);
        return ret;
    }
    protected async _save(item:DevModel.Bus):Promise<number> {
        return await devApi.saveBus(item);
    }
    protected async _del(item:DevModel.Bus):Promise<void> {
        await devApi.delBus(this.store.unit.id, item.id);
    }
    protected _inc() { this.dev.counts.bus++; }
    protected _dec() { this.dev.counts.bus--; }
    async check(item:DevModel.Bus):Promise<boolean> {
        let {schema} = item;
        try {
            let bus = JSON.parse(schema);
            for (let i in bus) {
                let face = bus[i];
                if (face === null || face === undefined) {
                    alert(`face ${i} is null，请设置内容`);
                    return false;
                }
                switch (typeof face) {
                    case 'function':
                        alert(`face ${i} is function，不接受function`);
                        return false;
                    //case 'bigint':
                    case 'boolean':
                    case 'number':
                    case 'string':
                        alert(`face ${i} 应该是数组或者对象`);
                        return false;
                }
                if (Array.isArray(face) === true) {
                    if (checkBusFace(face, bus) === false) return false;
                }
                else {
                    if (checkBusQuery(face, bus) === false) return false;
                }
            }
            return true;
        }
        catch (err) {
            alert(err.message);
            return false;
        }
    }
}

const paramTypes = ['id', 'number', 'string'];
const busTypes = [...paramTypes, 'array'];
function refNameOk(faceName:string, bus:any):boolean {
    let face = bus[faceName];
    if (face === undefined) {
        alert(`face ${faceName} not defined`);
        return false;
    }
    if (Array.isArray(face) === false) {
        alert(`face ${faceName} is referenced, bus is not array`);
        return false;
    }
    return refArrayOk(face as any[], bus);
}

function refArrayOk(items:any[], bus:any):boolean {
    for (let item of items) {
        let {type} = item;
        if (['id', 'string', 'number', 'array'].indexOf(type) < 0) {
            alert(`type ${type} out of ['id', 'string', 'number', 'array']`);
            return false;
        }
    }
    return true;
}

function checkBusFace(face: any[], bus:any):boolean {
    if (!face || typeof face !== 'object') {
        alert('only object');
        return false;
    }
    for (let field of face) {
        let {type} = field;
        if (type === undefined) {
            alert('type not defined');
            return false;
        }
        else if (type === 'array') {
            let {fields} = field;
            if (refNameOk(fields, bus) === false) {
                return false;
            }
        }
        if (busTypes.indexOf(type) < 0) {
            if (type === 'date') {
                alert('不再支持数据类型date，请用number unixtime作为媒介')
            }
            else {
                alert(`不支持数据类型 ${type}`);
            }
            return false;
        }
    }
    return true;
}

function checkBusQuery(face: any, bus:any):boolean {
    for (let i in face) {
        let item = face[i];
        switch (i) {
            default:
                alert(i + ': not allowed in bus query.');
                return false;
            case 'param':
                if (checkBusQueryParam(item, bus) === false) return false;
                break;
            case 'returns':
                let returns = item;
                if (typeof item === 'string') {
                    returns = bus[item];
                    if (returns === undefined) {
                        alert(item + ' is not defined');
                        return false;
                    }
                }
                if (checkBusFace(returns, bus) === false) return false;
                break;
        }
    }
    return true;
}

function checkBusQueryParam(param: any, bus:any):boolean {
    if (param === null || param === undefined) return;
    switch (typeof param) {
        case 'string':
            return refNameOk(param, bus);
        default:
            if (Array.isArray(param)) {
                return refArrayOk(param, bus);
            }
            break;
    }
    alert('param of a query can only be string or array');
    return false;
}

class Servers extends ObjItems<DevModel.Server> {
    protected async _load() {
        return await devApi.servers(this.store.unit.id);
    }
    protected async _save(item:DevModel.Server):Promise<number> {
        return await devApi.saveServer(item);
    }
    protected async _del(item:DevModel.Server):Promise<void> {
        await devApi.delServer(this.store.unit.id, item.id);
    }
    protected _inc() { this.dev.counts.server++; }
    protected _dec() { this.dev.counts.server--; }
}
class Services extends ObjItems<DevModel.Service> {
    protected async _load() {
        return await devApi.services(this.store.unit.id);
    }
    protected async _save(item:DevModel.Service):Promise<number> {
        return await devApi.saveService(item);
    }
    protected async _del(item:DevModel.Service):Promise<void> {
        await devApi.delService(this.store.unit.id, item.id);
    }
    protected _inc() { this.dev.counts.service++; }
    protected _dec() { this.dev.counts.service--; }
    async changeProp(prop:string, value:any):Promise<number> {
        let ret = await devApi.changeServiceProp(this.store.unit.id, this.cur.id, prop, value);
        switch (prop) {
            case 'url': this.cur.url = value; break;
            case 'urlTest': this.cur.urlTest = value; break;
            case 'server': this.cur.server = value; break;
            case 'db': this.cur.db = value; break;
            //case 'db_type': this.cur.db_type = value; break;
            //case 'connection': this.cur.connection = value; break;
        }
        return ret;
    }
    async loadUqServices(uq:number):Promise<void> {
        let ret = await devApi.loadUqServices(this.store.unit.id, uq);
        this.items = ret[0];
    }
}

const searchPageSize = 50;
type Search = (unit:number,key:string,pageStart:number,pageSize:number)=>Promise<any[]>;
class SearchItems<T extends DevModel.ObjBase> {
    private store:Store;
    private dev:Dev;
    private search:(unit:number,key:string,pageStart:number,pageSize:number)=>Promise<any[]>;

    constructor(store:Store, dev:Dev, search:Search) {
        this.store = store;
        this.dev = dev;
        this.search = search;
    }

    @observable items: T[] = undefined;
    allLoaded: boolean = false;
    private key: string;
    private pageStart = 0;

    async first(key:string) {
        this.key = key;
        this.items = undefined;
        this.allLoaded = false;
        this.pageStart = 0;
        await this.more();
    }

    async more():Promise<void> {
        if (this.allLoaded === true) return;
        let ret = await this.search(this.store.unit.id, this.key, this.pageStart, searchPageSize);
        let len = ret.length;
        if (len > searchPageSize) {
            this.allLoaded = false;
            --len;
            ret.splice(len, 1);
        }
        else {
            this.allLoaded = true;
        }
        if (len > 0) {
            this.pageStart = ret[len-1].id;
            if (this.items === undefined)
                this.items = ret;
            else
                this.items.push(...ret);
        }
        else {
            this.items = [];
        }
    }
}

export class Dev {
    private store:Store;
    constructor(store:Store) {
        this.store = store;
        this.apps = new Apps(store, this);
        this.uqs = new Uqs(store, this);
        this.buses = new Buses(store, this);
        this.servers = new Servers(store, this);
        //this.uqdbs = new Uqdbs(store, this);
        this.services = new Services(store, this);
        this.searchApp = new SearchItems<DevModel.App>(store, this, devApi.searchApp.bind(devApi));
        this.searchUq = new SearchItems<DevModel.UQ>(store, this, devApi.searchUq.bind(devApi));
        this.searchServer = new SearchItems<DevModel.Server>(store, this, devApi.searchServer.bind(devApi));
    }

    @observable counts:Counts = undefined;
    apps:Apps = undefined;
    uqs:Uqs = undefined;
    buses:Buses = undefined;
    servers:Servers = undefined;
    //uqdbs:Uqdbs = undefined;
    services:Services = undefined;

    searchApp:SearchItems<DevModel.App> = undefined;
    searchUq:SearchItems<DevModel.UQ> = undefined;
    searchServer:SearchItems<DevModel.Server> = undefined;
    //searchUqdb:SearchItems<DevModel.Uqdb> = undefined;
    
    async loadCounts(): Promise<void> {
        let {unit} = this.store;
        this.counts = await devApi.counts(unit.id);
    }
}
