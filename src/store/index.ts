import {observable, autorun} from 'mobx';
//import consts from './consts';
import {nav, meInFrame} from 'tonva-tools';
import {mainApi} from '../api';
import {Unit, UnitApps, App, Api, UnitAdmin, UnitApp, Role} from '../model';
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
    @observable apps: UnitApp[];
    @observable role:Role;
    @observable roles: Role[];
    @observable roleApps: UnitApp[];

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
        this.apps = await mainApi.unitApps(this.unitId);
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

    async stopUnitApp(appId:number): Promise<void> {
        await mainApi.unitDeleteApp(this.unit.id, appId, 1);
        let app = this.apps.find(v => v.id === appId);
        app.inUnit = 0;
    }

    async restoreUnitApp(appId:number): Promise<void> {
        await mainApi.unitDeleteApp(this.unit.id, appId, 0);
        let app = this.apps.find(v => v.id === appId);
        app.inUnit = 1;
    }

    async addUnitApp(app:UnitApp): Promise<void> {
        await mainApi.unitAddApp(this.unit.id, app.id);
        this.apps.push(app);
    }

    async loadRoles(): Promise<void> {
        if (this.roles !== undefined) return;
        let ret = await mainApi.unitRoles(this.unit.id);
        ret.forEach(v => {
            switch (v.id) {
                case 1: 
                    v.name= '访客';
                    v.discription = '可以获取开放信息';
                    break;
                case 2: 
                    v.name= '普通';
                    v.discription = '能访问最基本的功能';
                    break;
            }
        });
        this.roles = ret;
    }

    async unitAddRole(name:string, discription:string): Promise<number> {
        let id = await mainApi.unitAddRole(this.unit.id, name, discription);
        if (id > 0) {
            this.roles.push({
                id: id,
                name: name,
                discription: discription,
                count: undefined,
            });
        }
        return id;
    }

    async roleChangeProp(prop:string, value:any):Promise<void> {
        await mainApi.unitRoleChangeProp(this.unit.id, this.role.id, prop, value);
        this.role[prop] = value;
    }

    async loadRoleApps():Promise<void> {
        let ret = await mainApi.unitRoleApps(this.unit.id, this.role.id);
        this.roleApps = ret.map(v => {
            return this.apps.find(app=>app.id === v.id);
        });
    }

    async setRoleApps(apps:UnitApp[]) {
        await mainApi.unitRoleSetApps(this.unit.id, this.role.id, apps.map(v=>v.id));
        this.roleApps = apps;
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
