import * as React from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { nav, Controller } from 'tonva';
import { DevModel } from '../../model';
import { UqUpload, UqActionProps, UqDeploy } from './uqUpload';
import { devApi } from 'api';
import { NewServicePage } from './newServicePage';
import { ServicePage } from './servicePage';
import { UQPage } from './uqPage';
import { ListPage } from './listPage';
import { UqDevsAdmin } from './UqDevsAdmin';
import { store } from '../../store';

export class UQController extends Controller {
    private unitId: number;
    uq: DevModel.UQ;
    access: string;
    entities: string;
    @observable uqDevs: any[];
    @observable uqList: DevModel.UQ[];
    @observable services: DevModel.Service[];
    protected async internalStart(unitId:any) {
        this.unitId = unitId;
        this.uqList = await devApi.uqs(this.unitId);
        this.openVPage(ListPage);
    }

    listRowClick = async (item:DevModel.UQ) => {
        this.uq = item;
        await this.loadUqEntities(item.id);
        this.openVPage(UQPage);
    }

    private async loadUqEntities(uqId: number) {
        let ret = await devApi.uqGetEntities(this.unitId, uqId);
        let r0 = ret[0][0];
        this.access = r0.access;
        this.entities = r0.entities;
        this.services = ret[1];
        this.uqDevs = ret[4];
    }

    async loadAdmins() {
        await store.admins.load();
    }

    async devChanged(admin:any, isSelected:boolean) {
        let param = {
            unit: this.unitId,
            type: 'uq',
            dev: this.uq.id,
            devUser: admin.id
        };
        if (isSelected === true) {
            await devApi.adminDevAdd(param);
            this.uqDevs.push({
                userId: admin.id,
                icon: admin.icon,
                name: admin.name,
                nick: admin.nick,
                isOwner: 0,
            });
        }
        else {
            await devApi.adminDevDel(param);
            let index = this.uqDevs.findIndex(v => v.userId === admin.id);
            this.uqDevs.splice(index, 1);
        }
    }

    uqDevsAdmin = () => {
        this.openVPage(UqDevsAdmin);
    }

    serviceClick = (service: DevModel.Service) => {
        this.openVPage(ServicePage, service);
    }

    onUqUpload = async() => {
        let onDispose = () => {}
        nav.push(<UqUpload uq={this.uq} services={this.services} />, onDispose);
    }

    onUqTest = async() => {
        let onDispose = () => {}
        nav.push(<UqDeploy uq={this.uq} action="test" services={this.services} />, onDispose);
    }

    onUqDeploy = async() => {
        let onDispose = () => {}
        nav.push(<UqDeploy uq={this.uq} action="deploy" services={this.services} />, onDispose);
    }

    saveUq = async (values: DevModel.UQ) => {
        let uq: DevModel.UQ;
        if (this.uq === undefined) {
            uq = _.clone(values);
        }
        else {
            uq = _.clone(this.uq);
            _.merge(uq, values);
        }
        uq.unit = this.unitId;
        let ret = await devApi.saveUq(uq);
        uq.id = ret;
        this.uqList.push(uq);
    }

    deleteUq = async () => {
        await devApi.delUq(this.unitId, this.uq.id);
        let index = this.uqList.findIndex(v => v.id === this.uq.id);
        if (index >= 0) this.uqList.splice(index);
    }

    async changeServiceProp(service: DevModel.Service, prop:string, value:any):Promise<any> {
        return await devApi.changeServiceProp(this.unitId, service.id, prop, value);
    }

    async saveService(service: DevModel.Service):Promise<number> {
        let svc = _.clone(service);
        svc.unit = this.unitId;
        if (!svc.urlTest) svc.urlTest = '-';
        let ret = await devApi.saveService(svc);
        svc.id = ret;
        this.services.push(svc);
        return ret;
    }

    async delService(service: DevModel.Service) {
        await devApi.delService(this.unitId, service.id);
        let index = this.services.findIndex(v => v.id == service.id);
        if (index >= 0) this.services.splice(index);
    }

    showNewServicePage = async () => {
        await this.openVPage(NewServicePage);
    }
}
