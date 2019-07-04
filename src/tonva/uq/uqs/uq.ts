import {Tuid, TuidDiv, TuidImport, TuidLocal, TuidBox} from './tuid';
import {Action} from './action';
import {Sheet} from './sheet';
import {Query} from './query';
import {Book} from './book';
import {History} from './history';
import { UqApi, UqData, UnitxApi, appInFrame } from '../../net';
import { Map } from './map';
import { Pending } from './pending';
import { UqApp } from './uqApp';

export type FieldType = 'id' | 'tinyint' | 'smallint' | 'int' | 'bigint' | 'dec' | 'char' | 'text'
    | 'datetime' | 'date' | 'time';

export function fieldDefaultValue(type:FieldType) {
    switch (type) {
        case 'tinyint':
        case 'smallint':
        case 'int':
        case 'bigint':
        case 'dec':
            return 0;
        case 'char':
        case 'text':
            return '';
        case 'datetime':
        case 'date':
            return '2000-1-1';
        case 'time':
            return '0:00';
    }
}

export interface Field {
    name: string;
    type: FieldType;
    tuid?: string;
    arr?: string;
    null?: boolean;
    size?: number;
    owner?: string;
    _tuid: TuidBox;
    /*
    _ownerField: Field;
    _tuid: Tuid;
    _div: TuidDiv;
    */
}
export interface ArrFields {
    name: string;
    fields: Field[];
    id?: string;
    order?: string;
}
export interface FieldMap {
    [name:string]: Field;
}
export interface SchemaFrom {
    owner:string;
    uq:string;
}

class TuidsCache {
    private cacheTimer: any;
    private tuids: {[name:string]: Tuid};
    constructor(tuids: {[name:string]: Tuid}) {
        this.tuids = tuids;
    }

    cacheTuids(defer:number) {
        this.clearCacheTimer();
        this.cacheTimer = setTimeout(this.loadIds, defer);
    }
    private clearCacheTimer() {
        if (this.cacheTimer === undefined) return;
        clearTimeout(this.cacheTimer);
        this.cacheTimer = undefined;
    }
    private loadIds = () => {
        this.clearCacheTimer();
        for (let i in this.tuids) {
            let tuid = this.tuids[i];
            tuid.cacheIds();
        }
    }
}

export class Uq {
    private tuids: {[name:string]: Tuid} = {};
    private actions: {[name:string]: Action} = {};
    private sheets: {[name:string]: Sheet} = {};
    private queries: {[name:string]: Query} = {};
    private books: {[name:string]: Book} = {};
    private maps: {[name:string]: Map} = {};
    private histories: {[name:string]: History} = {};
    private pendings: {[name:string]: Pending} = {};
    private tuidsCache: TuidsCache;
    private uqApp: UqApp;

    name: string;
    uqApi: UqApi;
    id: number;

    constructor(uqApp: UqApp, uqData: UqData) {
        this.uqApp = uqApp;
        this.tuidsCache = new TuidsCache(this.tuids);
        let {id, uqOwner, uqName, access} = uqData;
        this.id = id;
        this.name = uqOwner + '/' + uqName;
        let hash = document.location.hash;
        let baseUrl = hash===undefined || hash===''? 
            'debug/':'tv/';

        let acc: string[];
        if (access === null || access === undefined || access === '*') {
            acc = [];
        }
        else {
            acc = access.split(';').map(v => v.trim()).filter(v => v.length > 0);
        }
        if (this.name === '$$$/$unitx') {
            // 这里假定，点击home link之后，已经设置unit了
            // 调用 UnitxApi会自动搜索绑定 unitx service
            this.uqApi = new UnitxApi(appInFrame.unit);
        }
        else {
            this.uqApi = new UqApi(baseUrl, uqOwner, uqName, acc, true);
        }
        //this.entities = new Uq(this, uqApi, appId);
    }

