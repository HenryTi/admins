import _ from 'lodash';
import { Entity } from '../entity';
import { IdCache } from './idCache';
import { TuidDiv } from './tuidDiv';
import { Uq, ArrFields, Field, SchemaFrom } from '../uq';
import { TuidBox } from './tuidBox';
import { BoxId } from './boxId';

export interface TuidSaveResult {
    id: number;
    inId: number;
}

export abstract class Tuid extends Entity {
    readonly typeName = 'tuid';
    private idName: string;
    unique: string[];
    ui: React.StatelessComponent<any>;
    res: any;

    constructor(uq:Uq, name:string, typeId:number) {
        super(uq, name, typeId)
    }

    public setSchema(schema:any) {
        super.setSchema(schema);
        let {id} = schema;
        this.idName = id;
    }

    buildTuidBox(): TuidBox {
        return new TuidBox(this);
    }
    
    setUIRes(ui:any, res:any) {
        //this.ui = (ui as TuidUI).content;
        this.ui = ui.content;
        this.res = res;
    }

    getIdFromObj(obj:any):number {return obj[this.idName]}
    abstract useId(id:number):void;
    abstract boxId(id:number):BoxId;
    abstract valueFromId(id:number):any;
    abstract async assureBox(id:number):Promise<void>;
    cacheIds() {}
    isImport = false;
    abstract get hasDiv():boolean;// {return this.divs!==undefined}
    abstract div(name:string):TuidDiv;
    abstract async load(id:number|BoxId):Promise<any>;
    abstract async save(id:number, props:any):Promise<TuidSaveResult>;
    abstract async search(key:string, pageStart:string|number, pageSize:number):Promise<any>;
    abstract async searchArr(owner:number, key:string, pageStart:string|number, pageSize:number):Promise<any>;
    abstract async loadArr(arr:string, owner:number, id:number):Promise<any>;
    abstract async saveArr(arr:string, owner:number, id:number, props:any):Promise<void>;
    abstract async posArr(arr:string, owner:number, id:number, order:number):Promise<void>;
}

export class TuidLocal extends Tuid {
    private idCache: IdCache = new IdCache(this);
    private cacheFields: Field[];
    private divs: {[div:string]: TuidDiv};

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
    
    setUIRes(ui:any, res:any) {
        super.setUIRes(ui, res);
        if (this.divs === undefined) return;
        //let uiDivs = (ui as TuidUI).divs;
        let uiDivs = ui.divs;
        if (uiDivs === undefined) return;
        for (let i in this.divs) {
            this.divs[i].setUIRes(uiDivs[i], res);
        }
    }

    useId(id:number, defer?:boolean) {
        this.idCache.useId(id, defer);
    }
    boxId(id:number):BoxId {
        if (typeof id === 'object') return id;
        this.useId(id);
        return new BoxId(this, id);
    }
    valueFromId(id:number) {return this.idCache.getValue(id)}
    async assureBox(id:number):Promise<void> {
        await this.idCache.assureObj(id);
    }

    cacheIds() {
        this.idCache.cacheIds();
        if (this.divs === undefined) return;
        for (let i in this.divs) this.divs[i].cacheIds();
    }
    cacheTuids(defer:number) {this.uq.cacheTuids(defer)}
    get hasDiv():boolean {return this.divs!==undefined}
    div(name:string):TuidDiv {
        return this.divs && this.divs[name];
    }
    async loadTuidIds(divName:string, ids:number[]):Promise<any[]> {
        return await this.uqApi.tuidIds(this.name, divName, ids);
    }
    async load(id:number|BoxId):Promise<any> {
        if (id === undefined || id === 0) return;
        if (typeof id === 'object') id = id.id;
        let values = await this.uqApi.tuidGet(this.name, id);
        if (values === undefined) return;
        for (let f of this.schema.fields) {
            let {tuid} = f;
            if (tuid === undefined) continue;
            let t = this.uq.getTuid(tuid);
            if (t === undefined) continue;
            let n = f.name;
            values[n] = t.boxId(values[n]);
        }
        //values._$tuid = this;
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

    unpackTuidIds(values:any[]|string):any[] {
        return this.unpackTuidIdsOfFields(values, this.cacheFields);
    }

    async save(id:number, props:any):Promise<TuidSaveResult> {
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
    }
    async search(key:string, pageStart:string|number, pageSize:number):Promise<any> {
        let ret:any[] = await this.searchArr(undefined, key, pageStart, pageSize);
        return ret;
    }
    async searchArr(owner:number, key:string, pageStart:string|number, pageSize:number):Promise<any> {
        let {fields} = this.schema;
        let api = this.uqApi;
        let ret = await api.tuidSearch(this.name, undefined, owner, key, pageStart, pageSize);
        for (let row of ret) {
            this.cacheFieldsInValue(row, fields);
        }
        return ret;
    }
    async loadArr(arr:string, owner:number, id:number):Promise<any> {
        if (id === undefined || id === 0) return;
        let api = this.uqApi;
        return await api.tuidArrGet(this.name, arr, owner, id);
    }
    async saveArr(arr:string, owner:number, id:number, props:any) {
        let params = _.clone(props);
        params["$id"] = id;
        return await this.uqApi.tuidArrSave(this.name, arr, owner, params);
    }

    async posArr(arr:string, owner:number, id:number, order:number) {
        return await this.uqApi.tuidArrPos(this.name, arr, owner, id, order);
    }
}

export class TuidImport extends Tuid {
    private tuidLocal: TuidLocal;

    constructor(uq:Uq, name:string, typeId:number, from: SchemaFrom) {
        super(uq, name, typeId);
        this.from = from;
    }

    setFrom(tuidLocal: TuidLocal) {this.tuidLocal = tuidLocal}
    
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
    async load(id:number|BoxId):Promise<any> {
        return await this.tuidLocal.load(id);
    }
    async save(id:number, props:any):Promise<TuidSaveResult> {
        return await this.tuidLocal.save(id, props);
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
