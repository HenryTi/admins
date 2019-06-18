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
import * as React from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { nav, Controller } from 'tonva-tools';
import { UqUpload } from './uqUpload';
import { devApi } from 'api';
import { NewServicePage } from './newServicePage';
import { ServicePage } from './servicePage';
import { UQPage } from './uqPage';
import { ListPage } from './listPage';
export class UQController extends Controller {
    constructor() {
        super(...arguments);
        this.listRowClick = (item) => __awaiter(this, void 0, void 0, function* () {
            this.uq = item;
            yield this.loadUqEntities(item.id);
            this.openVPage(UQPage);
        });
        this.serviceClick = (service) => {
            this.openVPage(ServicePage, service);
        };
        this.onUqUpload = () => __awaiter(this, void 0, void 0, function* () {
            let onDispose = () => {
            };
            nav.push(React.createElement(UqUpload, { uq: this.uq, services: this.services }), onDispose);
        });
        this.saveUq = (values) => __awaiter(this, void 0, void 0, function* () {
            let uq;
            if (this.uq === undefined) {
                uq = _.clone(values);
            }
            else {
                uq = _.clone(this.uq);
                _.merge(uq, values);
            }
            uq.unit = this.unitId;
            let ret = yield devApi.saveUq(uq);
            uq.id = ret;
            this.uqList.push(uq);
        });
        this.deleteUq = () => __awaiter(this, void 0, void 0, function* () {
            yield devApi.delUq(this.unitId, this.uq.id);
            let index = this.uqList.findIndex(v => v.id === this.uq.id);
            if (index >= 0)
                this.uqList.splice(index);
        });
        this.showNewServicePage = () => __awaiter(this, void 0, void 0, function* () {
            yield this.openVPage(NewServicePage);
        });
    }
    internalStart(unitId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.unitId = unitId;
            this.uqList = yield devApi.uqs(this.unitId);
            this.openVPage(ListPage);
        });
    }
    loadUqEntities(uqId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield devApi.uqGetEntities(this.unitId, uqId);
            let r0 = ret[0][0];
            this.access = r0.access;
            this.entities = r0.entities;
            this.services = ret[1];
        });
    }
    changeServiceProp(service, prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devApi.changeServiceProp(this.unitId, service.id, prop, value);
        });
    }
    saveService(service) {
        return __awaiter(this, void 0, void 0, function* () {
            let svc = _.clone(service);
            svc.unit = this.unitId;
            let ret = yield devApi.saveService(svc);
            svc.id = ret;
            this.services.push(svc);
            return ret;
        });
    }
    delService(service) {
        return __awaiter(this, void 0, void 0, function* () {
            yield devApi.delService(this.unitId, service.id);
            let index = this.services.findIndex(v => v.id == service.id);
            if (index >= 0)
                this.services.splice(index);
        });
    }
}
__decorate([
    observable
], UQController.prototype, "uqList", void 0);
__decorate([
    observable
], UQController.prototype, "services", void 0);
//# sourceMappingURL=index.js.map