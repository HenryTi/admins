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
import { VPage, Page, Image } from 'tonva';
import { SearchBox } from 'tonva';
import { mainApi } from 'api';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
export class VAddUser extends VPage {
    constructor() {
        super(...arguments);
        this.user = null;
        this.page = observer(() => {
            let searchBox = React.createElement(SearchBox, { ref: v => this.searchBox = v, className: "w-100", onSearch: this.onSearch, onFocus: this.onSearchFocus, placeholder: "\u7528\u6237\u5168\u540D/\u624B\u673A\u53F7/\u90AE\u7BB1" });
            let content;
            if (this.user === null) {
            }
            else if (this.user === undefined) {
                content = React.createElement("div", { className: "text-info p-3" }, "\u6CA1\u6709\u627E\u5230\u7528\u6237");
            }
            else {
                let { name, nick, icon } = this.user;
                let divUser;
                if (nick) {
                    divUser = React.createElement(React.Fragment, null,
                        React.createElement("div", null,
                            React.createElement("b", null, nick)),
                        React.createElement("div", null, name));
                }
                else {
                    divUser = React.createElement("div", null,
                        React.createElement("b", null, name));
                }
                content = React.createElement("div", null,
                    React.createElement("div", { className: "m-3 p-3 d-flex bg-white" },
                        React.createElement(Image, { src: icon }),
                        React.createElement("div", { className: "ml-3" }, divUser)),
                    React.createElement("div", { className: "d-flex justify-content-center" },
                        React.createElement("button", { className: "btn btn-success text-center", onClick: this.onAddUser }, "\u589E\u52A0\u7528\u6237")));
            }
            /*
            let divUserAdded:any;
            if (this.addedUser) {
                divUserAdded = <div className="p-3">
                    <div>
                        新增用户: {this.addedUser.name} &nbsp; &nbsp;
                        <button className="btn btn-success"
                            onClick={()=>this.controller.onUserEditApps()}>
                            为用户添加App
                        </button>
                    </div>
                </div>
            }
            */
            return React.createElement(Page, { header: searchBox }, content);
        });
        //{divUserAdded}
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
            this.user = yield mainApi.userFromKey(key);
        });
        this.onAddUser = () => __awaiter(this, void 0, void 0, function* () {
            yield this.controller.addUser(this.user.id);
            this.controller.curUser = this.user;
            this.user = null;
            this.searchBox.clear();
            this.replacePage(this.addedPage);
        });
        this.onSearchFocus = () => {
            this.user = null;
            //this.addedUser = null;
            if (this.searchBox)
                this.searchBox.clear();
        };
        this.onAddApps = () => {
            this.closePage();
            this.controller.onUserEditApps();
        };
        this.onContinueAddUser = () => {
            this.closePage();
            this.controller.onAddUser();
        };
        this.addedPage = () => {
            return React.createElement(Page, { header: "\u6DFB\u52A0\u6210\u529F" },
                React.createElement("div", { className: "p-3 text-center" },
                    React.createElement("div", null,
                        "\u65B0\u589E\u7528\u6237: ",
                        this.controller.curUser.name),
                    React.createElement("div", { className: "mt-3" },
                        React.createElement("button", { className: "btn btn-success mr-3", onClick: this.onAddApps }, "\u4E3A\u7528\u6237\u6DFB\u52A0App"),
                        React.createElement("button", { className: "btn btn-outline-primary", onClick: this.onContinueAddUser }, "\u7EE7\u7EED\u6DFB\u52A0\u65B0\u7528\u6237"))));
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
__decorate([
    observable
], VAddUser.prototype, "user", void 0);
//# sourceMappingURL=VAddUser.js.map