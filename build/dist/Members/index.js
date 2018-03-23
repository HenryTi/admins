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
import { Button } from 'reactstrap';
import { List, LMR, FA, Muted } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { store } from '../store';
import { NewRole } from './newRole';
import { RolePage } from './rolePage';
import { MembersPage } from './membersPage';
let Members = class Members extends React.Component {
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.loadRoles();
        });
    }
    renderRole(role, index) {
        let { name, discription, count } = role;
        return React.createElement(LMR, { className: "px-3 py-2", left: name, right: String(count || '') },
            React.createElement("div", null,
                React.createElement(Muted, null, discription)));
    }
    roleClick(role) {
        store.setRole(role);
        nav.push(React.createElement(RolePage, null));
    }
    newRole() {
        nav.push(React.createElement(NewRole, null));
    }
    allUsersClick() {
        store.setRole(undefined);
        nav.push(React.createElement(MembersPage, null));
    }
    render() {
        let right = React.createElement(Button, { color: 'secondary', size: 'sm', onClick: () => this.newRole() },
            React.createElement(FA, { name: "plus" }));
        return React.createElement(Page, { header: "用户角色", right: right },
            React.createElement(LMR, { className: "my-3 px-3 py-2 bg-white", left: '用户', right: String(store.memberCount), onClick: this.allUsersClick },
                React.createElement("div", null,
                    React.createElement(Muted, null, '为用户设置角色'))),
            React.createElement("div", { className: "px-3 py-1" },
                React.createElement("small", null,
                    React.createElement(FA, { name: "angle-double-right" }),
                    " \u89D2\u8272\u5217\u8868")),
            React.createElement(List, { items: store.roles, item: { render: this.renderRole, onClick: this.roleClick } }));
    }
};
Members = __decorate([
    observer
], Members);
export { Members };
//# sourceMappingURL=index.js.map