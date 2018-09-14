import {observable, computed} from 'mobx';
import {CacheIds} from 'tonva-tools';
import {Id, Unit, DevModel} from '../model';
import {mainApi, devApi} from '../api';

export class CacheUnits extends CacheIds<Unit> {
    protected async _loadIds(ids:number[]):Promise<Unit[]> {
        return;
    }
    protected async _loadId(id:number):Promise<Unit> {
        return await mainApi.unit(id);
    }
}

export class CacheApis extends CacheIds<DevModel.Usq> {
    protected async _loadIds(ids:number[]):Promise<DevModel.Usq[]> {
        return;
    }
    protected async _loadId(id:number):Promise<DevModel.Usq> {
        return await devApi.usq(id);
    }
}

export class CacheApps extends CacheIds<DevModel.App> {
    protected async _loadIds(ids:number[]):Promise<DevModel.App[]> {
        return;
    }
    protected async _loadId(id:number):Promise<DevModel.App> {
        return await devApi.app(id);
    }
}

export class CacheServers extends CacheIds<DevModel.Server> {
    protected async _loadIds(ids:number[]):Promise<DevModel.Server[]> {
        return;
    }
    protected async _loadId(id:number):Promise<DevModel.Server> {
        return await devApi.server(id);
    }
}
