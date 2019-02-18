var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TuidMain } from './tuid';
import { Action } from './action';
import { Sheet } from './sheet';
import { Query } from './query';
import { Book } from './book';
import { History } from './history';
import { Map } from './map';
import { Pending } from './pending';
export function fieldDefaultValue(type) {
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
export class Entities {
    constructor(cUq, uqApi, appId) {
        this.tuids = {};
        this.actions = {};
        this.sheets = {};
        this.queries = {};
        this.books = {};
        this.maps = {};
        this.histories = {};
        this.pendings = {};
        this.tuidArr = [];
        this.actionArr = [];
        this.sheetArr = [];
        this.queryArr = [];
        this.bookArr = [];
        this.mapArr = [];
        this.historyArr = [];
        this.pendingArr = [];
        this.loadIds = () => {
            this.clearCacheTimer();
            for (let i in this.tuids) {
                let tuid = this.tuids[i];
                tuid.cacheIds();
            }
        };
        this.cUq = cUq;
        this.uqApi = uqApi;
        this.appId = appId;
    }
    tuid(name) { return this.tuids[name.toLowerCase()]; }
    action(name) { return this.actions[name.toLowerCase()]; }
    sheet(name) { return this.sheets[name.toLowerCase()]; }
    query(name) { return this.queries[name.toLowerCase()]; }
    book(name) { return this.books[name.toLowerCase()]; }
    map(name) { return this.maps[name.toLowerCase()]; }
    history(name) { return this.histories[name.toLowerCase()]; }
    pending(name) { return this.pendings[name.toLowerCase()]; }
    sheetFromTypeId(typeId) {
        for (let i in this.sheets) {
            let sheet = this.sheets[i];
            if (sheet.typeId === typeId)
                return sheet;
        }
    }
    loadAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            let accesses = yield this.uqApi.loadAccess();
            if (accesses === undefined)
                return;
            this.buildEntities(accesses);
        });
    }
    loadEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            let accesses = yield this.uqApi.loadEntities();
            this.buildEntities(accesses);
        });
    }
    buildEntities(entities) {
        if (entities === undefined) {
            debugger;
        }
        let { access, tuids } = entities;
        this.buildTuids(tuids);
        this.buildAccess(access);
    }
    getTuid(name, div, tuidUrl) {
        let tuid = this.tuids[name];
        if (tuid === undefined)
            return;
        if (div === undefined)
            return tuid;
        return tuid.divs[div];
    }
    cacheTuids(defer) {
        this.clearCacheTimer();
        this.cacheTimer = setTimeout(this.loadIds, defer);
    }
    clearCacheTimer() {
        if (this.cacheTimer === undefined)
            return;
        clearTimeout(this.cacheTimer);
        this.cacheTimer = undefined;
    }
    buildTuids(tuids) {
        let proxyColl = {};
        for (let i in tuids) {
            let schema = tuids[i];
            let { name, typeId, proxies } = schema;
            let tuid = this.newTuid(i, typeId);
            tuid.sys = true;
            //tuid.setSchema(schema);
            if (proxies !== undefined)
                proxyColl[i] = proxies;
        }
        for (let i in tuids) {
            let schema = tuids[i];
            let { name } = schema;
            let tuid = this.getTuid(i);
            //tuid.sys = true;
            tuid.setSchema(schema);
        }
        for (let i in proxyColl) {
            let proxies = proxyColl[i];
            let tuid = this.tuids[i];
            tuid.proxies = {};
            for (let p of proxies) {
                tuid.proxies[p] = this.tuids[p];
            }
        }
    }
    buildAccess(access) {
        for (let a in access) {
            let v = access[a];
            switch (typeof v) {
                case 'string':
                    this.fromType(a, v);
                    break;
                case 'object':
                    this.fromObj(a, v);
                    break;
            }
        }
        /*
        for (let tuid of this.tuidArr) {
            tuid.setProxies(this);
        }*/
    }
    newAction(name, id) {
        let action = this.actions[name];
        if (action !== undefined)
            return action;
        action = this.actions[name] = new Action(this, name, id);
        this.actionArr.push(action);
        return action;
    }
    newTuid(name, id) {
        let tuid = this.tuids[name];
        if (tuid !== undefined)
            return tuid;
        tuid = this.tuids[name] = new TuidMain(this, name, id);
        this.tuidArr.push(tuid);
        return tuid;
    }
    newQuery(name, id) {
        let query = this.queries[name];
        if (query !== undefined)
            return query;
        query = this.queries[name] = new Query(this, name, id);
        this.queryArr.push(query);
        return query;
    }
    newBook(name, id) {
        let book = this.books[name];
        if (book !== undefined)
            return book;
        book = this.books[name] = new Book(this, name, id);
        this.bookArr.push(book);
        return book;
    }
    newMap(name, id) {
        let map = this.maps[name];
        if (map !== undefined)
            return map;
        map = this.maps[name] = new Map(this, name, id);
        this.mapArr.push(map);
        return map;
    }
    newHistory(name, id) {
        let history = this.histories[name];
        if (history !== undefined)
            return;
        history = this.histories[name] = new History(this, name, id);
        this.historyArr.push(history);
        return history;
    }
    newPending(name, id) {
        let pending = this.pendings[name];
        if (pending !== undefined)
            return;
        pending = this.pendings[name] = new Pending(this, name, id);
        this.pendingArr.push(pending);
        return pending;
    }
    newSheet(name, id) {
        let sheet = this.sheets[name];
        if (sheet !== undefined)
            return sheet;
        sheet = this.sheets[name] = new Sheet(this, name, id);
        this.sheetArr.push(sheet);
        return sheet;
    }
    fromType(name, type) {
        let parts = type.split('|');
        type = parts[0];
        let id = Number(parts[1]);
        switch (type) {
            case 'uq':
                this.uqId = id;
                break;
            case 'tuid':
                let tuid = this.newTuid(name, id);
                tuid.sys = false;
                break;
            case 'action':
                this.newAction(name, id);
                break;
            case 'query':
                this.newQuery(name, id);
                break;
            case 'book':
                this.newBook(name, id);
                break;
            case 'map':
                this.newMap(name, id);
                break;
            case 'history':
                this.newHistory(name, id);
                break;
            case 'sheet':
                this.newSheet(name, id);
                break;
            case 'pending':
                this.newPending(name, id);
                break;
        }
    }
    fromObj(name, obj) {
        switch (obj['$']) {
            case 'sheet':
                this.buildSheet(name, obj);
                break;
        }
    }
    buildSheet(name, obj) {
        let sheet = this.sheets[name];
        if (sheet === undefined)
            sheet = this.newSheet(name, obj.id);
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
    buildFieldTuid(fields, mainFields) {
        if (fields === undefined)
            return;
        for (let f of fields) {
            let { tuid, arr, url } = f;
            if (tuid === undefined)
                continue;
            f._tuid = this.getTuid(tuid, arr, url);
        }
        for (let f of fields) {
            let { owner } = f;
            if (owner === undefined)
                continue;
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
            let { arr, url } = f;
            f._tuid = this.getTuid(ownerField._tuid.name, arr, url);
            if (f._tuid === undefined)
                throw 'owner field ${owner} is not tuid';
        }
    }
    buildArrFieldsTuid(arrFields, mainFields) {
        if (arrFields === undefined)
            return;
        for (let af of arrFields) {
            let { fields } = af;
            if (fields === undefined)
                continue;
            this.buildFieldTuid(fields, mainFields);
        }
    }
}
//# sourceMappingURL=entities.js.map