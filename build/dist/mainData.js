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
import mainApi from './mainApi';
class MainData {
    constructor() {
        this.unitAdmins = undefined;
    }
    get unitId() { return; }
    ;
    logout() {
        this.unit = undefined;
        this.unitAdmins = undefined;
    }
    loadApps() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.unit = yield mainApi.apps(this.unitId);
        });
    }
    getAppApi(appId, apiName) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
            /*
            let apps = this.unit.apps;
            if (apps === undefined) return;
            let app = apps.find(v => v.id === appId);
            if (app === undefined) return;
            let apis = app.apis;
            if (apis === undefined) {
                apis = app.apis = {};
            }
            let api:Api = apis[apiName];
            if (api === null) return;
            if (api === undefined) {
                api = await mainApi.appApi(this.unitId, appId, apiName);
                if (api === undefined) {
                    api = null;
                    apis[apiName] = api;
                    return;
                }
            }
            return api;*/
        });
    }
    loadUnit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.unit = yield mainApi.unit(this.unitId);
        });
    }
    loadUnitAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            this.unitAdmins = yield mainApi.unitAdmins(this.unitId);
        });
    }
}
__decorate([
    observable
], MainData.prototype, "unit", void 0);
__decorate([
    observable
], MainData.prototype, "unitAdmins", void 0);
;
export const mainData = new MainData();
//# sourceMappingURL=mainData.js.map