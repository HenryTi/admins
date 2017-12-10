import {observable} from 'mobx';
//import consts from './consts';
import {meInFrame} from 'tonva-tools';
import mainApi from './mainApi';
import {Unit, UnitApps, App, Api, UnitAdmin} from './model';

class MainData {
    @observable unit: Unit;
    @observable unitAdmins: UnitAdmin[] = undefined;

    private get unitId():number {return meInFrame.unit;};

    logout() {
        this.unit = undefined;
        this.unitAdmins = undefined;
    }

    async loadApps(): Promise<UnitApps> {
        return this.unit = await mainApi.apps(this.unitId);
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
        let ret = await mainApi.unit(this.unitId);
        this.unit = ret;
    }

    async loadUnitAdmins(): Promise<void> {
        this.unitAdmins = await mainApi.unitAdmins(this.unitId);
    }
};

export const mainData = new MainData();
