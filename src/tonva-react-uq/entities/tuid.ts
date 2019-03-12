import * as React from 'react';
import {observable} from 'mobx';
import _ from 'lodash';
import { Entity } from './entity';
import { Entities, Field, ArrFields } from './entities';
import { isNumber } from 'util';
import { CUq, CTuidMain, CTuidEdit, CTuidInfo, CTuidSelect } from '../controllers';

export class BoxId {
    id: number;
    obj?: any;
    content: (templet?:(values?:any, x?:any)=>JSX.Element, x?:any)=>JSX.Element;
    valueFromFieldName: (fieldName:string)=>BoxId|any;
    _$com?: any;
    _$tuid?: Tuid;
    getObj: ()=>any;
}

const maxCacheSize = 1000;
export abstract class Tuid extends Entity {
    private BoxId: ()=>void;
    get typeName(): string { return 'tuid';}
    private queue: number[] = [];               // 每次使用，都排到队头
    private waitingIds: number[] = [];          // 等待loading的
    private cache = observable.map({}, {deep: false});    // 已经缓冲的
    idName: string;
    owner: TuidMain;                    // 用这个值来区分是不是TuidArr
    unique: string[];
    schemaFrom: {owner:string; uq:string};

    constructor(entities:Entities, name:string, typeId:number) {
        super(entities, name, typeId);
        this.buildIdBoxer();
    }

    abstract get Main():Tuid;

    private buildIdBoxer() {
        this.BoxId = function():void {};
        let prototype = this.BoxId.prototype;
        Object.defineProperty(prototype, '_$tuid', {
            value: this,
            writable: false,
            enumerable: false,
        })
        Object.defineProperty(prototype, 'obj', {
            enumerable: false,
            get: function() {
                if (this.id === undefined || this.id<=0) return undefined;
                return this._$tuid.valueFromId(this.id);
            }
        })
        prototype.valueFromFieldName = function(fieldName:string):BoxId|any {
            let t:Tuid = this._$tuid;
            return t.valueFromFieldName(fieldName, this.obj);
        }
        prototype.getObj = function():any {
            if (this._$tuid !== undefined) {
                return this._$tuid.getCacheValue(this.id);
            }
        }
        prototype.toJSON = function() {return this.id}
    }
    boxId(id:number):BoxId {
        this.useId(id);
        let ret:BoxId = new this.BoxId();
        ret.id = id;
        return ret;
    }
    getTuidContent() {
        return this.entities.cUq.getTuidContent(this);
    }
    getIdFromObj(item:any):number {
        return item[this.idName];
    }

    setSchema(schema:any) {
        super.setSchema(schema);
        let {id, unique} = schema;
        this.idName = id;
        this.unique = unique;
        this.schemaFrom = this.schema.from;
    }

    private moveToHead(id:number) {
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
        this.queue.push(id);
    }

