import {observable} from 'mobx';
//import consts from './consts';
import mainApi from './mainApi';
import {UnitApps, App, Api, UnitAdmin} from './model';

class MainData {
    private unitId: number;
    @observable unitApp: UnitApps;
    @observable unitAdmins: UnitAdmin[] = undefined;

    setUnitId(unitId:number) {
        this.unitId = unitId;
    }

    logout() {
        this.unitApp = undefined;
        this.unitAdmins = undefined;
    }

    async loadApps(): Promise<UnitApps> {
        return this.unitApp = await mainApi.apps(this.unitId);
    }

    async getAppApi(appId: number, apiName): Promise<Api> {
        let apps = this.unitApp.apps;
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
        return api;
    }

    async loadUnitAdmins(): Promise<void> {
        this.unitAdmins = await mainApi.unitAdmins(this.unitId);
    }
};

export const mainData = new MainData();
