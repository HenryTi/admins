import * as React from 'react';
import {nav, Page, Controller, meInFrame, VPage} from 'tonva-tools';
import {DevModel} from '../../model';
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
    uqList: DevModel.UQ[];
    services: DevModel.Service[];
    protected async internalStart(unitId:any) {
        this.unitId = unitId;
        this.uqList = await devApi.uqs(this.unitId);
        this.showVPage(ListPage);
    }

    listRowClick = async (item:DevModel.UQ) => {
        this.uq = item;
        let ret = await devApi.uqGetEntities(this.unitId, item.id);
        let r0 = ret[0][0];
        this.access = r0.access;
        this.entities = r0.entities;
        this.services = ret[1];
        this.showVPage(UQPage);
    }

    serviceClick = (service: DevModel.Service) => {
        this.showVPage(ServicePage, service);
    }

    onUqUpload = async() => {
        nav.push(<UqUpload uq={this.uq} services={this.services} />);
    }

    async changeServiceProp(service: DevModel.Service, prop:string, value:any):Promise<any> {
        return await devApi.changeServiceProp(this.unitId, service.id, prop, value);
    }

    async saveService(service: DevModel.Service):Promise<number> {
        return await devApi.saveService(service);
    }

    async delService(service: DevModel.Service) {
        await devApi.delService(this.unitId, service.id);
    }

    showNewServicePage = async () => {
        await this.showVPage(NewServicePage);
    }
}