    valueFromId(id:number|BoxId):any {
        let _id:number;
        let tId = typeof id;
        switch (typeof id) {
            case 'object': _id = (id as BoxId).id; break;
            case 'number': _id = id as number; break;
            default: return;
        }
        return this.getCacheValue(_id);
    }
    getCacheValue(id:number) {
        let v = this.cache.get(id);
        if (this.owner !== undefined && typeof v === 'object') {
            v.$owner = this.owner.boxId(v.owner); // this.owner.valueFromId(v.owner);
        }
        return v;
    }
    valueFromFieldName(fieldName:string, obj:any):BoxId|any {
        if (obj === undefined) return;
        let f = this.fields.find(v => v.name === fieldName);
        if (f === undefined) return;
        let v = obj[fieldName];
        let {_tuid} = f;
        if (_tuid === undefined) return v;
        return _tuid.valueFromId(v);
    }
    resetCache(id:number) {
        this.cache.delete(id);
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
        this.useId(id);
    }
    useId(id:number, defer?:boolean) {
        if (id === undefined || id === 0) return;
        if (isNumber(id) === false) return;
        if (this.cache.has(id) === true) {
            this.moveToHead(id);
            return;
        }
        this.entities.cacheTuids(defer===true?70:20);
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
    async proxied(name:string, id:number):Promise<any> {
        let proxyTuid = this.entities.getTuid(name, undefined);
        proxyTuid.useId(id);
        let proxied = await this.tvApi.proxied(this.name, name, id);
        this.cacheValue(proxied);
        return proxied;
    }
    cacheValue(val:any):boolean {
        if (val === undefined) return false;
        let id = this.getIdFromObj(val);
        if (id === undefined) return false;
        let index = this.waitingIds.findIndex(v => v === id);
        if (index>=0) this.waitingIds.splice(index, 1);
        //let cacheVal = this.createID(id, val);
        this.cache.set(id, val);
        // 下面的代码应该是cache proxy id, 需要的时候再写吧
        /*
        let {tuids, fields} = this.schema;
        if (tuids !== undefined && fields !== undefined) {
            for (let f of fields) {
                let {name, tuid} = f;
                if (tuid === undefined) continue;
                let t = this.entities.tuid(tuid);
                if (t === undefined) continue;
                t.useId(val[name]);
            }
        }*/
        return true;
    }
    protected afterCacheId(tuidValue:any) {
        for (let f of this.fields) {
            let {_tuid} = f;
            if (_tuid === undefined) continue;
            _tuid.useId(tuidValue[f.name]);
        }
    }
    async cacheIds():Promise<void> {
        if (this.waitingIds.length === 0) return;
        let name:string, arr:string;
        if (this.owner === undefined) {
            name = this.name;
        }
        else {
            name = this.owner.name;
            arr = this.name;
        }
        let api = await this.getApiFrom();
        let tuids = await api.tuidIds(name, arr, this.waitingIds);
        for (let tuidValue of tuids) {
            if (this.cacheValue(tuidValue) === false) continue;
            this.cacheTuidFieldValues(tuidValue);
            this.afterCacheId(tuidValue);
        }
        await this.cacheDivIds();
    }
    protected async cacheDivIds():Promise<void> {
    }
    async load(id:number):Promise<any> {
        if (id === undefined || id === 0) return;
        let api = await this.getApiFrom();
        let values = await api.tuidGet(this.name, id);
        if (values === undefined) return;
        values._$tuid = this;
        this.cacheValue(values);
        this.cacheTuidFieldValues(values);
        return values;
    }
    protected getDiv(divName:string):TuidDiv {return;}
    private cacheTuidFieldValues(values:any) {
        let {fields, arrs} = this.schema;
        this.cacheFieldsInValue(values, fields);
        if (arrs !== undefined) {
            for (let arr of arrs as ArrFields[]) {
                let {name, fields} = arr;
                let arrValues = values[name];
                if (arrValues === undefined) continue;
                let tuidDiv = this.getDiv(name);
                for (let row of arrValues) {
                    row._$tuid = tuidDiv;
                    row.$owner = this.boxId(row.owner);
                    tuidDiv.cacheValue(row);
                    this.cacheFieldsInValue(row, fields);
                }
            }
        }
    }
    private cacheFieldsInValue(values:any, fields:Field[]) {
        for (let f of fields as Field[]) {
            let {name, _tuid} = f;
            if (_tuid === undefined) continue;
            let id = values[name];
            //_tuid.useId(id);
            values[name] = _tuid.boxId(id);
        }
    }
    async save(id:number, props:any) {
        let params = _.clone(props);
        params["$id"] = id;
        let ret = await this.tvApi.tuidSave(this.name, params);
        let {id:retId, inId} = ret;
        if (retId === undefined) {
            params.id = id;
            this.cacheValue(params);
        }
        else if (retId > 0) {
            params.id = retId;
            this.cacheValue(params);
        }
        return ret;
    }
    async search(key:string, pageStart:string|number, pageSize:number):Promise<any> {
        let ret:any[] = await this.searchArr(undefined, key, pageStart, pageSize);
        return ret;
    }
    async searchArr(owner:number, key:string, pageStart:string|number, pageSize:number):Promise<any> {
        let {fields} = this.schema;
        let name:string, arr:string;
        if (this.owner !== undefined) {
            name = this.owner.name;
            arr = this.name;
        }
        else {
            name = this.name;
            arr = undefined;
        }
        let api = await this.getApiFrom();
        let ret = await api.tuidSearch(name, arr, owner, key, pageStart, pageSize);
        for (let row of ret) {
            this.cacheFieldsInValue(row, fields);
            if (this.owner !== undefined) row.$owner = this.owner.boxId(row.owner);
        }
        return ret;
    }
    async loadArr(arr:string, owner:number, id:number):Promise<any> {
        if (id === undefined || id === 0) return;
        let api = await this.getApiFrom();
        return await api.tuidArrGet(this.name, arr, owner, id);
    }
    /*
    async loadArrAll(owner:number):Promise<any[]> {
        return this.all = await this.tvApi.tuidGetAll(this.name);
    }*/
    async saveArr(arr:string, owner:number, id:number, props:any) {
        let params = _.clone(props);
        params["$id"] = id;
        return await this.tvApi.tuidArrSave(this.name, arr, owner, params);
    }
    async posArr(arr:string, owner:number, id:number, order:number) {
        return await this.tvApi.tuidArrPos(this.name, arr, owner, id, order);
    }
    
    // cache放到Tuid里面之后，这个函数不再需要公开调用了
    //private async ids(idArr:number[]) {
    //    return await this.tvApi.tuidIds(this.name, idArr);
    //}
    async showInfo(id:number) {
        await this.entities.cUq.showTuid(this, id);
    }
}

export class TuidMain extends Tuid {
    get Main() {return this}
    get uqApi() {return this.entities.uqApi};