    tuid(name:string):Tuid {return this.tuids[name.toLowerCase()]}
    tuidDiv(name:string, div:string):TuidDiv {
        let tuid = this.tuids[name.toLowerCase()]
        return tuid && tuid.div(div.toLowerCase());
    }
    action(name:string):Action {return this.actions[name.toLowerCase()]}
    sheet(name:string):Sheet {return this.sheets[name.toLowerCase()]}
    query(name:string):Query {return this.queries[name.toLowerCase()]}
    book(name:string):Book {return this.books[name.toLowerCase()]}
    map(name:string):Map {return this.maps[name.toLowerCase()]}
    history(name:string):History {return this.histories[name.toLowerCase()]}
    pending(name:string):Pending {return this.pendings[name.toLowerCase()]}

    sheetFromTypeId(typeId:number):Sheet {
        for (let i in this.sheets) {
            let sheet = this.sheets[i];
            if (sheet.typeId === typeId) return sheet;
        }
    }

    tuidArr: Tuid[] = [];
    actionArr: Action[] = [];
    sheetArr: Sheet[] = [];
    queryArr: Query[] = [];
    bookArr: Book[] = [];
    mapArr: Map[] = [];
    historyArr: History[] = [];
    pendingArr: Pending[] = [];

    /*
    private schemaLoaded:boolean = false;
    async loadSchema(): Promise<string> {
        try {
            if (this.schemaLoaded === true) return;
            await this.init();
            await this.loadAccess();
            this.schemaLoaded = true;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }*/

    async init() {
        await this.uqApi.init();
    }

    async loadAccess() {
        let accesses = await this.uqApi.loadAccess();
        if (accesses === undefined) return;
        this.buildEntities(accesses);
    }

    async loadEntities() {
        let accesses = await this.uqApi.loadEntities();
        this.buildEntities(accesses);
    }

    private buildEntities(entities:any) {
        if (entities === undefined) {
            debugger;
        }
        let {access, tuids} = entities;
        this.buildTuids(tuids);
        this.buildAccess(access);
    }

    async checkAccess() {
        return await this.uqApi.checkAccess();
    }

    async loadEntitySchema(entityName: string): Promise<any> {
        return await this.uqApi.schema(entityName);
    }

    getTuid(name:string): Tuid {
        return this.tuids[name];
    }

    private buildTuids(tuids:any) {
        for (let i in tuids) {
            let schema = tuids[i];
            let {name, typeId, from} = schema;
            let tuid = this.newTuid(i, typeId, from);
            tuid.sys = true;
        }
        for (let i in tuids) {
            let schema = tuids[i];
            let tuid = this.getTuid(i);
            tuid.setSchema(schema);
        }
        for (let i in this.tuids) {
            let tuid = this.tuids[i];
            tuid.buildFieldsTuid();
        }
    }

    private buildAccess(access:any) {
        for (let a in access) {
            let v = access[a];
            switch (typeof v) {
                case 'string': this.fromType(a, v); break;
                case 'object': this.fromObj(a, v); break;
            }
        }
        /*
        for (let tuid of this.tuidArr) {
            tuid.setProxies(this);
        }*/
    }

    cacheTuids(defer:number) {
        this.tuidsCache.cacheTuids(defer);
    }

