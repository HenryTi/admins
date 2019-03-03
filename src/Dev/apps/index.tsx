import * as React from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { Controller } from "tonva-tools";
import { DevModel } from 'model';
import { devApi } from 'api';
import { AppsPage } from './appsPage';
import { AppPage } from './appPage';
import { UqBindPage } from './uqBindPage';

export interface UqAccess {
    uq: DevModel.UQ;
    bind_access: string[];
}

export class AppController extends Controller {
    private unitId: number;
    app: DevModel.App;
    @observable appList: DevModel.App[];
    @observable uqAccesses: UqAccess[];
    protected async internalStart(unitId:any) {
        this.unitId = unitId;
        this.appList = await devApi.apps(this.unitId);
        this.openVPage(AppsPage);
    }

    listRowClick = async (item:DevModel.App) => {
        this.app = item;
        let ret = await devApi.loadAppUqs(item.id);
        this.uqAccesses = ret.map(v => {
            let {owner, access, id, name, discription, unit, date_init, date_update, bind_access} = v;
            return {
                uq: {
                    id: id,
                    name: name,
                    discription: discription,
                    unit: unit,
                    access: access,
                    owner: owner,
                    date_init: date_init,
                    date_update: date_update, 
                    service_count: undefined,
                },
                uqOwner: owner,
                bind_access: bind_access && bind_access.split(',')
            }
        });
        this.openVPage(AppPage);
    }

    saveApp = async (values: DevModel.App) => {
        let app = _.clone(this.app);
        _.merge(app, values);
        app.unit = this.unitId;
        let ret = await devApi.saveApp(app);
        app.id = ret;
        let org = this.appList.find(v => v.id === ret);
        if (org !== undefined) {
            _.merge(org, app);
        }
        else {
            this.appList.push(app);
        }
    }

    deleteApp = async () => {
        await devApi.delApp(this.unitId, this.app.id);
        let index = this.appList.findIndex(v => v.id === this.app.id);
        if (index >= 0) this.appList.splice(index, 1);
    }

    searchUq = async (key:string, pageStart:number, pageSize:number) => {
        return await devApi.searchUq(this.unitId, key, pageStart, pageSize);
    }

    getMyUqs = async () => {
        return await devApi.getMyUqs(this.unitId);
    }

    onUq = (uq: DevModel.UQ) => {
        let uqAccess:UqAccess = this.uqAccesses.find(v => v.uq.id === uq.id);
        if (uqAccess === undefined) {
            uqAccess = {
                uq: uq,
                bind_access: undefined,
            }
        }
        else {
            let access = uqAccess.bind_access;
            if (access === null || access === undefined) uqAccess.bind_access = [];
        }
        this.openVPage(UqBindPage, uqAccess);
    }

    // accesses = undefined, 表示删除
    private buildBindUqs(uq: DevModel.UQ, accesses?:string[]) {
        let uqs:{id:number, access:string[]}[] = [];
        let isNew = true;
        for (let ua of this.uqAccesses) {
            let {uq:uaUq, bind_access} = ua;
            if (uaUq.id === uq.id) {
                if (accesses === undefined) continue;
                bind_access = accesses;
                isNew = false;
            }
            uqs.push({
                id: uaUq.id,
                access: bind_access || [],
            });
        }
        if (accesses !== undefined && isNew === true) {
            uqs.push({id: uq.id, access: accesses});
        }
        return uqs;
    }

    saveUqBind = async (uq: DevModel.UQ, accesses:string[]) => {
        let uqs:{id:number, access:string[]}[] = this.buildBindUqs(uq, accesses);
        await devApi.appBindUq(this.unitId, this.app.id, uqs);
        if (uqs.length > this.uqAccesses.length) {
            this.uqAccesses.unshift({
                uq: uq,
                bind_access: accesses,
            });
        }
        else {
            let ua = this.uqAccesses.find(v => v.uq.id === uq.id);
            ua.bind_access = accesses;
        }
    }

    removeUqBind = async (uq: DevModel.UQ) => {
        let uqs:{id:number, access:string[]}[] = this.buildBindUqs(uq);
        await devApi.appBindUq(this.unitId, this.app.id, uqs);
        let index = this.uqAccesses.findIndex(v => v.uq.id === uq.id);
        if (index>=0) this.uqAccesses.splice(index, 1);
    }
}
