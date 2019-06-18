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
import { observable } from 'mobx';
import { Controller, Page } from "tonva-tools";
import { mainApi } from 'api';
import { LMR, FA } from 'tonva-react-form';
import { VApps } from './vApps';
import { VUsers } from './vUsers';
import { VApp } from './vApp';
import { VUser } from './vUser';
import { VAppEditUsers } from './vAppEditUsers';
import { VUserEditApps } from './vUserEditApps';
import { VAddUser } from './VAddUser';
export class UsersController extends Controller {
    constructor() {
        super(...arguments);
        this.onAppUsers = () => __awaiter(this, void 0, void 0, function* () {
            yield this.loadAppUsers(undefined);
            this.openVPage(VApps);
        });
        this.onUserApps = () => __awaiter(this, void 0, void 0, function* () {
            yield this.loadUserApps(undefined);
            this.openVPage(VUsers);
        });
        this.searchUser = (key) => __awaiter(this, void 0, void 0, function* () {
            yield this.loadUserApps(key);
        });
        this.searchApp = (key) => __awaiter(this, void 0, void 0, function* () {
            yield this.loadAppUsers(key);
        });
        this.onAppsClick = (appUsers) => __awaiter(this, void 0, void 0, function* () {
            this.curApp = appUsers.app;
            let pageStart = 0;
            let pageSize = 100;
            this.curAppUsers = yield mainApi.unitOneAppUsers(this.unit.id, this.curApp.id, pageStart, pageSize);
            this.openVPage(VApp);
        });
        this.onUsersClick = (userApps) => __awaiter(this, void 0, void 0, function* () {
            this.curUser = userApps.user;
            let pageStart = 0;
            let pageSize = 100;
            this.curUserApps = yield mainApi.unitOneUserApps(this.unit.id, this.curUser.id, pageStart, pageSize);
            this.openVPage(VUser);
        });
        this.onAppEditUsers = (key) => __awaiter(this, void 0, void 0, function* () {
            let pageStart = 0;
            let pageSize = 100;
            this.appEditUsers = yield mainApi.unitAppEditUsers(this.unit.id, this.curApp.id, key, pageStart, pageSize);
            this.openVPage(VAppEditUsers);
        });
        this.onAddUser = () => {
            this.openVPage(VAddUser);
        };
        this.onUserEditApps = (key) => __awaiter(this, void 0, void 0, function* () {
            let pageStart = 0;
            let pageSize = 100;
            this.userEditApps = yield mainApi.unitUserEditApps(this.unit.id, this.curUser.id, key, pageStart, pageSize);
            this.openVPage(VUserEditApps);
        });
        this.bindAppUser = (user, checked) => __awaiter(this, void 0, void 0, function* () {
            yield mainApi.bindAppUser(this.unit.id, this.curApp.id, user.id, checked === true ? 1 : 0);
            let appUsers = this.appUsersList.find(v => v.app.id === this.curApp.id);
            if (checked === true) {
                this.curAppUsers.push(user);
                if (appUsers)
                    appUsers.users.push(user);
            }
            else {
                let index = this.curAppUsers.findIndex(v => v.id === user.id);
                if (index >= 0)
                    this.curAppUsers.splice(index, 1);
                if (appUsers) {
                    index = appUsers.users.findIndex(v => v.id === user.id);
                    if (index >= 0)
                        appUsers.users.splice(index, 1);
                }
            }
        });
        this.bindUserApp = (app, checked) => __awaiter(this, void 0, void 0, function* () {
            yield mainApi.bindAppUser(this.unit.id, app.id, this.curUser.id, checked === true ? 1 : 0);
            if (this.userAppsList === undefined)
                return;
            let userApps = this.userAppsList.find(v => v.user.id === this.curUser.id);
            if (checked === true) {
                this.curUserApps.push(app);
                if (userApps)
                    userApps.apps.push(app);
            }
            else {
                let index = this.curUserApps.findIndex(v => v.id === app.id);
                if (index >= 0)
                    this.curUserApps.splice(index, 1);
                if (userApps) {
                    index = userApps.apps.findIndex(v => v.id === app.id);
                    if (index >= 0)
                        userApps.apps.splice(index, 1);
                }
            }
        });
        this.addUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            yield mainApi.unitAddUser(this.unit.id, userId);
        });
    }
    internalStart(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.unit = unit;
            let cn = "bg-white px-3 py-2 my-1";
            let appIcon = React.createElement(FA, { name: "columns", className: "text-primary mr-3" });
            let userIcon = React.createElement(FA, { name: "user-plus", className: "text-primary mr-3" });
            let right = React.createElement("button", { className: "btn btn-sm btn-success", onClick: this.onAddUser },
                React.createElement(FA, { name: "plus" }));
            this.openPage(React.createElement(Page, { header: '用户管理 - ' + this.unit.name, right: right },
                React.createElement(LMR, { className: cn, onClick: this.onAppUsers, left: appIcon }, "App"),
                React.createElement(LMR, { className: cn, onClick: this.onUserApps, left: userIcon }, "\u7528\u6237")));
        });
    }
    loadAppUsers(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = [];
            let pageStart = 0;
            let pageSize = 100;
            let ret = yield mainApi.unitAppUsers(this.unit.id, key, pageStart, pageSize);
            let apps = ret[0];
            let users = ret[1];
            let coll = {};
            for (let a of apps) {
                let app = {
                    id: a.id,
                    name: a.name,
                    discription: a.discription,
                };
                list.push(coll[a.id] = { app: app, users: [] });
            }
            for (let u of users) {
                let user = {
                    id: u.user,
                    name: u.name,
                    nick: u.nick,
                    icon: u.icon,
                    assigned: u.assigned
                };
                coll[u.app].users.push(user);
            }
            this.appUsersList = list;
        });
    }
    loadUserApps(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = [];
            let pageStart = 0;
            let pageSize = 100;
            let ret = yield mainApi.unitUsers(this.unit.id, key, pageStart, pageSize);
            let users = ret[0];
            let apps = ret[1];
            let coll = {};
            for (let u of users) {
                let user = {
                    id: u.id,
                    name: u.name,
                    nick: u.nick,
                    icon: u.icon,
                    assigned: u.assigned
                };
                list.push(coll[u.id] = { user: user, apps: [] });
            }
            for (let a of apps) {
                let app = {
                    id: a.app,
                    name: a.name,
                    discription: a.discription,
                };
                coll[a.user].apps.push(app);
            }
            this.userAppsList = list;
        });
    }
}
__decorate([
    observable
], UsersController.prototype, "userAppsList", void 0);
__decorate([
    observable
], UsersController.prototype, "appUsersList", void 0);
__decorate([
    observable
], UsersController.prototype, "curUserApps", void 0);
__decorate([
    observable
], UsersController.prototype, "userEditApps", void 0);
__decorate([
    observable
], UsersController.prototype, "curAppUsers", void 0);
__decorate([
    observable
], UsersController.prototype, "appEditUsers", void 0);
//# sourceMappingURL=cUsers.js.map