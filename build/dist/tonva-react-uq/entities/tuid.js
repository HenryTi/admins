var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { observable } from 'mobx';
import _ from 'lodash';
import { Entity } from './entity';
import { isNumber } from 'util';
export class BoxId {
}
const maxCacheSize = 1000;
export class Tuid extends Entity {
    constructor(entities, name, typeId) {
        super(entities, name, typeId);
        this.queue = []; // 每次使用，都排到队头
        this.waitingIds = []; // 等待loading的
        this.cache = observable.map({}, { deep: false }); // 已经缓冲的
        this.buildIdBoxer();
    }
    get typeName() { return 'tuid'; }
    buildIdBoxer() {
        this.BoxId = function () { };
        let prototype = this.BoxId.prototype;
        Object.defineProperty(prototype, '_$tuid', {
            value: this,
            writable: false,
            enumerable: false,
        });
        Object.defineProperty(prototype, 'obj', {
            enumerable: false,
            get: function () {
                if (this.id === undefined || this.id <= 0)
                    return undefined;
                return this._$tuid.valueFromId(this.id);
            }
        });
        prototype.valueFromFieldName = function (fieldName) {
            let t = this._$tuid;
            return t.valueFromFieldName(fieldName, this.obj);
        };
        prototype.toJSON = function () { return this.id; };
    }
    boxId(id) {
        this.useId(id);
        let ret = new this.BoxId();
        ret.id = id;
        return ret;
    }
    getTuidContent() {
        return this.entities.cUq.getTuidContent(this);
    }
    getIdFromObj(item) {
        return item[this.idName];
    }
    setSchema(schema) {
        super.setSchema(schema);
        let { id, unique } = schema;
        this.idName = id;
        this.unique = unique;
        this.schemaFrom = this.schema.from;
    }
    moveToHead(id) {
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
        this.queue.push(id);
    }
    valueFromId(id) {
        let _id;
        let tId = typeof id;
        switch (typeof id) {
            case 'object':
                _id = id.id;
                break;
            case 'number':
                _id = id;
                break;
            default: return;
        }
        let v = this.cache.get(_id);
        if (this.owner !== undefined && typeof v === 'object') {
            v.$owner = this.owner.boxId(v.owner); // this.owner.valueFromId(v.owner);
        }
        return v;
    }
    valueFromFieldName(fieldName, obj) {
        if (obj === undefined)
            return;
        let f = this.fields.find(v => v.name === fieldName);
        if (f === undefined)
            return;
        let v = obj[fieldName];
        let { _tuid } = f;
        if (_tuid === undefined)
            return v;
        return _tuid.valueFromId(v);
    }
    resetCache(id) {
        this.cache.delete(id);
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
        this.useId(id);
    }
    useId(id, defer) {
        if (id === undefined || id === 0)
            return;
        if (isNumber(id) === false)
            return;
        if (this.cache.has(id) === true) {
            this.moveToHead(id);
            return;
        }
        this.entities.cacheTuids(defer === true ? 70 : 20);
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
    proxied(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let proxyTuid = this.entities.getTuid(name, undefined);
            proxyTuid.useId(id);
            let proxied = yield this.tvApi.proxied(this.name, name, id);
            this.cacheValue(proxied);
            return proxied;
        });
    }
    cacheValue(val) {
        if (val === undefined)
            return false;
        let id = this.getIdFromObj(val);
        if (id === undefined)
            return false;
        let index = this.waitingIds.findIndex(v => v === id);
        if (index >= 0)
            this.waitingIds.splice(index, 1);
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
    afterCacheId(tuidValue) {
        for (let f of this.fields) {
            let { _tuid } = f;
            if (_tuid === undefined)
                continue;
            _tuid.useId(tuidValue[f.name]);
        }
    }
    cacheIds() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.waitingIds.length === 0)
                return;
            let name, arr;
            if (this.owner === undefined) {
                name = this.name;
            }
            else {
                name = this.owner.name;
                arr = this.name;
            }
            let api = yield this.getApiFrom();
            let tuids = yield api.tuidIds(name, arr, this.waitingIds);
            for (let tuidValue of tuids) {
                if (this.cacheValue(tuidValue) === false)
                    continue;
                this.cacheTuidFieldValues(tuidValue);
                this.afterCacheId(tuidValue);
            }
            yield this.cacheDivIds();
        });
    }
    cacheDivIds() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    load(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === undefined || id === 0)
                return;
            let api = yield this.getApiFrom();
            let values = yield api.tuidGet(this.name, id);
            if (values === undefined)
                return;
            values._$tuid = this;
            this.cacheValue(values);
            this.cacheTuidFieldValues(values);
            return values;
        });
    }
    getDiv(divName) { return; }
    cacheTuidFieldValues(values) {
        let { fields, arrs } = this.schema;
        this.cacheFieldsInValue(values, fields);
        if (arrs !== undefined) {
            for (let arr of arrs) {
                let { name, fields } = arr;
                let arrValues = values[name];
                if (arrValues === undefined)
                    continue;
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
    cacheFieldsInValue(values, fields) {
        for (let f of fields) {
            let { name, _tuid } = f;
            if (_tuid === undefined)
                continue;
            let id = values[name];
            //_tuid.useId(id);
            values[name] = _tuid.boxId(id);
        }
    }
    save(id, props) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = _.clone(props);
            params["$id"] = id;
            let ret = yield this.tvApi.tuidSave(this.name, params);
            let { id: retId, inId } = ret;
            if (retId === undefined) {
                params.id = id;
                this.cacheValue(params);
            }
            else if (retId > 0) {
                params.id = retId;
                this.cacheValue(params);
            }
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
            let name, arr;
            if (this.owner !== undefined) {
                name = this.owner.name;
                arr = this.name;
            }
            else {
                name = this.name;
                arr = undefined;
            }
            let api = yield this.getApiFrom();
            let ret = yield api.tuidSearch(name, arr, owner, key, pageStart, pageSize);
            for (let row of ret) {
                this.cacheFieldsInValue(row, fields);
                if (this.owner !== undefined)
                    row.$owner = this.owner.boxId(row.owner);
            }
            return ret;
        });
    }
    loadArr(arr, owner, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === undefined || id === 0)
                return;
            let api = yield this.getApiFrom();
            return yield api.tuidArrGet(this.name, arr, owner, id);
        });
    }
    /*
    async loadArrAll(owner:number):Promise<any[]> {
        return this.all = await this.tvApi.tuidGetAll(this.name);
    }*/
    saveArr(arr, owner, id, props) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = _.clone(props);
            params["$id"] = id;
            return yield this.tvApi.tuidArrSave(this.name, arr, owner, params);
        });
    }
    posArr(arr, owner, id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tvApi.tuidArrPos(this.name, arr, owner, id, order);
        });
    }
    // cache放到Tuid里面之后，这个函数不再需要公开调用了
    //private async ids(idArr:number[]) {
    //    return await this.tvApi.tuidIds(this.name, idArr);
    //}
    showInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.entities.cUq.showTuid(this, id);
        });
    }
}
export class TuidMain extends Tuid {
    get Main() { return this; }
    get uqApi() { return this.entities.uqApi; }
    ;
    setSchema(schema) {
        super.setSchema(schema);
        let { arrs } = schema;
        if (arrs !== undefined) {
            this.divs = {};
            for (let arr of arrs) {
                let { name } = arr;
                let tuidDiv = new TuidDiv(this.entities, name, this.typeId);
                tuidDiv.owner = this;
                this.divs[name] = tuidDiv;
                tuidDiv.setSchema(arr);
            }
        }
    }
    getDiv(divName) { return this.divs[divName]; }
    /* 努力回避async里面的super调用，edge不兼容
    async cacheIds():Promise<void> {
        await super.cacheIds();
        if (this.divs === undefined) return;
        for (let i in this.divs) {
            await this.divs[i].cacheIds();
        }
    }
    */
    cacheDivIds() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.divs === undefined)
                return;
            for (let i in this.divs) {
                yield this.divs[i].cacheIds();
            }
        });
    }
    cUqFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.schemaFrom === undefined)
                return this.entities.cUq;
            let { owner, uq: uq } = this.schemaFrom;
            let cUq = yield this.entities.cUq;
            let cApp = cUq.cApp;
            if (cApp === undefined)
                return cUq;
            let cUqFrm = yield cApp.getImportUq(owner, uq);
            if (cUqFrm === undefined) {
                console.error(`${owner}/${uq} 不存在`);
                debugger;
                return cUq;
            }
            let retErrors = yield cUqFrm.loadSchema();
            if (retErrors !== undefined) {
                console.error('cUq.loadSchema: ' + retErrors);
                debugger;
                return cUq;
            }
            return cUqFrm;
        });
    }
    getApiFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            let from = yield this.from();
            if (from !== undefined) {
                return from.entities.uqApi;
            }
            return this.entities.uqApi;
        });
    }
    from() {
        return __awaiter(this, void 0, void 0, function* () {
            let cUq = yield this.cUqFrom();
            return cUq.tuid(this.name);
        });
    }
    cFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            let cUq = yield this.cUqFrom();
            return cUq.cTuidMainFromName(this.name);
        });
    }
    cEditFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            let cUq = yield this.cUqFrom();
            return cUq.cTuidEditFromName(this.name);
        });
    }
    cInfoFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            let cUq = yield this.cUqFrom();
            return cUq.cTuidInfoFromName(this.name);
        });
    }
    cSelectFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            let cUq = yield this.cUqFrom();
            if (cUq === undefined)
                return;
            return cUq.cTuidSelectFromName(this.name);
        });
    }
    afterCacheId(tuidValue) {
        super.afterCacheId(tuidValue);
        if (this.proxies === undefined)
            return;
        let { type, $proxy } = tuidValue;
        let pTuid = this.proxies[type];
        pTuid.useId($proxy);
    }
}
export class TuidDiv extends Tuid {
    get Main() { return this.owner; }
    getApiFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.owner.getApiFrom();
        });
    }
}
//# sourceMappingURL=tuid.js.map