var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { observable } from 'mobx';
import { isNumber } from 'util';
const maxCacheSize = 1000;
export class IdCache {
    constructor(tuidLocal) {
        this.queue = []; // 每次使用，都排到队头
        this.cache = observable.map({}, { deep: false }); // 已经缓冲的
        this.waitingIds = []; // 等待loading的
        this.divName = undefined;
        this.tuidLocal = tuidLocal;
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
        this.tuidLocal.cacheTuids(defer === true ? 70 : 20);
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
    moveToHead(id) {
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
        this.queue.push(id);
    }
    getValue(id) {
        return this.cache.get(id);
    }
    valueFromId(id) {
        let _id;
        switch (typeof id) {
            case 'object':
                _id = id.id;
                break;
            case 'number':
                _id = id;
                break;
            default: return;
        }
        return this.getValue(_id);
    }
    resetCache(id) {
        this.cache.delete(id);
        let index = this.queue.findIndex(v => v === id);
        this.queue.splice(index, 1);
        this.useId(id);
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
        return true;
    }
    getIdFromObj(val) { return this.tuidLocal.getIdFromObj(val); }
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
    cacheIds() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.waitingIds.length === 0)
                return;
            let tuidValues = yield this.loadIds();
            yield this.cacheIdValues(tuidValues);
        });
    }
    cacheIdValues(tuidValues) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tuidValues === undefined)
                return;
            let tuids = this.unpackTuidIds(tuidValues);
            for (let tuidValue of tuids) {
                if (this.cacheValue(tuidValue) === false)
                    continue;
                this.cacheTuidFieldValues(tuidValue);
                //this.afterCacheValue(tuidValue);
            }
        });
    }
    loadIds() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.tuidLocal.loadTuidIds(this.divName, this.waitingIds);
            return ret;
        });
    }
    unpackTuidIds(values) {
        return this.tuidLocal.unpackTuidIds(values);
    }
    cacheTuidFieldValues(tuidValue) {
        this.tuidLocal.cacheTuidFieldValues(tuidValue);
    }
    assureObj(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let val = this.cache.get(id);
            switch (typeof val) {
                case 'object': return;
                case 'number':
                    this.cache.set(id, id);
                    break;
            }
            let ret = yield this.tuidLocal.loadTuidIds(this.divName, [id]);
            yield this.cacheIdValues(ret);
        });
    }
}
export class IdDivCache extends IdCache {
    constructor(tuidLocal, div) {
        super(tuidLocal);
        this.div = div;
        this.divName = div.name;
    }
    getIdFromObj(val) { return this.div.getIdFromObj(val); }
    unpackTuidIds(values) {
        return this.div.unpackTuidIds(values);
    }
    cacheTuidFieldValues(tuidValue) {
        this.div.cacheTuidFieldValues(tuidValue);
    }
}
//# sourceMappingURL=idCache.js.map