import _ from 'lodash';
import { LocalArr } from '../../tool';
import { Entity } from '../entity';
import { UqMan, ArrFields, Field, SchemaFrom } from '../uqMan';
import { EntityCaller } from '../caller';
import { BoxId } from './boxId';
import { IdCache, IdDivCache } from './idCache';

export interface TuidSaveResult {
    id: number;
    inId: number;
}

export abstract class Tuid extends Entity {
    protected noCache: boolean;
    readonly typeName:string = 'tuid';
    protected idName: string;
    cached: boolean;
    unique: string[];

    /*
    constructor(uq:UqMan, name:string, typeId:number) {
        super(uq, name, typeId)
    }*/

    public setSchema(schema:any) {
        super.setSchema(schema);
        let {id} = schema;
        this.idName = id;
    }

    buildTuidBox(): TuidBox {
        return new TuidBox(this);
    }

    getIdFromObj(obj:any):number {return obj[this.idName]}
    stopCache():void {this.noCache = true}
    abstract useId(id:number):void;
    abstract boxId(id:number):BoxId;
    abstract valueFromId(id:number):any;
    abstract async assureBox (id:number): Promise<void>;
    cacheIds() {}
    async modifyIds(ids:any[]) {}
    isImport = false;
    abstract get hasDiv():boolean;// {return this.divs!==undefined}
    abstract div(name:string):TuidDiv;
    abstract async loadMain(id:number|BoxId):Promise<any>;
    abstract async load(id:number|BoxId):Promise<any>;
    abstract async all():Promise<any[]>;
    abstract async save(id:number, props:any):Promise<TuidSaveResult>;
    abstract async search(key:string, pageStart:string|number, pageSize:number):Promise<any>;
    abstract async searchArr(owner:number, key:string, pageStart:string|number, pageSize:number):Promise<any>;
    abstract async loadArr(arr:string, owner:number, id:number):Promise<any>;
    abstract async saveArr(arr:string, owner:number, id:number, props:any):Promise<void>;
    abstract async posArr(arr:string, owner:number, id:number, order:number):Promise<void>;
}

export class TuidInner extends Tuid {
    private divs: {[div:string]: TuidDiv};
    protected cacheFields: Field[];
    protected idCache: IdCache;
    protected localArr:LocalArr;
    constructor(uq:UqMan, name:string, typeId:number) {
        super(uq, name, typeId);
        this.idCache = new IdCache(this);
        this.localArr = this.cache.arr(this.name + '.whole');
        if (uq.newVersion === true) this.localArr.removeAll();
    }

    public setSchema(schema:any) {
        super.setSchema(schema);
        let {arrs} = schema;
        if (arrs !== undefined) {
            this.divs = {};
            for (let arr of arrs) {
                let {name} = arr;
                let tuidDiv = new TuidDiv(this.uq, this, name);
                this.divs[name] = tuidDiv;
                tuidDiv.setSchema(arr);
                tuidDiv.buildFieldsTuid();
            }
        }
    }
    
    useId(id:number, defer?:boolean) {
        if (this.noCache === true) return;
        this.idCache.useId(id, defer);
    }
    boxId(id:number):BoxId {
        if (typeof id === 'object') return id;
        this.useId(id);
        let {createBoxId} = this.uq;
        if (!createBoxId) return {id: id} as BoxId;
        return createBoxId(this, id);
    }
    valueFromId(id:number) {return this.idCache.getValue(id)}
    async assureBox (id:number):Promise<void> {
        await this.idCache.assureObj(id);
    }

    cacheIds() {
        this.idCache.cacheIds();
        if (this.divs === undefined) return;
        for (let i in this.divs) this.divs[i].cacheIds();
    }
    async modifyIds(ids:any[]) {
        await this.idCache.modifyIds(ids);
    }
    cacheTuids(defer:number) {this.uq.cacheTuids(defer)}
    get hasDiv():boolean {return this.divs!==undefined}
    div(name:string):TuidDiv {
        return this.divs && this.divs[name];
    }
    async loadTuidIds(divName:string, ids:number[]):Promise<any[]> {
        let ret:any[] = await new IdsCaller(this, {divName:divName, ids:ids}, false).request();
        if (ret.length > 0) this.cached = true;
        return ret;
    }
    async loadMain(id:number|BoxId):Promise<any> {
        if (typeof id === 'object') id = id.id;
        await this.idCache.assureObj(id);
        return this.idCache.valueFromId(id);
    }
    async load(id:number|BoxId):Promise<any> {
        if (id === undefined || id === 0) return;
        //let cacheValue = this.idCache.valueFromId(id); 
        //if (typeof cacheValue === 'object') return cacheValue;
        if (typeof id === 'object') id = id.id;
        let valuesText = this.localArr.getItem(id);
        let values: any;
        if (valuesText) {
            values = JSON.parse(valuesText);
        }
        else {
            values = await new GetCaller(this, id).request();
            if (values !== undefined) {
                this.localArr.setItem(id, JSON.stringify(values));
            }
        }
        if (values === undefined) return;
        for (let f of this.schema.fields) {
            let {tuid} = f;
            if (tuid === undefined) continue;
            let t = this.uq.getTuid(tuid);
            if (t === undefined) continue;
            let n = f.name;
            values[n] = t.boxId(values[n]);
        }
        this.idCache.cacheValue(values);
        this.cacheTuidFieldValues(values);
        return values;
    }

