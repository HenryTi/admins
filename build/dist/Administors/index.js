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
import { observer } from 'mobx-react';
import { nav, Page, Image } from 'tonva';
import { store } from '../store';
import NewFellow from './NewFellow';
import EditAdmin from './EditAdmin';
import { LMR, List } from 'tonva';
let AdministorsPage = class AdministorsPage extends React.Component {
    constructor() {
        super(...arguments);
        this.row = ({ icon, name, nick }) => {
            let content = nick ?
                React.createElement(React.Fragment, null,
                    React.createElement("b", null, nick),
                    " \u00A0 ",
                    React.createElement("small", { className: "text-muted" }, name))
                :
                    React.createElement("b", null, name);
            let left = React.createElement(Image, { className: "w-2-5c h-2-5c", src: icon });
            return React.createElement(LMR, { className: "py-2 px-3 align-items-stretch", left: left },
                React.createElement("div", { className: "px-3" }, content));
        };
        this.onNewOwner = (evt) => {
            this.newAdmin(evt, true, false);
        };
        this.onNewAdmin = (evt) => {
            this.newAdmin(evt, false, true);
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.admins.load();
        });
    }
    onNewFellow() {
        //nav.push(<NewFellow />);
    }
    onItemClick(ua) {
        store.admins.cur = ua;
        nav.push(React.createElement(EditAdmin, null));
    }
    newAdmin(evt, isOwner, isAdmin) {
        evt.preventDefault();
        nav.push(React.createElement(NewFellow, { isOwner: isOwner, isAdmin: isAdmin }));
    }
    render() {
        //let n = nav;
        //let me = n.local.user.get().id;
        let { unit } = store;
        if (unit === undefined)
            return;
        let { owners, admins, fellows } = store.admins;
        let right = React.createElement("button", { className: "btn btn-success btn-sm", onClick: this.onNewFellow }, "\u65B0\u589E\u6210\u5458");
        let showOwners = false, showAdmins = false;
        let ownersView, adminsView, fellowsView;
        if (unit.isRoot === 1) {
            showOwners = true;
            showAdmins = true;
        }
        if (unit.isOwner === 1)
            showAdmins = true;
        if (showOwners === true) {
            let header = React.createElement(LMR, { className: "px-3 py-1 small", left: "\u9AD8\u7BA1", right: React.createElement("a", { className: "small", href: '#', onClick: this.onNewOwner }, "\u65B0\u589E") });
            ownersView = React.createElement(List, { className: "my-4", header: header, items: owners, none: "[\u65E0]", item: { onClick: this.onItemClick, render: this.row } });
        }
        if (showAdmins === true) {
            let header = React.createElement(LMR, { className: "px-3 py-1 small", left: "\u7BA1\u7406\u5458", right: React.createElement("a", { className: "small", href: '#', onClick: this.onNewAdmin }, "\u65B0\u589E") });
            adminsView = React.createElement(List, { className: 'my-4', header: header, items: admins, none: '[\u65E0]', item: { onClick: this.onItemClick, render: this.row } });
        }
        return React.createElement(Page, { header: "\u7BA1\u7406\u5458", right: right },
            ownersView,
            adminsView,
            React.createElement("div", { className: "my-4 p-3" },
                React.createElement("div", { className: "ml-2 mb-2" }, "\u8BF4\u660E"),
                React.createElement("div", { className: "" },
                    React.createElement("ul", { className: "pl-2" },
                        React.createElement("li", { className: "card-text" }, "\u7BA1\u7406\u7EC4\u5305\u62EC\u4E3B\u4EBA\u3001\u9AD8\u7BA1\u3001\u7BA1\u7406\u5458"),
                        React.createElement("li", { className: "card-text" }, "\u5C0F\u53F7\u4E3B\u4EBA\u53EF\u4EE5\u589E\u51CF\u9AD8\u7BA1"),
                        React.createElement("li", { className: "card-text" }, "\u9AD8\u7BA1\u53EF\u4EE5\u589E\u51CF\u7BA1\u7406\u5458"),
                        React.createElement("li", { className: "card-text" }, "\u7BA1\u7406\u5458\u53EF\u4EE5\u7BA1\u7406\u5C0F\u53F7\uFF0C\u7A0B\u5E8F\u7684\u5F00\u53D1\uFF0C\u4EE5\u53CA\u7528\u6237"),
                        React.createElement("li", { className: "card-text" }, "\u5F00\u53D1\u53F7\u9AD8\u7BA1\u53EF\u4EE5\u589E\u51CF\u7F16\u8F91APP\uFF0CUQ\uFF0CServer\uFF0CService"),
                        React.createElement("li", { className: "card-text" }, "\u5F00\u53D1\u53F7\u7BA1\u7406\u5458\u53EF\u4EE5\u7F16\u8BD1\u6307\u5B9AUQ\uFF0CBUS")))));
    }
};
AdministorsPage = __decorate([
    observer
], AdministorsPage);
export default AdministorsPage;
//# sourceMappingURL=index.js.map