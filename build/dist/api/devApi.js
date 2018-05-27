var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CenterApi } from 'tonva-tools';
class DevApi extends CenterApi {
    usqlServer() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.get('usql-server', undefined);
            return ret;
        });
    }
    counts(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('counts', { unit: unit });
        });
    }
    app(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('app', { id: id });
        });
    }
    api(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('api', { id: id });
        });
    }
    server(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('server', { id: id });
        });
    }
    usqldb(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('usqldb', { id: id });
        });
    }
    apps(unit, pageSize = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('apps', { unit: unit, pageSize: pageSize });
        });
    }
    apis(unit, pageSize = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('apis', { unit: unit, pageSize: pageSize });
        });
    }
    buses(unit, pageSize = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('buses', { unit: unit, pageSize: pageSize });
        });
    }
    servers(unit, pageSize = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('servers', { unit: unit, pageSize: pageSize });
        });
    }
    usqldbs(unit, pageSize = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('usqldbs', { unit: unit, pageSize: pageSize });
        });
    }
    services(unit, pageSize = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('services', { unit: unit, pageSize: pageSize });
        });
    }
    saveApp(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('app-save', values);
        });
    }
    saveApi(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('api-save', values);
        });
    }
    saveBus(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('bus-save', values);
        });
    }
    saveServer(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('server-save', values);
        });
    }
    saveUsqldb(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('usqldb-save', values);
        });
    }
    saveService(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('service-save', values);
        });
    }
    delApp(unit, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('app-del', { unit: unit, id: id });
        });
    }
    delApi(unit, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('api-del', { unit: unit, id: id });
        });
    }
    delBus(unit, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('bus-del', { unit: unit, id: id });
        });
    }
    delServer(unit, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('server-del', { unit: unit, id: id });
        });
    }
    delUsqldb(unit, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('usqldb-del', { unit: unit, id: id });
        });
    }
    delService(unit, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('service-del', { unit: unit, id: id });
        });
    }
    loadAppApis(app) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('app-apis', { app: app });
        });
    }
    appBindApi(unit, app, apis) {
        return __awaiter(this, void 0, void 0, function* () {
            let apisText;
            if (apis !== undefined) {
                apisText = apis.map(v => String(v.id) + '|' + v.access.join(',')).join(';');
            }
            yield this.post('app-bind-api', { unit: unit, app: app, apis: apisText });
        });
    }
    searchApi(unit, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('api-search', { unit: unit, key: key, pageStart: pageStart, pageSize: pageSize });
        });
    }
    searchApp(unit, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('app-search', { unit: unit, key: key, pageStart: pageStart, pageSize: pageSize });
        });
    }
    searchServer(unit, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('server-search', { unit: unit, key: key, pageStart: pageStart, pageSize: pageSize });
        });
    }
    searchUsqldb(unit, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('usqldb-search', { unit: unit, key: key, pageStart: pageStart, pageSize: pageSize });
        });
    }
    loadAppServices(unit, app) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('app-services', { unit: unit, app: app });
        });
    }
    loadApiServices(unit, api) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('api-services', { unit: unit, api: api });
        });
    }
    changeServiceProp(unit, service, prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('service-change-prop', { unit: unit, service: service, prop: prop, value: value });
        });
    }
}
export const devApi = new DevApi('tv/dev/');
//# sourceMappingURL=devApi.js.map