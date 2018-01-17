import {observable, autorun} from 'mobx';
//import consts from './consts';
import {nav, meInFrame} from 'tonva-tools';
import {mainApi} from '../api';
import {Unit, UnitApps, App, Api, UnitAdmin} from '../model';
import {Admins} from './admins';
import {Dev} from './dev';
import {CacheUnits, CacheApis, CacheApps, CacheServers} from './cacheIds';

export class Store {
    private get unitId():number {return meInFrame.unit;};
    admins:Admins;
    dev:Dev;
    cacheUnits: CacheUnits;
    cacheApis: CacheApis;
    cacheApps: CacheApps;
    cacheServers: CacheServers;

    @observable unit: Unit;
    @observable apps: {app:number, deleted:boolean}[];

    init() {
        this.unit = undefined;
        this.admins = new Admins(this);
        this.dev = new Dev(this);
        this.cacheUnits = new CacheUnits();
        this.cacheApis = new CacheApis();
        this.cacheApps = new CacheApps();
        this.cacheServers = new CacheServers();
    }

    async unitChangeProp(prop:string, value:any):Promise<void> {
        await mainApi.unitChangeProp(this.unit.id, prop, value);
        this.unit[prop] = value;
    }

    async loadApps(): Promise<void> {
        if (this.apps !== undefined) return;
        let ret = await mainApi.unitApps(this.unitId);
        this.apps = ret.map(v => {
            return {app:v.app, deleted:v.deleted===1}
        });
    }

    async getAppApi(appId: number, apiName): Promise<Api> {
        return;
        /*
        let apps = this.unit.apps;
        if (apps === undefined) return;
        let app = apps.find(v => v.id === appId);
        if (app === undefined) return;
        let apis = app.apis;
        if (apis === undefined) {
            apis = app.apis = {};
        }
        let api:Api = apis[apiName];
        if (api === null) return;
        if (api === undefined) {
            api = await mainApi.appApi(this.unitId, appId, apiName);
            if (api === undefined) {
                api = null;
                apis[apiName] = api;
                return;
            }
        }
        return api;*/
    }

    async loadUnit(): Promise<void> {
        console.log('loadUnit()');
        let ret = await mainApi.unit(this.unitId);
        this.unit = ret;
    }
};

export const store = new Store();

autorun(async () => {
    let user = nav.user;
    if (user === undefined) {
        console.log('autorun: user has logged out');
        return;
    }

    console.log('autorun login');
    store.init();
    await store.loadUnit();
});
