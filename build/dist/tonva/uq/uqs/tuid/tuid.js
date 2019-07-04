var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import _ from 'lodash';
import { Entity } from '../entity';
import { IdCache } from './idCache';
import { TuidDiv } from './tuidDiv';
import { TuidBox } from './tuidBox';
import { BoxId } from './boxId';
export class Tuid extends Entity {
    constructor(uq, name, typeId) {
        super(uq, name, typeId);
        this.typeName = 'tuid';
        this.isImport = false;
    }
    setSchema(schema) {
        super.setSchema(schema);
        let { id } = schema;
        this.idName = id;
    }
    buildTuidBox() {
        return new TuidBox(this);
    }
    setUIRes(ui, res) {
        //this.ui = (ui as TuidUI).content;
        this.ui = ui.content;
        this.res = res;
    }
    getIdFromObj(obj) { return obj[this.idName]; }
    cacheIds() { }
}
export class TuidLocal extends Tuid {
    constructor() {
        super(...arguments);
        this.idCache = new IdCache(this);
    }
    setSchema(schema) {
        super.setSchema(schema);
        let { arrs } = schema;
        if (arrs !== undefined) {
            this.divs = {};
            for (let arr of arrs) {
                let { name } = arr;
                let tuidDiv = new TuidDiv(this.uq, this, name);
                this.divs[name] = tuidDiv;
                tuidDiv.setSchema(arr);
                tuidDiv.buildFieldsTuid();
            }
        }
    }
    setUIRes(ui, res) {
        super.setUIRes(ui, res);
        if (this.divs === undefined)
            return;
        //let uiDivs = (ui as TuidUI).divs;
        let uiDivs = ui.divs;
        if (uiDivs === undefined)
            return;
        for (let i in this.divs) {
            this.divs[i].setUIRes(uiDivs[i], res);
        }
    }
    useId(id, defer) {
        this.idCache.useId(id, defer);
    }
    boxId(id) {
        if (typeof id === 'object')
            return id;
        this.useId(id);
        return new BoxId(this, id);
    }
    valueFromId(id) { return this.idCache.getValue(id); }
    assureBox(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.idCache.assureObj(id);
        });
    }
    cacheIds() {
        this.idCache.cacheIds();
        if (this.divs === undefined)
            return;
        for (let i in this.divs)
            this.divs[i].cacheIds();
    }
    cacheTuids(defer) { this.uq.cacheTuids(defer); }
    get hasDiv() { return this.divs !== undefined; }
    div(name) {
        return this.divs && this.divs[name];
    }
    loadTuidIds(divName, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.uqApi.tuidIds(this.name, divName, ids);
        });
    }
    load(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === undefined || id === 0)
                return;
            if (typeof id === 'object')
                id = id.id;
            let values = yield this.uqApi.tuidGet(this.name, id);
            if (values === undefined)
                return;
            for (let f of this.schema.fields) {
                let { tuid } = f;
                if (tuid === undefined)
                    continue;
                let t = this.uq.getTuid(tuid);
                if (t === undefined)
                    continue;
                let n = f.name;
                values[n] = t.boxId(values[n]);
            }
            //values._$tuid = this;
            this.idCache.cacheValue(values);
            this.cacheTuidFieldValues(values);
            return values;
        });
    }
    cacheTuidFieldValues(values) {
        let { fields, arrs } = this.schema;
        this.cacheFieldsInValue(values, fields);
        if (arrs !== undefined) {
            for (let arr of arrs) {
                let { name, fields } = arr;
                let arrValues = values[name];
                if (arrValues === undefined)
                    continue;
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
    buildFieldsTuid() {
        super.buildFieldsTuid();
        let { mainFields } = this.schema;
        if (mainFields === undefined)
            debugger;
        this.uq.buildFieldTuid(this.cacheFields = mainFields || this.fields);
    }
    unpackTuidIds(values) {
        return this.unpackTuidIdsOfFields(values, this.cacheFields);
    }
    save(id, props) {
        return __awaiter(this, void 0, void 0, function* () {
            let { fields } = this.schema;
            let params = { $id: id };
            for (let field of fields) {
                let { name, tuid, type } = field;
                let val = props[name];
                if (tuid !== undefined) {
                    if (typeof val === 'object') {
                        if (val !== null)
                            val = val.id;
                    }
                }
                else {
                    switch (type) {
                        case 'date':
                        case 'datetime':
                            val = new Date(val).toISOString();
                            val = val.replace('T', ' ');
                            val = val.replace('Z', '');
                            break;
                    }
                }
                params[name] = val;
            }
            let ret = yield this.uqApi.tuidSave(this.name, params);
            return ret;
        });
    }
    search(key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.searchArr(undefined, key, pageStart, pageSize);
            return ret;
        });
    }
    searchArr(owner, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let { fields } = this.schema;
            let api = this.uqApi;
            let ret = yield api.tuidSearch(this.name, undefined, owner, key, pageStart, pageSize);
            for (let row of ret) {
                this.cacheFieldsInValue(row, fields);
            }
            return ret;
        });
    }
    loadArr(arr, owner, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === undefined || id === 0)
                return;
            let api = this.uqApi;
            return yield api.tuidArrGet(this.name, arr, owner, id);
        });
    }
    saveArr(arr, owner, id, props) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = _.clone(props);
            params["$id"] = id;
            return yield this.uqApi.tuidArrSave(this.name, arr, owner, params);
        });
    }
    posArr(arr, owner, id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.uqApi.tuidArrPos(this.name, arr, owner, id, order);
        });
    }
}
export class TuidImport extends Tuid {
    constructor(uq, name, typeId, from) {
        super(uq, name, typeId);
        this.isImport = true;
        this.from = from;
    }
    setFrom(tuidLocal) { this.tuidLocal = tuidLocal; }
    useId(id) { this.tuidLocal.useId(id); }
    boxId(id) { return this.tuidLocal.boxId(id); }
    valueFromId(id) { return this.tuidLocal.valueFromId(id); }
    assureBox(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tuidLocal.assureBox(id);
        });
    }
    get hasDiv() { return this.tuidLocal.hasDiv; }
    div(name) { return this.tuidLocal.div(name); }
    load(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tuidLocal.load(id);
        });
    }
    save(id, props) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tuidLocal.save(id, props);
        });
    }
    search(key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tuidLocal.search(key, pageStart, pageSize);
        });
    }
    searchArr(owner, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tuidLocal.searchArr(owner, key, pageStart, pageSize);
        });
    }
    loadArr(arr, owner, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tuidLocal.loadArr(arr, owner, id);
        });
    }
    saveArr(arr, owner, id, props) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tuidLocal.saveArr(arr, owner, id, props);
        });
    }
    posArr(arr, owner, id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tuidLocal.posArr(arr, owner, id, order);
        });
    }
}
//# sourceMappingURL=tuid.js.map