    cacheTuidFieldValues(values:any) {
        let {fields, arrs} = this.schema;
        this.cacheFieldsInValue(values, fields);
        if (arrs !== undefined) {
            for (let arr of arrs as ArrFields[]) {
                let {name, fields} = arr;
                let arrValues = values[name];
                if (arrValues === undefined) continue;
                let tuidDiv = this.div(name);
                for (let row of arrValues) {
                    //row._$tuid = tuidDiv;
                    //row.$owner = this.boxId(row.owner);
                    tuidDiv.cacheValue(row);
                    this.cacheFieldsInValue(row, fields);
                }
            }
        }
    }

    public buildFieldsTuid() {
        super.buildFieldsTuid();
        let {mainFields} = this.schema;
        if (mainFields === undefined) debugger;
        this.uq.buildFieldTuid(this.cacheFields = mainFields || this.fields);
    }

    unpackTuidIds(values:string[]):any[] {
        return this.unpackTuidIdsOfFields(values, this.cacheFields);
    }

    async save(id:number, props:any):Promise<TuidSaveResult> {
        /*
        let {fields} = this.schema;
        let params:any = {$id: id};
        for (let field of fields as Field[]) {
            let {name, tuid, type} = field;
            let val = props[name];
            if (tuid !== undefined) {
                if (typeof val === 'object') {
                    if (val !== null) val = val.id;
                }
            }
            else {
                switch (type) {
                    case 'date':
                    case 'datetime':
                        val = new Date(val).toISOString();
                        val = (val as string).replace('T', ' ');
                        val = (val as string).replace('Z', '');
                        break;
                }
            }
            params[name] = val;
        }
        let ret = await this.uqApi.tuidSave(this.name, params);
        return ret;
        */
        let ret = new SaveCaller(this, {id:id, props:props}).request();
        if (id !== undefined) {
            this.idCache.remove(id);
            this.localArr.removeItem(id);
        }
        return ret;
    }
    async all():Promise<any[]> {
        let ret: any[] = await new AllCaller(this, {}).request();
        return ret;
    }
    async search(key:string, pageStart:string|number, pageSize:number):Promise<any[]> {
        let ret:any[] = await this.searchArr(undefined, key, pageStart, pageSize);
        return ret;
    }
    async searchArr(owner:number, key:string, pageStart:string|number, pageSize:number):Promise<any> {
        //let api = this.uqApi;
        //let ret = await api.tuidSearch(this.name, undefined, owner, key, pageStart, pageSize);
        let params:any = {arr:undefined, owner:owner, key:key, pageStart:pageStart, pageSize:pageSize};
        let ret = await new SearchCaller(this, params).request();
        let {fields} = this.schema;
        for (let row of ret) {
            this.cacheFieldsInValue(row, fields);
        }
        return ret;
    }
    async loadArr(arr:string, owner:number, id:number):Promise<any> {
        if (id === undefined || id === 0) return;
        //let api = this.uqApi;
        //return await api.tuidArrGet(this.name, arr, owner, id);
        return await new LoadArrCaller(this, {arr:arr, owner:owner, id:id}).request();
    }
    async saveArr(arr:string, owner:number, id:number, props:any) {
        //let params = _.clone(props);
        //params["$id"] = id;
        //return await this.uqApi.tuidArrSave(this.name, arr, owner, params);
        return await new SaveArrCaller(this, {arr:arr, owner:owner, id:id, props:props}).request();
    }

    async posArr(arr:string, owner:number, id:number, order:number) {
        //return await this.uqApi.tuidArrPos(this.name, arr, owner, id, order);
        return await new ArrPosCaller(this, {arr:arr, owner:owner, id:id, order:order}).request();
    }
}

