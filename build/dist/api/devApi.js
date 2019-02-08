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
    uqServer() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.get('uq-server', undefined);
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
    uq(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('usq', { id: id });
        });
    }
    server(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('server', { id: id });
        });
    }
    uqdb(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('uqdb', { id: id });
        });
    }
    apps(unit, pageSize = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('apps', { unit: unit, pageSize: pageSize });
        });
    }
    uqs(unit, pageSize = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('uqs', { unit: unit, pageSize: pageSize });
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
    uqdbs(unit, pageSize = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('uqdbs', { unit: unit, pageSize: pageSize });
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
    saveUsq(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('usq-save', values);
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
    saveUqdb(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('uqdb-save', values);
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
    delUsq(unit, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('usq-del', { unit: unit, id: id });
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
    delUqdb(unit, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('uqdb-del', { unit: unit, id: id });
        });
    }
    delService(unit, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('service-del', { unit: unit, id: id });
        });
    }
    loadAppUqs(app) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('app-usqs', { app: app });
        });
    }
    appBindUq(unit, app, usqs) {
        return __awaiter(this, void 0, void 0, function* () {
            let usqsText;
            if (usqs !== undefined) {
                usqsText = usqs.map(v => String(v.id) + '|' + v.access.join(',')).join(';');
            }
            yield this.post('app-bind-usq', { unit: unit, app: app, usqs: usqsText });
        });
    }
    searchUsq(unit, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('usq-search', { unit: unit, key: key, pageStart: pageStart, pageSize: pageSize });
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
    searchUqdb(unit, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('uqdb-search', { unit: unit, key: key, pageStart: pageStart, pageSize: pageSize });
        });
    }
    loadAppServices(unit, app) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('app-services', { unit: unit, app: app });
        });
    }
    loadUqServices(unit, uq) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('uq-services', { unit: unit, uq: uq });
        });
    }
    changeServiceProp(unit, service, prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('service-change-prop', { unit: unit, service: service, prop: prop, value: value });
        });
    }
}
export const devApi = new DevApi('tv/dev/', undefined);
//# sourceMappingURL=devApi.js.map