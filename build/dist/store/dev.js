var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { observable } from 'mobx';
import * as _ from 'lodash';
import { devApi } from '../api';
export class ObjItems {
    constructor(store, dev) {
        this.items = undefined;
        this.cur = undefined;
        this.store = store;
        this.dev = dev;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this._load();
            this.items = ret;
        });
    }
    saveCur(item) {
        return __awaiter(this, void 0, void 0, function* () {
            let values = {};
            if (this.cur !== undefined) {
                _.assign(values, this.cur, item);
            }
            else {
                _.assign(values, item);
            }
            values.unit = item.unit = this.store.unit.id;
            let id = yield this._save(values);
            if (this.cur === undefined) {
                if (id === 0)
                    return false;
                item.id = id;
                if (this.items !== undefined)
                    this.items.unshift(item);
                this._inc();
            }
            else {
                _.assign(this.cur, values);
                //this.cur = values;
            }
            return true;
        });
    }
    save(item) {
        return __awaiter(this, void 0, void 0, function* () {
            let values = {};
            _.assign(values, item);
            values.unit = item.unit = this.store.unit.id;
            let id = yield this._save(values);
            if (id === 0)
                return;
            values.id = id;
            return values;
        });
    }
    del() {
        return __awaiter(this, void 0, void 0, function* () {
            let c = this.cur;
            if (c === undefined)
                return;
            let id = c.id;
            yield this._del(c);
            if (this.items === undefined)
                return;
            let index = this.items.findIndex(v => v.id === id);
            if (index >= 0) {
                this.items.splice(index, 1);
                this._dec();
            }
        });
    }
}
__decorate([
    observable
], ObjItems.prototype, "items", void 0);
__decorate([
    observable
], ObjItems.prototype, "cur", void 0);
class Apps extends ObjItems {
    constructor() {
        super(...arguments);
        this.apis = undefined;
        this.searchedApis = undefined;
    }
    //@observable service: DevModel.Service = null;
    _load() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.apps(this.store.unit.id);
        });
    }
    _save(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.saveApp(item);
        });
    }
    _del(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield devApi.delApp(this.store.unit.id, item.id);
        });
    }
    _inc() { this.dev.counts.app++; }
    _dec() { this.dev.counts.app--; }
    loadCurApis() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield devApi.loadAppApis(this.cur.id);
            this.apis = ret;
        });
    }
    /*
    public async loadService() {
        this.service = await devApi.loadAppServices(this.store.unit.id, this.cur.id);
    }*/
    searchApi(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.searchedApis = yield devApi.searchApi(this.store.unit.id, key, 0, searchPageSize);
        });
    }
    /*
    public async appBindApi(apiIds:number[], bind:boolean) {
        await devApi.appBindApi(this.store.unit.id, this.cur.id, apiIds, bind? 1:0);
        for (let api of apiIds) {
            if (bind) {
                if (this.searchedApis !== undefined) {
                    let find = this.searchedApis.find(a => a.id === api);
                    if (find !== undefined) this.apis.unshift(find);
                }
            }
            else {
                let index = this.apis.findIndex(a => a.id === api);
                if (index>=0) this.apis.splice(index, 1);
            }
        }
    }*/
    // if apis === undefined, then unbind
    appBindApi(apis) {
        return __awaiter(this, void 0, void 0, function* () {
            yield devApi.appBindApi(this.store.unit.id, this.cur.id, apis);
            for (let api of apis) {
                let index = this.apis.findIndex(a => a.id === api.id);
                if (index >= 0)
                    this.apis.splice(index, 1);
                if (this.searchedApis !== undefined) {
                    let find = this.searchedApis.find(a => a.id === api.id);
                    if (find !== undefined)
                        this.apis.unshift(find);
                }
            }
        });
    }
}
__decorate([
    observable
], Apps.prototype, "apis", void 0);
__decorate([
    observable
], Apps.prototype, "searchedApis", void 0);
class Apis extends ObjItems {
    //@observable services: DevModel.Service[];
    _load() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield devApi.apis(this.store.unit.id);
            return ret;
        });
    }
    _save(item) {
        return __awaiter(this, void 0, void 0, function* () {
            let { access } = item;
            if (!access)
                access = "*";
            let parts = access.split(',').map(v => v.trim()).filter(v => v !== '');
            item.access = parts.join(',');
            return yield devApi.saveApi(item);
        });
    }
    _del(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield devApi.delApi(this.store.unit.id, item.id);
        });
    }
    _inc() { this.dev.counts.api++; }
    _dec() { this.dev.counts.api--; }
}
class Buses extends ObjItems {
    _load() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield devApi.buses(this.store.unit.id);
            return ret;
        });
    }
    _save(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.saveBus(item);
        });
    }
    _del(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield devApi.delBus(this.store.unit.id, item.id);
        });
    }
    _inc() { this.dev.counts.bus++; }
    _dec() { this.dev.counts.bus--; }
}
class Servers extends ObjItems {
    _load() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.servers(this.store.unit.id);
        });
    }
    _save(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.saveServer(item);
        });
    }
    _del(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield devApi.delServer(this.store.unit.id, item.id);
        });
    }
    _inc() { this.dev.counts.server++; }
    _dec() { this.dev.counts.server--; }
}
class Services extends ObjItems {
    _load() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.services(this.store.unit.id);
        });
    }
    _save(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.saveService(item);
        });
    }
    _del(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield devApi.delService(this.store.unit.id, item.id);
        });
    }
    _inc() { this.dev.counts.service++; }
    _dec() { this.dev.counts.service--; }
    changeProp(prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield devApi.changeServiceProp(this.store.unit.id, this.cur.id, prop, value);
            switch (prop) {
                case 'url':
                    this.cur.url = value;
                    break;
                case 'server':
                    this.cur.server = value;
                    break;
            }
        });
    }
    loadApiServices(api) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items = yield devApi.loadApiServices(this.store.unit.id, api);
        });
    }
    loadAppServices(app) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items = yield devApi.loadAppServices(this.store.unit.id, app);
            if (this.items.length > 0)
                this.cur = this.items[0];
        });
    }
}
const searchPageSize = 50;
class SearchItems {
    constructor(store, dev, search) {
        this.items = undefined;
        this.allLoaded = false;
        this.pageStart = 0;
        this.store = store;
        this.dev = dev;
        this.search = search;
    }
    first(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.key = key;
            this.items = undefined;
            this.allLoaded = false;
            this.pageStart = 0;
            yield this.more();
        });
    }
    more() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.allLoaded === true)
                return;
            let ret = yield this.search(this.store.unit.id, this.key, this.pageStart, searchPageSize);
            let len = ret.length;
            if (len > searchPageSize) {
                this.allLoaded = false;
                --len;
                ret.splice(len, 1);
            }
            else {
                this.allLoaded = true;
            }
            if (len > 0) {
                this.pageStart = ret[len - 1].id;
                if (this.items === undefined)
                    this.items = ret;
                else
                    this.items.push(...ret);
            }
            else {
                this.items = [];
            }
        });
    }
}
__decorate([
    observable
], SearchItems.prototype, "items", void 0);
export class Dev {
    constructor(store) {
        this.counts = undefined;
        this.apps = undefined;
        this.apis = undefined;
        this.buses = undefined;
        this.servers = undefined;
        this.services = undefined;
        this.searchApp = undefined;
        this.searchApi = undefined;
        this.searchServer = undefined;
        this.store = store;
        this.apps = new Apps(store, this);
        this.apis = new Apis(store, this);
        this.buses = new Buses(store, this);
        this.servers = new Servers(store, this);
        this.services = new Services(store, this);
        this.searchApp = new SearchItems(store, this, devApi.searchApp.bind(devApi));
        this.searchApi = new SearchItems(store, this, devApi.searchApi.bind(devApi));
        this.searchServer = new SearchItems(store, this, devApi.searchServer.bind(devApi));
    }
    loadCounts() {
        return __awaiter(this, void 0, void 0, function* () {
            let unit = this.store.unit;
            this.counts = yield devApi.counts(unit.id);
        });
    }
}
__decorate([
    observable
], Dev.prototype, "counts", void 0);
//# sourceMappingURL=dev.js.map