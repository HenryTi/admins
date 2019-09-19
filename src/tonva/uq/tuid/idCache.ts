import { observable } from 'mobx';
import { isNumber } from 'util';
import _ from 'lodash';
import { LocalArr } from '../../tool';
import { BoxId } from './boxId';
import { TuidInner, TuidDiv } from './tuid';

const maxCacheSize = 1000;

export class IdCache {
    private queue: number[] = [];               // 每次使用，都排到队头
    private cache = observable.map({}, {deep: false});    // 已经缓冲的

    protected localArr:LocalArr;
    protected waitingIds: number[] = [];          // 等待loading的
    protected tuidInner: TuidInner;

    constructor(tuidLocal: TuidInner) {
        this.tuidInner = tuidLocal;
        this.initLocalArr();
    }

    protected initLocalArr() {
        this.localArr = this.tuidInner.cache.arr(this.tuidInner.name + '.ids');
    }

    useId(id:number, defer?:boolean) {
        if (id === undefined || id === 0) return;
        if (isNumber(id) === false) return;
        if (this.cache.has(id) === true) {
            this.moveToHead(id);
            return;
        }
        this.tuidInner.cacheTuids(defer===true?70:20);
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

    remove(id:number) {
        this.cache.delete(id);
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
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
        this.remove(id);
        this.useId(id);
    }

    cacheValue(val:any):boolean {
        if (val === undefined) return false;
        let id = this.getIdFromObj(val);
        if (id === undefined) return false;
        let index = this.waitingIds.findIndex(v => v === id);
        if (index>=0) this.waitingIds.splice(index, 1);
        this.cache.set(id, val);
        return true;
    }
    protected getIdFromObj(val:any) {return this.tuidInner.getIdFromObj(val)}

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
        }
    }
    async modifyIds(ids:any[]):Promise<void> {
        //let tuidValues:string[] = await this.tuidInner.loadTuidIds(this.divName, ids);
        let tuidValues:string[] = await this.loadTuidIdsOrLocal(ids);
        let localedValues = tuidValues.filter(v => {
            let p = v.indexOf('\t');
            if (p<0) p = v.length;
            let id = Number(v.substr(0, p));
            let val = this.localArr.getItem(id);
            return (val !== undefined);
        });
        if (localedValues.length === 0) return;
        await this.cacheIdValues(localedValues);
    }
    protected divName:string = undefined;
    protected async loadIds(): Promise<any[]> {
        //let ret = await this.tuidInner.loadTuidIds(this.divName, this.waitingIds);
        let ret = await this.loadTuidIdsOrLocal(this.waitingIds);
        return ret;
    }
    protected unpackTuidIds(values:string[]):any[] {
        return this.tuidInner.unpackTuidIds(values);
    }
    protected cacheTuidFieldValues(tuidValue: any) {
        this.tuidInner.cacheTuidFieldValues(tuidValue);
    }

    async assureObj(id:number):Promise<any> {
        let val = this.cache.get(id);
        switch (typeof val) {
            case 'object': return;
            case 'number': this.cache.set(id, id); break;
        }
        //let ret = await this.tuidInner.loadTuidIds(this.divName, [id]);
        let ret = await this.loadTuidIdsOrLocal([id]);
        await this.cacheIdValues(ret);
    }

    private async loadTuidIdsOrLocal(ids:number[]):Promise<string[]> {
        let ret:string[] = [];        
        let netIds:number[] = [];
        for (let id of ids) {
            let value = this.localArr.getItem(id);
            if (value === undefined)
                netIds.push(id);
            else
                ret.push(value);
        }
        let len = netIds.length;
        if (len > 0) {
            let netRet = await this.tuidInner.loadTuidIds(this.divName, netIds);
            for (let i=0; i<len; i++) {
                //有些id可能没有内容，不会返回
                //let id = netIds[i]; 
                let row:string = netRet[i];
                if (!row) continue;
                let p = row.indexOf('\t');
                if (p < 0) p = row.length;
                let id = Number(row.substr(0, p));
                _.remove(netIds, v => v === id);
                ret.push(row);
                this.localArr.setItem(id, row);
            }
            len = netIds.length;
            for (let i=0; i<len; i++) {
                this.localArr.setItem(netIds[i], '');
            }
        }
        return ret;
    }
}

export class IdDivCache extends IdCache {
    private div: TuidDiv;
    protected divName:string;

    constructor(tuidLocal:TuidInner, div: TuidDiv) {
        super(tuidLocal);
        this.div = div;
        this.divName = div.name;
        this.localArr = tuidLocal.cache.arr(tuidLocal.name + '.ids.' + this.divName);
    }

    protected initLocalArr() {
        // 这个不需要，必须去掉
        // this.localArr = this.tuidInner.cache.arr(this.tuidInner.name + '.ids');
    }

    protected getIdFromObj(val:any) {return this.div.getIdFromObj(val)}
    protected unpackTuidIds(values:string[]):any[] {
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
