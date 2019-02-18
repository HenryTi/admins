import * as React from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { nav, Page, Controller, meInFrame, VPage } from 'tonva-tools';
import { DevModel } from '../../model';
import { UqUpload, UpUploadProps } from './uqUpload';
import { devApi } from 'api';
import { NewServicePage } from './newServicePage';
import { ServicePage } from './servicePage';
import { UQPage } from './uqPage';
import { ListPage } from './listPage';

export class UQController extends Controller {
    private unitId: number;
    uq: DevModel.UQ;
    access: string;
    entities: string;
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
    }

    serviceClick = (service: DevModel.Service) => {
        this.openVPage(ServicePage, service);
    }

    onUqUpload = async() => {
        let onDispose = () => {
        };
        nav.push(<UqUpload uq={this.uq} services={this.services} />, onDispose);
    }

    saveUq = async (values: DevModel.UQ) => {
        let uq = _.clone(values);
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
