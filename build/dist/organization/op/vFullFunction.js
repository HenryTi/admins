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
import { VPage, Page, PageItems } from "tonva-tools";
import { List, FA } from 'tonva-react-form';
import { observable } from 'mobx';
export class PageUsers extends PageItems {
    constructor(query) {
        super();
        this.query = query;
    }
    get items() {
        throw new Error();
        return super.items;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            debugger;
            yield this.query.loadSchema();
            let ret;
            if (this.query.isPaged === true)
                ret = yield this.query.page(this.param, this.pageStart, this.pageSize);
            else {
                let data = yield this.query.query(this.param);
                //let data = await this.query.unpackReturns(res);
                ret = data[this.query.returns[0].name];
            }
            debugger;
            return ret;
        });
    }
    setPageStart(item) {
        this.pageStart = item === undefined ? 0 : item.id;
    }
}
export class VFullFunction extends VPage {
    constructor() {
        super(...arguments);
        this.users = [];
        this.addClick = () => __awaiter(this, void 0, void 0, function* () {
            let searchUser = this.controller.cUsq.cFromName('query', 'SearchUser');
            let pageUsers = new PageUsers(searchUser.entity);
            yield pageUsers.first({ key: 'h' });
            this.openPage(this.usersView, pageUsers);
            let s = null;
        });
        this.renderUser = (item, index) => {
            return React.createElement("div", null, JSON.stringify(item));
        };
        this.usersView = (pageUsers) => {
            let i = pageUsers.items;
            let { items, loading } = pageUsers;
            return React.createElement(Page, { header: "\u9009\u62E9\u7528\u6237" },
                loading ? 'loading' : 'loaded',
                JSON.stringify(items),
                React.createElement(List, { items: pageUsers, item: { render: this.renderUser } }));
        };
    }
    showEntry(usq) {
        return __awaiter(this, void 0, void 0, function* () {
            this.usq = usq;
            this.entityOpUserFully = this.controller.cUsq.cFromName('map', 'entityOpUserFully');
            yield this.entityOpUserFully.entity.loadSchema();
            let all = yield this.entityOpUserFully.entity.queries.all.query({ _usq: this.usq.id });
            let right = React.createElement("button", { className: "btn btn-sm btn-success", onClick: this.addClick },
                React.createElement(FA, { name: "plus" }));
            this.users.push(...all.ret);
            this.openPageElement(React.createElement(Page, { header: '全功能用户', right: right },
                React.createElement(List, { items: this.users, item: { render: this.renderUser } })));
            return;
        });
    }
}
__decorate([
    observable
], VFullFunction.prototype, "users", void 0);
//# sourceMappingURL=vFullFunction.js.map