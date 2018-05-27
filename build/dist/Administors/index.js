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
import { Card, CardHeader, CardBody, CardText, Button } from 'reactstrap';
import { nav, Page } from 'tonva-tools';
import consts from '../consts';
import { store } from '../store';
import NewFellow from './NewFellow';
import EditAdmin from './EditAdmin';
import { LMR, Badge, List } from 'tonva-react-form';
export class Row extends React.Component {
    render() {
        let { icon, main, vice } = this.props;
        return React.createElement(LMR, { className: "py-1 px-2 align-items-stretch", left: React.createElement(Badge, { size: "sm" },
                React.createElement("img", { src: icon })) },
            React.createElement("b", null, main),
            React.createElement("small", null, vice));
    }
}
let AdministorsPage = class AdministorsPage extends React.Component {
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
    row(item) {
        return React.createElement(Row, { icon: item.icon || consts.appItemIcon, main: item.name, vice: item.nick });
    }
    onNewAdmin(isOwner, isAdmin) {
        nav.push(React.createElement(NewFellow, { isOwner: isOwner, isAdmin: isAdmin }));
    }
    render() {
        //let n = nav;
        //let me = n.local.user.get().id;
        let { unit } = store;
        if (unit === undefined)
            return;
        let { owners, admins, fellows } = store.admins;
        let right = React.createElement(Button, { color: "success", size: "sm", onClick: this.onNewFellow }, "\u65B0\u589E\u6210\u5458");
        let showOwners = false, showAdmins = false;
        let ownersView, adminsView, fellowsView;
        if (unit.isRoot === 1) {
            showOwners = true;
            showAdmins = true;
        }
        if (unit.isOwner === 1)
            showAdmins = true;
        if (showOwners === true) {
            let header = React.createElement(LMR, { left: "\u9AD8\u7BA1", right: React.createElement("a", { className: "small", href: '#', onClick: (e) => { e.preventDefault(); this.onNewAdmin(true, false); } }, "\u65B0\u589E") });
            ownersView = React.createElement(List, { className: "my-4", header: header, items: owners, none: "[ \u65E0\u9AD8\u7BA1 ]", item: { onClick: this.onItemClick, render: this.row } });
        }
        if (showAdmins === true) {
            let header = React.createElement(LMR, { left: "\u7BA1\u7406\u5458", right: React.createElement("a", { className: "small", href: '#', onClick: (e) => { e.preventDefault(); this.onNewAdmin(false, true); } }, "\u65B0\u589E") });
            adminsView = React.createElement(List, { className: 'my-4', header: header, items: admins, none: '[ \u65E0\u7BA1\u7406\u5458 ]', item: { onClick: this.onItemClick, render: this.row } });
        }
        /*
        fellowsView = <List
            className='my-4'
            header='成员' items={fellows}
            none='[ 无普通成员 ]'
            item={{onClick: this.onItemClick, render: this.row}}
        />*/
        return React.createElement(Page, { header: "管理员", right: right },
            ownersView,
            adminsView,
            React.createElement(Card, { className: 'mx-1 my-4' },
                React.createElement(CardHeader, null, "\u8BF4\u660E"),
                React.createElement(CardBody, null,
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement(CardText, null, "\u7BA1\u7406\u7EC4\u5305\u62EC\u4E3B\u4EBA\u3001\u9AD8\u7BA1\u3001\u7BA1\u7406\u5458")),
                        React.createElement("li", null,
                            React.createElement(CardText, null, "\u5C0F\u53F7\u4E3B\u4EBA\u53EF\u4EE5\u589E\u51CF\u9AD8\u7BA1")),
                        React.createElement("li", null,
                            React.createElement(CardText, null, "\u9AD8\u7BA1\u53EF\u4EE5\u589E\u51CF\u7BA1\u7406\u5458")),
                        React.createElement("li", null,
                            React.createElement(CardText, null, "\u7BA1\u7406\u5458\u53EF\u4EE5\u7BA1\u7406\u5C0F\u53F7\uFF0C\u7A0B\u5E8F\u7684\u5F00\u53D1\uFF0C\u4EE5\u53CA\u7528\u6237"))))));
    }
};
AdministorsPage = __decorate([
    observer
], AdministorsPage);
export default AdministorsPage;
//# sourceMappingURL=index.js.map