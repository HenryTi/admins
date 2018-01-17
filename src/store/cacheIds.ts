import {observable, computed} from 'mobx';
import {CacheIds} from 'tonva-tools';
import {Id, Unit, DevModel} from '../model';
import {mainApi, devApi} from '../api';

export class CacheUnits extends CacheIds<Unit> {
    protected async _load(id:number):Promise<Unit> {
        return await mainApi.unit(id);
    }
}

export class CacheApis extends CacheIds<DevModel.Api> {
    protected async _load(id:number):Promise<DevModel.Api> {
        return await devApi.api(id);
    }
}

export class CacheApps extends CacheIds<DevModel.App> {
    protected async _load(id:number):Promise<DevModel.App> {
        return await devApi.app(id);
    }
}

export class CacheServers extends CacheIds<DevModel.Server> {
    protected async _load(id:number):Promise<DevModel.Server> {
        return await devApi.server(id);
    }
}
