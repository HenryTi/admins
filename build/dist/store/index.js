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
import _ from 'lodash';
import { appInFrame, host } from 'tonva';
import { mainApi, devApi } from '../api';
import { Admins } from './admins';
import { Dev } from './dev';
import { CacheUnits, CacheUqs, CacheApps, CacheServers } from './cacheIds';
export class Store {
    get unitId() { return appInFrame.unit; }
    ;
    init() {
        this.unit = undefined;
        this.admins = new Admins(this);
        this.dev = new Dev(this);
        this.cacheUnits = new CacheUnits();
        this.cacheUqs = new CacheUqs();
        this.cacheApps = new CacheApps();
        this.cacheServers = new CacheServers();
    }
    logout() {
        //meInFrame.app = undefined;
        appInFrame.hash = undefined;
        //let unitId = process.env.REACT_APP_DEBUG_UNITID;
        //if (unitId !== undefined)
        //    meInFrame.unit = Number(unitId);
        appInFrame.unit = undefined;
        this.init();
        this.memberCount = undefined;
        this.apps = undefined;
        this.role = undefined;
        this.roles = undefined;
        this.roleApps = undefined;
        this.roleMember = undefined;
        this.roleMembers = undefined;
        this.memberRoles = undefined;
    }
    setRole(role) {
        if (this.role === role)
            return;
        this.role = role;
        this.roleApps = undefined;
        this.roleMember = undefined;
        this.roleMembers = undefined;
        this.memberRoles = undefined;
    }
    setRoleUser(user) {
        if (this.roleMember === user)
            return;
        this.roleMember = user;
        this.memberRoles = undefined;
    }
    unitChangeProp(prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.unitChangeProp(this.unit.id, prop, value);
            this.unit[prop] = value;
        });
    }
    loadApps() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.apps !== undefined)
                return;
            this.apps = yield mainApi.unitApps(this.unitId);
        });
    }
    loadUnit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.unitId === undefined)
                return;
            let ret = yield mainApi.unit(this.unitId);
            this.unit = ret;
            console.log("loadUnit unit=%s", ret);
            this.memberCount = yield mainApi.unitMemberCount(this.unitId);
            let uqServer = yield devApi.uqBuilderUrl();
            let { url, urlDebug } = uqServer;
            this.uqServer = host.getUrlOrDebug(url, urlDebug);
            console.log("uq-build: %s", JSON.stringify(this.uqServer));
        });
    }
    stopUnitApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.unitDeleteApp(this.unit.id, appId, 1);
            let app = this.apps.find(v => v.id === appId);
            app.inUnit = 0;
        });
    }
    restoreUnitApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.unitAddApp(this.unit.id, appId);
            if (ret <= 0)
                return ret;
            let app = this.apps.find(v => v.id === appId);
            app.inUnit = 1;
            return 1;
        });
    }
    addUnitApp(app) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.unitAddApp(this.unit.id, app.id);
            if (ret <= 0)
                return ret;
            this.apps.push(app);
            return 1;
        });
    }
    loadRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.roles !== undefined)
                return;
            let ret = yield mainApi.unitRoles(this.unit.id);
            ret.forEach(v => {
                switch (v.id) {
                    case 1:
                        v.name = '访客';
                        v.discription = '可以获取开放信息';
                        break;
                    case 2:
                        v.name = '普通';
                        v.discription = '能访问最基本的功能';
                        break;
                }
            });
            this.roles = ret;
        });
    }
    unitAddRole(name, discription) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = yield mainApi.unitAddRole(this.unit.id, name, discription);
            if (id > 0) {
                this.roles.push({
                    id: id,
                    name: name,
                    discription: discription,
                    count: undefined,
                });
            }
            return id;
        });
    }
    roleChangeProp(prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.unitRoleChangeProp(this.unit.id, this.role.id, prop, value);
            this.role[prop] = value;
        });
    }
    loadRoleApps() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.unitRoleApps(this.unit.id, this.role.id);
            this.roleApps = ret.map(v => {
                return this.apps.find(app => app.id === v.id);
            });
        });
    }
    setRoleApps(apps) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.unitRoleSetApps(this.unit.id, this.role.id, apps.map(v => v.id));
            this.roleApps = apps;
        });
    }
    loadMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.unitMembers(this.unit.id, this.role === undefined ? 0 : this.role.id, undefined, 0, 100);
            this.roleMembers = ret;
        });
    }
    unitAssignMember(assigned) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.unitAssignMember(this.unit.id, this.roleMember.id, assigned);
            this.roleMember.assigned = assigned;
        });
    }
    loadMemberRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.unitMemberRoles(this.unit.id, this.roleMember.id);
            let roles = ret.map(v => {
                let rId = v.id;
                let role = this.roles.find(r => r.id === rId);
                return _.clone(role);
            });
            this.memberRoles = roles;
        });
    }
    setMemberRoles(memberRoles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainApi.unitSetMemberRoles(this.unit.id, this.roleMember.id, memberRoles.map(v => v.id));
            this.roles.forEach(role => {
                let rId = role.id;
                let org = this.memberRoles.find(v => v.id === rId);
                let cur = memberRoles.find(v => v.id === rId);
                if (org !== undefined) {
                    if (cur !== undefined)
                        return;
                    role.count--;
                    return;
                }
                if (cur === undefined)
                    return;
                role.count++;
            });
            this.memberRoles = memberRoles;
        });
    }
}
__decorate([
    observable
], Store.prototype, "unit", void 0);
__decorate([
    observable
], Store.prototype, "memberCount", void 0);
__decorate([
    observable
], Store.prototype, "apps", void 0);
__decorate([
    observable
], Store.prototype, "role", void 0);
__decorate([
    observable
], Store.prototype, "roles", void 0);
__decorate([
    observable
], Store.prototype, "roleApps", void 0);
__decorate([
    observable
], Store.prototype, "roleMember", void 0);
__decorate([
    observable
], Store.prototype, "roleMembers", void 0);
__decorate([
    observable
], Store.prototype, "memberRoles", void 0);
;
export const store = new Store();
//# sourceMappingURL=index.js.map