    divs: {[name:string]: TuidDiv};
    proxies: {[name:string]: TuidMain};

    public setSchema(schema:any) {
        super.setSchema(schema);
        let {arrs} = schema;
        if (arrs !== undefined) {
            this.divs = {};
            for (let arr of arrs) {
                let {name} = arr;
                let tuidDiv = new TuidDiv(this.entities, name, this.typeId);
                tuidDiv.owner = this;
                this.divs[name] = tuidDiv;
                tuidDiv.setSchema(arr);
            }
        }
    }
    protected getDiv(divName:string):TuidDiv {return this.divs[divName];}
    /* 努力回避async里面的super调用，edge不兼容
    async cacheIds():Promise<void> {
        await super.cacheIds();
        if (this.divs === undefined) return;
        for (let i in this.divs) {
            await this.divs[i].cacheIds();
        }
    }
    */
    protected async cacheDivIds():Promise<void> {
        if (this.divs === undefined) return;
        for (let i in this.divs) {
            await this.divs[i].cacheIds();
        }
    }

    async cUqFrom(): Promise<CUq> {
        if (this.schemaFrom === undefined) return this.entities.cUq;
        let {owner, uq: uq} = this.schemaFrom;
        let cUq = await this.entities.cUq
        let cApp = cUq.cApp;
        if (cApp === undefined) return cUq;
        let cUqFrm = await cApp.getImportUq(owner, uq);
        if (cUqFrm === undefined) {
            console.error(`${owner}/${uq} 不存在`);
            debugger;
            return cUq;
        }
        let retErrors = await cUqFrm.loadSchema();
        if (retErrors !== undefined) {
            console.error('cUq.loadSchema: ' + retErrors);
            debugger;
            return cUq;
        }
        return cUqFrm;
    }

    async getApiFrom() {
        let from = await this.from();
        if (from !== undefined) {
            return from.entities.uqApi;
        }
        return this.entities.uqApi;
    }

    async from(): Promise<TuidMain> {
        let cUq = await this.cUqFrom();
        return cUq.tuid(this.name);
    }

    async cFrom(): Promise<CTuidMain> {
        let cUq = await this.cUqFrom();
        return cUq.cTuidMainFromName(this.name);
    }

    async cEditFrom(): Promise<CTuidEdit> {
        let cUq = await this.cUqFrom();
        return cUq.cTuidEditFromName(this.name);
    }

    async cInfoFrom(): Promise<CTuidInfo> {
        let cUq = await this.cUqFrom();
        return cUq.cTuidInfoFromName(this.name);
    }

    async cSelectFrom(): Promise<CTuidSelect> {
        let cUq = await this.cUqFrom();
        if (cUq === undefined) return;
        return cUq.cTuidSelectFromName(this.name);
    }

    protected afterCacheId(tuidValue:any) {
        super.afterCacheId(tuidValue);
        if (this.proxies === undefined) return;
        let {type, $proxy} = tuidValue;
        let pTuid = this.proxies[type];
        pTuid.useId($proxy);
    }
}

export class TuidDiv extends Tuid {
    get Main() {return this.owner}

    async getApiFrom() {
        return await this.owner.getApiFrom();
    }
}
