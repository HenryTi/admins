import {observable, autorun} from 'mobx';
import * as _ from 'lodash';
import {devApi} from '../api';
import {DevModel} from '../model';
import {Store} from './index';
import { observer } from 'mobx-react';

interface Counts {
    api: number;
    app: number;
    server: number;
    service: number;
}

export abstract class List<T extends DevModel.ObjBase> {
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
        let values = _.clone(item) as any;
        if (this.cur !== undefined) values.id = this.cur.id;
        values.unit = this.store.unit.id;
        let id = await this._save(values);
        if (this.cur === undefined) {
            if (id === 0) return false;
            item.id = id;
            this.items.unshift(item);
            this._inc();
        }
        else {
            _.assign(this.cur, item);
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

class Apps extends List<DevModel.App> {
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
}

class Apis extends List<DevModel.Api> {
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

class Servers extends List<DevModel.Server> {
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

class Services extends List<DevModel.Service> {
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

export class Dev {
    private store:Store;
    constructor(store:Store) {
        this.store = store;
        this.apps = new Apps(store, this);
        this.apis = new Apis(store, this);
        this.servers = new Servers(store, this);
        this.services = new Services(store, this);
    }

    @observable counts:Counts = undefined;
    apps:Apps = undefined;
    apis:Apis = undefined;
    servers:Servers = undefined;
    services:Services = undefined;
    
    async loadCounts(): Promise<void> {
        let unit = this.store.unit;
        this.counts = await devApi.counts(unit.id);
    }
}
