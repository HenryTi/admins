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
import _ from 'lodash';
import { observable } from 'mobx';
import { Controller } from "tonva-tools";
import { devApi } from 'api';
import { AppsPage } from './appsPage';
import { AppPage } from './appPage';
import { UqBindPage } from './uqBindPage';
export class AppController extends Controller {
    constructor() {
        super(...arguments);
        this.listRowClick = (item) => __awaiter(this, void 0, void 0, function* () {
            this.app = item;
            let ret = yield devApi.loadAppUqs(item.id);
            this.uqAccesses = ret.map(v => {
                let { owner, access, id, name, discription, unit, date_init, date_update, bind_access } = v;
                return {
                    uq: {
                        id: id,
                        name: name,
                        discription: discription,
                        unit: unit,
                        access: access,
                        owner: owner,
                        date_init: date_init,
                        date_update: date_update,
                        service_count: undefined,
                    },
                    uqOwner: owner,
                    bind_access: bind_access && bind_access.split(',')
                };
            });
            this.openVPage(AppPage);
        });
        this.saveApp = (values) => __awaiter(this, void 0, void 0, function* () {
            let app;
            let now = new Date();
            if (this.app === undefined) {
                app = _.clone(values);
                app.date_init = now;
            }
            else {
                app = _.clone(this.app);
                _.merge(app, values);
            }
            app.unit = this.unitId;
            app.date_update = now;
            let ret = yield devApi.saveApp(app);
            app.id = ret;
            let org = this.appList.find(v => v.id === ret);
            if (org !== undefined) {
                _.merge(org, app);
            }
            else {
                this.appList.push(app);
            }
        });
        this.deleteApp = () => __awaiter(this, void 0, void 0, function* () {
            yield devApi.delApp(this.unitId, this.app.id);
            let index = this.appList.findIndex(v => v.id === this.app.id);
            if (index >= 0)
                this.appList.splice(index, 1);
        });
        this.searchUq = (key, pageStart, pageSize) => __awaiter(this, void 0, void 0, function* () {
            return yield devApi.searchUq(this.unitId, key, pageStart, pageSize);
        });
        this.getMyUqs = () => __awaiter(this, void 0, void 0, function* () {
            return yield devApi.getMyUqs(this.unitId);
        });
        this.onUq = (uq) => {
            let uqAccess = this.uqAccesses.find(v => v.uq.id === uq.id);
            if (uqAccess === undefined) {
                uqAccess = {
                    uq: uq,
                    bind_access: undefined,
                };
            }
            else {
                let access = uqAccess.bind_access;
                if (access === null || access === undefined)
                    uqAccess.bind_access = [];
            }
            this.openVPage(UqBindPage, uqAccess);
        };
        this.saveUqBind = (uq, accesses) => __awaiter(this, void 0, void 0, function* () {
            let uqs = this.buildBindUqs(uq, accesses);
            yield devApi.appBindUq(this.unitId, this.app.id, uqs);
            if (uqs.length > this.uqAccesses.length) {
                this.uqAccesses.unshift({
                    uq: uq,
                    bind_access: accesses,
                });
            }
            else {
                let ua = this.uqAccesses.find(v => v.uq.id === uq.id);
                ua.bind_access = accesses;
            }
        });
        this.removeUqBind = (uq) => __awaiter(this, void 0, void 0, function* () {
            let uqs = this.buildBindUqs(uq);
            yield devApi.appBindUq(this.unitId, this.app.id, uqs);
            let index = this.uqAccesses.findIndex(v => v.uq.id === uq.id);
            if (index >= 0)
                this.uqAccesses.splice(index, 1);
        });
    }
    internalStart(unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.unitId = unitId;
            this.appList = yield devApi.apps(this.unitId);
            this.openVPage(AppsPage);
        });
    }
    // accesses = undefined, 表示删除
    buildBindUqs(uq, accesses) {
        let uqs = [];
        let isNew = true;
        for (let ua of this.uqAccesses) {
            let { uq: uaUq, bind_access } = ua;
            if (uaUq.id === uq.id) {
                if (accesses === undefined)
                    continue;
                bind_access = accesses;
                isNew = false;
            }
            uqs.push({
                id: uaUq.id,
                access: bind_access || [],
            });
        }
        if (accesses !== undefined && isNew === true) {
            uqs.push({ id: uq.id, access: accesses });
        }
        return uqs;
    }
}
__decorate([
    observable
], AppController.prototype, "appList", void 0);
__decorate([
    observable
], AppController.prototype, "uqAccesses", void 0);
//# sourceMappingURL=index.js.map