abstract class TuidCaller<T> extends EntityCaller<T> {
    protected get entity(): Tuid {return this._entity as Tuid};
}

// 包含main字段的load id
// 当前为了兼容，先调用的包含所有字段的内容
class GetCaller extends TuidCaller<number> {
    method = 'GET';
    get path():string {return `tuid/${this.entity.name}/${this.params}`}
}

class IdsCaller extends TuidCaller<{divName:string, ids:number[]}> {
    get path():string {
        let {divName} = this.params;
        return `tuidids/${this.entity.name}/${divName !== undefined?divName:'$'}`;
    }
    buildParams():any {return this.params.ids}
    xresult(res:any):any {
        return (res as string).split('\n');
    }
}


class SaveCaller extends TuidCaller<{id:number, props:any}> {
    get path():string {return `tuid/${this.entity.name}`}
    buildParams():any {
        let {fields, arrs} = this.entity.schema;
        let {id, props} = this.params;
        let params:any = {$id: id};
        this.transParams(params, props, fields);
        if (arrs !== undefined) {
            for (let arr of arrs) {
                let arrName = arr.name;
                let arrParams = [];
                let arrFields = arr.fields;
                let arrValues = props[arrName];
                if (arrValues !== undefined) {
                    for (let arrValue of arrValues) {
                        let row = {};
                        this.transParams(row, arrValue, arrFields);
                        arrParams.push(row);
                    }
                }
                params[arrName] = arrParams;
            }
        }
        return params;
    }
    private transParams(values:any, params:any, fields:Field[]) {
        if (params === undefined) return;
        for (let field of fields) {
            let {name, tuid, type} = field;
            let val = params[name];
            if (tuid !== undefined) {
                if (typeof val === 'object') {
                    if (val !== null) val = val.id;
                }
            }
            else {
                switch (type) {
                    case 'date':
                        val = this.entity.buildDateParam(val); 
                        //val = (val as string).replace('T', ' ');
                        //val = (val as string).replace('Z', '');
                        break;
                    case 'datetime':
                        val = this.entity.buildDateTimeParam(val);
                        //val = new Date(val).toISOString();
                        //val = (val as string).replace('T', ' ');
                        //val = (val as string).replace('Z', '');
                        break;
                }
            }
            values[name] = val;
        }
    }
}

class SearchCaller extends TuidCaller<{arr:string, owner:number, key:string, pageStart:string|number, pageSize:number}> {
    get path():string {return `tuids/${this.entity.name}`}
}

class AllCaller extends TuidCaller<{}> {
    method = 'GET';
    get path():string {return `tuid-all/${this.entity.name}`}
}

class LoadArrCaller extends TuidCaller<{arr:string, owner:number, id:number}> {
    method = 'GET';
    get path():string {
        let {arr, owner, id} = this.params;
        return `tuid-arr/${this.entity.name}/${owner}/${arr}/${id}`;
    }
}

class SaveArrCaller extends TuidCaller<{arr:string, owner:number, id:number, props:any}> {
    get path():string {
        let {arr, owner} = this.params;
        return `tuid-arr/${this.entity.name}/${owner}/${arr}/`;
    }
    buildParams():any {
        let {id, props} = this.params;
        let params = _.clone(props);
        params['$id'] = id;
        return params;
    }
}

class ArrPosCaller extends TuidCaller<{arr:string, owner:number, id:number, order:number}> {
    get path():string {
        let {arr, owner} = this.params;
        return `tuid-arr-pos/${this.entity.name}/${owner}/${arr}/`;
    }
    buildParams():any {
        let {id, order} = this.params;
        return { bid: id, $order: order}
    }
}

export class TuidImport extends Tuid {
    private tuidLocal: TuidInner;

    constructor(uq:UqMan, name:string, typeId:number, from: SchemaFrom) {
        super(uq, name, typeId);
        this.from = from;
    }

    setFrom(tuidLocal: TuidInner) {this.tuidLocal = tuidLocal}
    
    readonly from: SchemaFrom;
    isImport = true;