    newAction(name:string, id:number):Action {
        let action = this.actions[name];
        if (action !== undefined) return action;
        action = this.actions[name] = new Action(this, name, id)
        this.actionArr.push(action);
        return action;
    }
    private newTuid(name:string, id:number, from:SchemaFrom):Tuid {
        let tuid = this.tuids[name];
        if (tuid !== undefined) return tuid;
        if (from !== undefined)
            tuid = new TuidImport(this, name, id, from);
        else
            tuid = new TuidLocal(this, name, id);
        this.tuids[name] = tuid;
        this.tuidArr.push(tuid);
        return tuid;
    }
    newQuery(name:string, id:number):Query {
        let query = this.queries[name];
        if (query !== undefined) return query;
        query = this.queries[name] = new Query(this, name, id)
        this.queryArr.push(query);
        return query;
    }
    private newBook(name:string, id:number):Book {
        let book = this.books[name];
        if (book !== undefined) return book;
        book = this.books[name] = new Book(this, name, id);
        this.bookArr.push(book);
        return book;
    }
    private newMap(name:string, id:number):Map {
        let map = this.maps[name];
        if (map !== undefined) return map;
        map = this.maps[name] = new Map(this, name, id)
        this.mapArr.push(map);
        return map;
    }
    private newHistory(name:string, id:number):History {
        let history = this.histories[name];
        if (history !== undefined) return;
        history = this.histories[name] = new History(this, name, id)
        this.historyArr.push(history);
        return history;
    }
    private newPending(name:string, id:number):Pending {
        let pending = this.pendings[name];
        if (pending !== undefined) return;
        pending = this.pendings[name] = new Pending(this, name, id)
        this.pendingArr.push(pending);
        return pending;
    }
    newSheet(name:string, id:number):Sheet {
        let sheet = this.sheets[name];
        if (sheet !== undefined) return sheet;
        sheet = this.sheets[name] = new Sheet(this, name, id);
        this.sheetArr.push(sheet);
        return sheet;
    }
    private fromType(name:string, type:string) {
        let parts = type.split('|');
        type = parts[0];
        let id = Number(parts[1]);
        switch (type) {
            //case 'uq': this.id = id; break;
            case 'tuid':
                // Tuid should not be created here!;
                //let tuid = this.newTuid(name, id);
                //tuid.sys = false;
                break;
            case 'action': this.newAction(name, id); break;
            case 'query': this.newQuery(name, id); break;
            case 'book': this.newBook(name, id); break;
            case 'map': this.newMap(name, id); break;
            case 'history': this.newHistory(name, id); break;
            case 'sheet':this.newSheet(name, id); break;
            case 'pending': this.newPending(name, id); break;
        }
    }
    private fromObj(name:string, obj:any) {
        switch (obj['$']) {
            case 'sheet': this.buildSheet(name, obj); break;
        }
    }
    private buildSheet(name:string, obj:any) {
        let sheet = this.sheets[name];
        if (sheet === undefined) sheet = this.newSheet(name, obj.id);
        sheet.build(obj);
        /*
        let states = sheet.states;
        for (let p in obj) {
            switch(p) {
                case '#':
                case '$': continue;
                default: states.push(this.createSheetState(p, obj[p])); break;
            }
        }*/
    }
    /*
    private createSheetState(name:string, obj:object):SheetState {
        let ret:SheetState = {name:name, actions:[]};
        let actions = ret.actions;
        for (let p in obj) {
            let action:SheetAction = {name: p};
            actions.push(action);
        }
        return ret;
    }*/
    buildFieldTuid(fields:Field[], mainFields?:Field[]) {
        if (fields === undefined) return;
        for (let f of fields) {
            let {tuid} = f;
            if (tuid === undefined) continue;
            let t = this.getTuid(tuid);
            if (t === undefined) continue;
            f._tuid = t.buildTuidBox();
        }
        for (let f of fields) {
            let {owner} = f;
            if (owner === undefined) continue;
            let ownerField = fields.find(v => v.name === owner);
            if (ownerField === undefined) {
                if (mainFields !== undefined) {
                    ownerField = mainFields.find(v => v.name === owner);
                }
                if (ownerField === undefined) {
                    debugger;
                    throw `owner field ${owner} is undefined`;
                }
            }
            //f._ownerField = ownerField;
            //let {arr} = f;
            let {arr, tuid} = f;
            let t = this.getTuid(ownerField._tuid.tuid.name);
            if (t === undefined) continue;
            let div = t.div(arr || tuid);
            f._tuid = div && div.buildTuidBox(ownerField);
            if (f._tuid === undefined) {
                debugger;
                throw 'owner field ${owner} is not tuid';
            }
        }
    }
    buildArrFieldsTuid(arrFields:ArrFields[], mainFields:Field[]) {
        if (arrFields === undefined) return;
        for (let af of arrFields) {
            let {fields} = af;
            if (fields === undefined) continue;
            this.buildFieldTuid(fields, mainFields);
        }
    }
}
