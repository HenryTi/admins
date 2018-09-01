var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as _ from 'lodash';
export class UsqlApi {
    constructor(api, access) {
        this.api = api;
        this.access = access;
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('update', {});
        });
    }
    loadAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('access', { acc: this.access.join('|') });
        });
    }
    schema(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('schema/' + name, undefined);
        });
    }
    schemas(names) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.post('schema', names);
        });
    }
    tuidGet(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('tuid/' + name + '/' + id, {});
        });
    }
    tuidGetAll(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('tuid-all/' + name + '/', {});
        });
    }
    tuidSave(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.post('tuid/' + name, params);
        });
    }
    tuidSearch(name, arr, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.api.post('tuids/' + name, {
                arr: arr,
                key: key,
                pageStart: pageStart,
                pageSize: pageSize
            });
            return ret;
        });
    }
    tuidArrGet(name, arr, owner, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('tuid-arr/' + name + '/' + owner + '/' + arr + '/' + id, {});
        });
    }
    tuidArrGetAll(name, arr, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('tuid-arr-all/' + name + '/' + owner + '/' + arr + '/', {});
        });
    }
    tuidArrSave(name, arr, owner, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.post('tuid-arr/' + name + '/' + owner + '/' + arr + '/', params);
        });
    }
    tuidArrPos(name, arr, owner, id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.post('tuid-arr-pos/' + name + '/' + owner + '/' + arr + '/', {
                id: id,
                $order: order
            });
        });
    }
    tuidBindSlaveSave(name, slave, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.post('tuid-bindSlave/' + name + '/' + slave, params);
        });
    }
    tuidBindSlaves(name, slave, masterId, order, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.api.get('tuid-bindSlaves/' + name, {
                slave: slave,
                masterId: masterId,
                pageStart: order,
                pageSize: pageSize
            });
            return ret;
        });
    }
    tuidIds(name, arr, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = 'tuidids/' + name + '/';
                if (arr !== undefined)
                    url += arr;
                else
                    url += '$';
                let ret = yield this.api.post(url, ids);
                return ret;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    proxied(name, proxy, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = 'tuid-proxy/' + name + '/' + proxy + '/' + id;
                let ret = yield this.api.get(url, undefined);
                return ret;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    sheetSave(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.post('sheet/' + name, data);
        });
    }
    sheetAction(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.put('sheet/' + name, data);
        });
    }
    stateSheets(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.post('sheet/' + name + '/states', data);
        });
    }
    stateSheetCount(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('sheet/' + name + '/statecount', undefined);
        });
    }
    getSheet(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('sheet/' + name + '/get/' + id, undefined);
        });
    }
    sheetArchives(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.post('sheet/' + name + '/archives', data);
        });
    }
    sheetArchive(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('sheet/' + name + '/archive/' + id, undefined);
        });
    }
    action(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.post('action/' + name, data);
        });
    }
    queryPage(queryApi, name, pageStart, pageSize, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let p = _.clone(params || {});
            p['$pageStart'] = pageStart;
            p['$pageSize'] = pageSize;
            return yield this.api.post(queryApi + '/' + name, p);
        });
    }
    query(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.api.post('query/' + name, params);
            return ret;
        });
    }
    /*
        async history(name:string, pageStart:any, pageSize:number, params:any):Promise<string> {
            let p = _.clone(params);
            p['$pageStart'] = pageStart;
            p['$pageSize'] = pageSize;
            let ret = await this.post('history/' + name, p);
            return ret;
        }
    
        async book(name:string, pageStart:any, pageSize:number, params:any):Promise<string> {
            let p = _.clone(params);
            p['$pageStart'] = pageStart;
            p['$pageSize'] = pageSize;
            let ret = await this.post('history/' + name, p);
            return ret;
        }
    */
    user() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.api.get('user', undefined);
        });
    }
}
//# sourceMappingURL=usqlApi.js.map