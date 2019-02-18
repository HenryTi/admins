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
import { VPage, Page } from "tonva-tools";
import { List, FA, SearchBox } from 'tonva-react-form';
import { observable } from 'mobx';
import { QueryPageItems } from 'tonva-react-uq';
export class PageUsers extends QueryPageItems {
    setPageStart(item) {
        this.pageStart = item === undefined ? 0 : item.id;
    }
}
export class VFullFunction extends VPage {
    constructor() {
        super(...arguments);
        this.users = [];
        this.onStopFully = (item) => __awaiter(this, void 0, void 0, function* () {
            this.openPageElement(React.createElement(Page, { header: '停止全功能' },
                React.createElement("div", { className: "p-3" },
                    React.createElement("div", null,
                        React.createElement("b", { className: "text-danger h4" }, item.user.content()),
                        " \u505C\u6B62\u5168\u529F\u80FD\u7528\u6237\u3002",
                        React.createElement("br", null),
                        "\u8BF7\u786E\u8BA4\u3002"),
                    React.createElement("div", { className: "p-3" },
                        React.createElement("button", { className: "btn btn-success", onClick: () => this.onSumitStopFully(item) }, "\u505C\u6B62\u5168\u529F\u80FD"),
                        React.createElement("button", { className: "ml-3 btn btn-outline-danger", onClick: this.onCancelStop }, "\u4E0D\u505C")))));
        });
        this.onSumitStopFully = (item) => __awaiter(this, void 0, void 0, function* () {
            let data = { _uq: this.uq.id, arr1: [{ _user: item.user.id }] };
            yield this.entityOpUserFully.entity.actions.del.submit(data);
            let index = this.users.findIndex(v => v === item);
            if (index >= 0)
                this.users.splice(index, 1);
            this.closePage();
        });
        this.onCancelStop = () => this.closePage();
        this.addClick = () => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.controller.callSearchUser(this.uq);
            this.onUserSelected(user);
            /*
            let searchUser = this.controller.cUq.cFromName('query', 'SearchUser') as CQuery;
            this.pageUsers = new PageUsers(searchUser.entity);
            this.openPage(this.usersView);
            */
        });
        this.renderUser = (item, index) => {
            return React.createElement("div", { className: "px-3 py-2" }, item.user.content());
        };
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
            yield this.pageUsers.first({ key: key });
        });
        this.onSetFully = (item) => __awaiter(this, void 0, void 0, function* () {
            yield this.entityOpUserFully.entity.actions.add.submit({ _uq: this.uq.id, arr1: [{ _user: item.id }] });
            this.tuidUser.entity.useId(item.id);
            let row = {
                uq: this.uq.id,
                user: this.tuidUser.entity.boxId(item.id),
            };
            this.users.push(row);
            this.closePage(2);
        });
        this.onCancelFully = () => { this.backPage(); };
        this.onUserSelected = (item) => {
            this.openPageElement(React.createElement(Page, { header: "\u786E\u8BA4" },
                React.createElement("div", { className: "p-3" },
                    React.createElement("div", null,
                        React.createElement("b", { className: "text-danger h4" }, item.name),
                        " \u5C06\u8BBE\u7F6E\u4E3A\u5168\u529F\u80FD\u7528\u6237\u3002\u53EA\u6709\u7CFB\u7EDF\u7BA1\u7406\u5458\u6216\u8005\u6D4B\u8BD5\u4EBA\u5458\u624D\u9700\u8981\u5168\u529F\u80FD\uFF0C\u53EF\u4EE5\u64CD\u4F5C\u6240\u6709\u6570\u636E\u3002",
                        React.createElement("br", null),
                        "\u8BF7\u786E\u8BA4\u3002"),
                    React.createElement("div", { className: "p-3" },
                        React.createElement("button", { className: "btn btn-success", onClick: () => this.onSetFully(item) }, "\u8BBE\u7F6E\u4E3A\u5168\u529F\u80FD\u7528\u6237"),
                        React.createElement("button", { className: "ml-3 btn btn-outline-danger", onClick: this.onCancelFully }, "\u53D6\u6D88")))));
        };
        this.renderSelectUser = (item, index) => {
            return React.createElement("div", { className: "px-3 py-2" }, JSON.stringify(item));
        };
        this.usersView = () => {
            let search = React.createElement(SearchBox, { className: "w-100", onSearch: this.onSearch, placeholder: "\u9009\u62E9\u7528\u6237" });
            return React.createElement(Page, { header: search },
                React.createElement(List, { before: "\u641C\u7D22\u7528\u6237\u540D", items: this.pageUsers, item: { render: this.renderSelectUser, onClick: this.onUserSelected } }));
        };
    }
    open(uq) {
        return __awaiter(this, void 0, void 0, function* () {
            this.uq = uq;
            this.entityOpUserFully = this.controller.cUq.cFromName('map', 'entityOpUserFully');
            this.tuidUser = this.controller.cUq.cFromName('tuid', 'user');
            yield this.entityOpUserFully.entity.loadSchema();
            let all = yield this.entityOpUserFully.entity.queries.all.query({ _uq: this.uq.id });
            let right = React.createElement("button", { className: "btn btn-sm btn-success", onClick: this.addClick },
                React.createElement(FA, { name: "plus" }));
            this.users.push(...all.ret);
            this.openPageElement(React.createElement(Page, { header: '全功能用户', right: right },
                React.createElement(List, { items: this.users, item: { render: this.renderUser, onClick: this.onStopFully } })));
            return;
        });
    }
}
__decorate([
    observable
], VFullFunction.prototype, "users", void 0);
//# sourceMappingURL=vFullFunction.js.map