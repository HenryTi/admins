import {observable, autorun} from 'mobx';
//import consts from './consts';
import {nav, meInFrame} from 'tonva-tools';
import {mainApi} from '../api';
import {Unit, UnitApps, App, Api, UnitAdmin} from '../model';
import {Admins} from './admins';
import {Dev} from './dev';

export class Store {
    private get unitId():number {return meInFrame.unit;};
    admins:Admins;
    dev:Dev;

    @observable unit: Unit;

    init() {
        this.unit = undefined;
        this.admins = new Admins(this);
        this.dev = new Dev(this);
    }

    /*
    async loadApps(): Promise<UnitApps> {
        return this.unit = await mainApi.apps(this.unitId);
    }*/

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
    let userId = user.id;
    if (userId === undefined) {
        console.log('autorun log out');
    }
    else {
        console.log('autorun login');
        store.init();
        await store.loadUnit();
    }
});
