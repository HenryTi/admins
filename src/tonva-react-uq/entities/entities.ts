import {TuidMain, Tuid} from './tuid';
import {Action} from './action';
import {Sheet, SheetState, SheetAction} from './sheet';
import {Query} from './query';
import {Book} from './book';
import {History} from './history';
import { UqApi } from 'tonva-tools';
import { Map } from './map';
import { Pending } from './pending';
import { CUq } from '../controllers';

export type FieldType = 'tinyint' | 'smallint' | 'int' | 'bigint' | 'dec' | 'char' | 'text' 
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
    url?: string;
    null?: boolean;
    size?: number;
    owner?: string;
    _ownerField: Field;
    _tuid: Tuid;
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

export class Entities {
    private tuids: {[name:string]: TuidMain} = {};
    private actions: {[name:string]: Action} = {};
    private sheets: {[name:string]: Sheet} = {};
    private queries: {[name:string]: Query} = {};
    private books: {[name:string]: Book} = {};
    private maps: {[name:string]: Map} = {};
    private histories: {[name:string]: History} = {};
    private pendings: {[name:string]: Pending} = {};
    private cacheTimer: any;
    cUq: CUq;
    uqApi: UqApi;
    appId: number;
    uqId: number;

    constructor(cUq: CUq, uqApi:UqApi, appId: number) {
        this.cUq = cUq;
        this.uqApi = uqApi;
        this.appId = appId;
    }

    tuid(name:string):TuidMain {return this.tuids[name.toLowerCase()]}
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

    tuidArr: TuidMain[] = [];
    actionArr: Action[] = [];
    sheetArr: Sheet[] = [];
    queryArr: Query[] = [];
    bookArr: Book[] = [];
    mapArr: Map[] = [];
    historyArr: History[] = [];
    pendingArr: Pending[] = [];

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

    getTuid(name:string, div?:string, tuidUrl?:string): Tuid {
        let tuid = this.tuids[name];
        if (tuid === undefined) return;
        if (div === undefined) return tuid;
        return tuid.divs[div];
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

    private buildTuids(tuids:any) {
        let proxyColl = {} as any;
        for (let i in tuids) {
            let schema = tuids[i];
            let {name, typeId, proxies} = schema;
            let tuid = this.newTuid(i, typeId);
            tuid.sys = true;
            //tuid.setSchema(schema);
            if (proxies !== undefined) proxyColl[i] = proxies;
        }
        for (let i in tuids) {
            let schema = tuids[i];
            let {name} = schema;
            let tuid = this.getTuid(i);
            //tuid.sys = true;
            tuid.setSchema(schema);
        }
        for (let i in proxyColl) {
            let proxies:string[] = proxyColl[i];
            let tuid = this.tuids[i];
            tuid.proxies = {};
            for (let p of proxies) {
                tuid.proxies[p] = this.tuids[p];
            }
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

    newAction(name:string, id:number):Action {
        let action = this.actions[name];
        if (action !== undefined) return action;
        action = this.actions[name] = new Action(this, name, id)
        this.actionArr.push(action);
        return action;
    }
    newTuid(name:string, id:number):TuidMain {
        let tuid = this.tuids[name];
        if (tuid !== undefined) return tuid;
        tuid = this.tuids[name] = new TuidMain(this, name, id);
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
    newBook(name:string, id:number):Book {
        let book = this.books[name];
        if (book !== undefined) return book;
        book = this.books[name] = new Book(this, name, id);
        this.bookArr.push(book);
        return book;
    }
    newMap(name:string, id:number):Map {
        let map = this.maps[name];
        if (map !== undefined) return map;
        map = this.maps[name] = new Map(this, name, id)
        this.mapArr.push(map);
        return map;
    }
    newHistory(name:string, id:number):History {
        let history = this.histories[name];
        if (history !== undefined) return;
        history = this.histories[name] = new History(this, name, id)
        this.historyArr.push(history);
        return history;
    }
    newPending(name:string, id:number):Pending {
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
            case 'uq': this.uqId = id; break;
            case 'tuid': 
                let tuid = this.newTuid(name, id);
                tuid.sys = false;
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
            let {tuid, arr, url} = f;
            if (tuid === undefined) continue;
            f._tuid = this.getTuid(tuid, arr, url);
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
                    throw `owner field ${owner} is undefined`;
                }
            }
            f._ownerField = ownerField;
            let {arr, url} = f;
            f._tuid = this.getTuid(ownerField._tuid.name, arr, url);
            if (f._tuid === undefined) throw 'owner field ${owner} is not tuid';
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
