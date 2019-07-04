import {observable, computed} from 'mobx';

export interface Id {
    id: number;
}

export abstract class CacheIds<T extends Id> {
    constructor(maxCount:number = 100) {
        this.maxCount = maxCount;
    }
    private maxCount:number;
    private arr:T[] = [];
    @observable dict = new Map<number, T>();

    loadIds(ids:number[]) {
        let arr:number[] = [];
        for (let id of ids) {
            if (id === null) continue;
            let item = this.dict.get(id);
            if (item === undefined) {
                arr.push(id);
                item = {id:id} as T;
                this.dict.set(id, item);
            }
        }                
        this.loadId(arr);
    }

    get(id:number):T {
        if (id === undefined || id === null) return null;
        let item = this.dict.get(id);
        if (item === undefined) {
            this.dict.set(id, {id:id} as T);
            this.loadId([id]);
            item = this.dict.get(id);
        }
        return item;
    }
    private setItem(id:number, item:T) {
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
    private async loadId(ids:number[]) {
        let items = await this._loadIds(ids);
        if (items === undefined) {
            for (let id of ids) {
                if (id === null) continue;
                let item = await this._loadId(id);
                this.setItem(id, item);
            }
        }
        else {
            for (let id of ids) {
                let item = items.find(v => v.id === id);
                this.setItem(id, item);
            }
        }
    }

    protected abstract async _loadIds(ids:number[]):Promise<T[]>;
    protected abstract async _loadId(id:number):Promise<T>;
}