    useId(id:number) {this.tuidLocal.useId(id);}
    boxId(id:number):BoxId {return this.tuidLocal.boxId(id);}
    valueFromId(id:number) {return this.tuidLocal.valueFromId(id)}
    async assureBox(id:number):Promise<void> {
        await this.tuidLocal.assureBox(id);
    }
    get hasDiv():boolean {return this.tuidLocal.hasDiv}
    div(name:string):TuidDiv {return this.tuidLocal.div(name)}
    async loadMain(id:number|BoxId):Promise<any> {
        let ret = await this.tuidLocal.loadMain(id);
        return ret;
    }
    async load(id:number|BoxId):Promise<any> {
        return await this.tuidLocal.load(id);
    }
    async save(id:number, props:any):Promise<TuidSaveResult> {
        return await this.tuidLocal.save(id, props);
    }
    async all():Promise<any[]> {
        return await this.tuidLocal.all();
    }
    async search(key:string, pageStart:string|number, pageSize:number):Promise<any> {
        return await this.tuidLocal.search(key, pageStart, pageSize);
    }
    async searchArr(owner:number, key:string, pageStart:string|number, pageSize:number):Promise<any> {
        return await this.tuidLocal.searchArr(owner, key, pageStart, pageSize);
    }
    async loadArr(arr:string, owner:number, id:number):Promise<any> {
        return await this.tuidLocal.loadArr(arr, owner, id);
    }
    async saveArr(arr:string, owner:number, id:number, props:any):Promise<void> {
        await this.tuidLocal.saveArr(arr, owner, id, props);
    }
    async posArr(arr:string, owner:number, id:number, order:number):Promise<void> {
        await this.tuidLocal.posArr(arr, owner, id, order);
    }
}

// field._tuid 用这个接口
// Tuid, TuidDiv 实现这个接口
export class TuidBox {
    tuid: Tuid;
    ownerField:Field = undefined;
    constructor(tuid: Tuid) {
        this.tuid = tuid;
    }

    boxId(id:number):BoxId {
        return this.tuid.boxId(id);
    }
    getIdFromObj(obj:any):number {
        return this.tuid.getIdFromObj(obj);
    }
    useId(id:number):void {
        return this.tuid.useId(id);
    }
    async showInfo() {
        alert('showInfo not implemented');
    }
}


export class TuidDiv extends TuidInner /* Entity*/ {
    readonly typeName:string = 'div';
    protected cacheFields: Field[];
    protected tuid: TuidInner;
    protected idName: string;
    protected idCache: IdDivCache;

    //ui: React.StatelessComponent<any>;
    //res: any;

    constructor(uq: UqMan, tuid: TuidInner, name: string) {
        super(uq, name, 0);
        this.tuid = tuid;
        this.idName = 'id';
        this.idCache = new IdDivCache(tuid, this);
    }

    get owner() {return this.tuid}

    /*
    setSchema(schema:any) {
        super.setSchema(schema);
        this.buildFieldsTuid();
    }*/

    /*
    setUIRes(ui:any, res:any) {
        this.ui = ui && ui.content;
        this.res = res;
    }
    */

    buildFieldsTuid() {
        super.buildFieldsTuid();
        let {mainFields} = this.schema;
        if (mainFields === undefined) debugger;
        this.uq.buildFieldTuid(this.cacheFields = mainFields);
    }

    buildTuidDivBox(ownerField: Field): TuidBoxDiv {
        return new TuidBoxDiv(this.tuid, this, ownerField);
    }

    getIdFromObj(obj:any):number {return obj[this.idName]}
    cacheValue(value:any):void {
        this.idCache.cacheValue(value);
    }

    useId(id:number, defer?:boolean):void {
        if (this.noCache === true) return;
        this.idCache.useId(id, defer);
    }

    /*
    boxId(id:number):BoxId {
        if (typeof id === 'object') return id;
        this.useId(id);
        //return new BoxDivId(this.tuid, this, id);
        return this.tuid.boxDivId(this, id);
    }
    */
    valueFromId(id:number):any {
        return this.idCache.getValue(id)
    }

    async assureBox(id:number):Promise<void> {
        await this.idCache.assureObj(id);
    }

    async cacheIds() {
        await this.idCache.cacheIds();
    }

    cacheTuidFieldValues(values:any) {
        let fields = this.schema.fields;
        this.cacheFieldsInValue(values, fields);
    }

    unpackTuidIds(values:string[]):any[] {
        return this.unpackTuidIdsOfFields(values, this.cacheFields);
    }
}

export class TuidBoxDiv extends TuidBox {
    ownerField: Field;
    private div: TuidDiv;
    constructor(tuid: Tuid, div: TuidDiv, ownerField: Field) {
        super(tuid);
        this.div = div;
        this.ownerField = ownerField;
    }

    boxId(id:number):BoxId {
        return this.div.boxId(id);
    }
    getIdFromObj(obj:any):number {
        return this.div.getIdFromObj(obj);
    }
    useId(id:number):void {
        return this.div.useId(id);
    }
}
