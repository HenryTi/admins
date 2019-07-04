import { observable } from 'mobx';
import { isNumber } from 'util';
import { BoxId } from './boxId';
import { TuidLocal } from './tuid';
import { TuidDiv } from './tuidDiv'

const maxCacheSize = 1000;

export class IdCache {
    private queue: number[] = [];               // 每次使用，都排到队头
    private cache = observable.map({}, {deep: false});    // 已经缓冲的

    protected waitingIds: number[] = [];          // 等待loading的
    protected tuidLocal: TuidLocal;

    constructor(tuidLocal: TuidLocal) {
        this.tuidLocal = tuidLocal;
    }

    useId(id:number, defer?:boolean) {
        if (id === undefined || id === 0) return;
        if (isNumber(id) === false) return;
        if (this.cache.has(id) === true) {
            this.moveToHead(id);
            return;
        }
        this.tuidLocal.cacheTuids(defer===true?70:20);
        //let idVal = this.createID(id);
        this.cache.set(id, id);
        if (this.waitingIds.findIndex(v => v === id) >= 0) {
            this.moveToHead(id);
            return;
        }

        if (this.queue.length >= maxCacheSize) {
            // 缓冲已满，先去掉最不常用的
            let r = this.queue.shift();
            if (r === id) {
                // 如果移除的，正好是现在用的，则插入
                this.queue.push(r);
                return;
            }

            //let rKey = String(r);
            if (this.cache.has(r) === true) {
                // 如果移除r已经缓存
                this.cache.delete(r);
            }
            else {
                // 如果移除r还没有缓存
                let index = this.waitingIds.findIndex(v => v === r);
                this.waitingIds.splice(index, 1);
            }
        }
        this.waitingIds.push(id);
        this.queue.push(id);
        return;
    }

    private moveToHead(id:number) {
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
        this.queue.push(id);
    }

    getValue(id:number) {
        return this.cache.get(id);
    }

    valueFromId(id:number|BoxId):any {
        let _id:number;
        switch (typeof id) {
            case 'object': _id = (id as BoxId).id; break;
            case 'number': _id = id as number; break;
            default: return;
        }
        return this.getValue(_id);
    }

    resetCache(id:number) {
        this.cache.delete(id);
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
        this.useId(id);
    }

    cacheValue(val:any):boolean {
        if (val === undefined) return false;
        let id = this.getIdFromObj(val);
        if (id === undefined) return false;
        let index = this.waitingIds.findIndex(v => v === id);
        if (index>=0) this.waitingIds.splice(index, 1);
        //let cacheVal = this.createID(id, val);
        this.cache.set(id, val);
        return true;
    }
    protected getIdFromObj(val:any) {return this.tuidLocal.getIdFromObj(val)}
    /*
    protected afterCacheValue(tuidValue:any) {
        let {fields} = this.tuidLocal;
        if (fields === undefined) return;
        for (let f of fields) {
            let {_tuid} = f;
            if (_tuid === undefined) continue;
            _tuid.useId(tuidValue[f.name]);
        }
    }
    */
    async cacheIds():Promise<void> {
        if (this.waitingIds.length === 0) return;
        let tuidValues = await this.loadIds();
        await this.cacheIdValues(tuidValues);
    }

    private async cacheIdValues(tuidValues: any[]) {
        if (tuidValues === undefined) return;
        let tuids = this.unpackTuidIds(tuidValues);
        for (let tuidValue of tuids) {
            if (this.cacheValue(tuidValue) === false) continue;
            this.cacheTuidFieldValues(tuidValue);
            //this.afterCacheValue(tuidValue);
        }
    }
    protected divName:string = undefined;
    protected async loadIds(): Promise<any[]> {
        let ret = await this.tuidLocal.loadTuidIds(this.divName, this.waitingIds);
        return ret;
    }
    protected unpackTuidIds(values:any[]|string):any[] {
        return this.tuidLocal.unpackTuidIds(values);
    }
    protected cacheTuidFieldValues(tuidValue: any) {
        this.tuidLocal.cacheTuidFieldValues(tuidValue);
    }

    async assureObj(id:number):Promise<void> {
        let val = this.cache.get(id);
        switch (typeof val) {
            case 'object': return;
            case 'number': this.cache.set(id, id); break;
        }
        let ret = await this.tuidLocal.loadTuidIds(this.divName, [id]);
        await this.cacheIdValues(ret);
    }
}

export class IdDivCache extends IdCache {
    private div: TuidDiv;
    protected divName:string;

    constructor(tuidLocal:TuidLocal, div: TuidDiv) {
        super(tuidLocal);
        this.div = div;
        this.divName = div.name;
    }
    protected getIdFromObj(val:any) {return this.div.getIdFromObj(val)}
    protected unpackTuidIds(values:any[]|string):any[] {
        return this.div.unpackTuidIds(values);
    }
    protected cacheTuidFieldValues(tuidValue: any) {
        this.div.cacheTuidFieldValues(tuidValue);
    }
    /*
    async cacheIds():Promise<void> {
        if (this.waitingIds.length === 0) return;
        let tuidValues = await this.loadIds();
        if (tuidValues !== undefined) {
            let tuids = this.tuidLocal.unpackTuidIds(tuidValues);
            for (let tuidValue of tuids) {
                if (this.cacheValue(tuidValue) === false) continue;
                this.tuidLocal.cacheTuidFieldValues(tuidValue);
                this.afterCacheValue(tuidValue);
            }
        }
    }
    */
}
