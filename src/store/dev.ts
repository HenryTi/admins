import {observable, autorun} from 'mobx';
import * as _ from 'lodash';
import {devApi} from '../api';
import {DevModel, Unit} from '../model';
import {Store} from './index';
import { observer } from 'mobx-react';

interface Counts {
    api: number;
    app: number;
    server: number;
    service: number;
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
    async save(item:T):Promise<boolean> {
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
            item.id = id;
            this.items.unshift(item);
            this._inc();
        }
        else {
            _.assign(this.cur, values);
        }
        return true;
    }
    protected abstract _save(item:T):Promise<number>;
    async del():Promise<void> {
        let c = this.cur;
        if (c === undefined) return;
        let id = c.id;
        await this._del(c);
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
    @observable apis: DevModel.Api[] = undefined;
    @observable searchedApis: DevModel.Api[] = undefined;
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

    public async loadCurApis() {
        let ret = await devApi.loadAppApis(this.cur.id);
        this.apis = ret;
    }
    public async searchApi(key:string) {
        this.searchedApis = await devApi.searchApi(this.store.unit.id, key, 0, searchPageSize);
    }
    public async appBindApi(apiIds:number[], bind:boolean) {
        await devApi.appBindApi(this.store.unit.id, this.cur.id, apiIds, bind? 1:0);
        for (let api of apiIds) {
            if (bind) {
                if (this.searchedApis !== undefined) {
                    let find = this.searchedApis.find(a => a.id === api);
                    if (find !== undefined) this.apis.unshift(find);
                }
            }
            else {
                let index = this.apis.findIndex(a => a.id === api);
                if (index>=0) this.apis.splice(index, 1);
            }
        }
    }
}

class Apis extends ObjItems<DevModel.Api> {
    protected async _load() {
        let ret = await devApi.apis(this.store.unit.id);
        return ret;
    }
    protected async _save(item:DevModel.Api):Promise<number> {
        return await devApi.saveApi(item);
    }
    protected async _del(item:DevModel.Api):Promise<void> {
        await devApi.delApi(this.store.unit.id, item.id);
    }
    protected _inc() { this.dev.counts.api++; }
    protected _dec() { this.dev.counts.api--; }
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
    }
}

export class Dev {
    private store:Store;
    constructor(store:Store) {
        this.store = store;
        this.apps = new Apps(store, this);
        this.apis = new Apis(store, this);
        this.servers = new Servers(store, this);
        this.services = new Services(store, this);
        this.searchApp = new SearchItems<DevModel.App>(store, this, devApi.searchApp.bind(devApi));
        this.searchApi = new SearchItems<DevModel.Api>(store, this, devApi.searchApi.bind(devApi));
        this.searchServer = new SearchItems<DevModel.Server>(store, this, devApi.searchServer.bind(devApi));
    }

    @observable counts:Counts = undefined;
    apps:Apps = undefined;
    apis:Apis = undefined;
    servers:Servers = undefined;
    services:Services = undefined;

    searchApp:SearchItems<DevModel.App> = undefined;
    searchApi:SearchItems<DevModel.Api> = undefined;
    searchServer:SearchItems<DevModel.Server> = undefined;
    
    async loadCounts(): Promise<void> {
        let unit = this.store.unit;
        this.counts = await devApi.counts(unit.id);
    }
}