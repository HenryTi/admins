import {observable, computed} from 'mobx';
import {Id, Unit, DevModel} from '../model';
import {mainApi, devApi} from '../api';

export abstract class CacheIds<T extends Id> {
    constructor(maxCount:number = 100) {
        this.maxCount = maxCount;
    }
    private maxCount:number;
    private arr:T[] = [];
    @observable dict = new Map<number, T>();

    get(id:number):T {
        if (id === undefined) return null;
        let unit = this.dict.get(id);
        if (unit === undefined) {
            unit = {id:id} as T;
            this.loadId(id);
        }
        return unit;
    }
    private async loadId(id:number) {
        let item = await this._load(id);
        if (item === undefined) {
            this.dict.set(id, null);
            this.arr.push({id: id} as T);
        }
        else {
            this.dict.set(id, item);
            this.arr.push(item);
        }
        if (this.arr.length > this.maxCount) {
            item = this.arr.shift();
            this.dict.delete(item.id);
        }
    }

    protected abstract async _load(id:number):Promise<T>;
}

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
