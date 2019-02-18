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
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { List, LMR } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { store } from '../store';
import { NewRole } from './newRole';
import { RolePage } from './rolePage';
import { MembersPage } from './membersPage';
const midClassName = classNames('d-flex', 'h-100', 'align-items-center', 'px-5', 'small', 'text-muted');
let Members = class Members extends React.Component {
    constructor() {
        super(...arguments);
        this.renderRole = (role, index) => {
            let { name, discription, count } = role;
            return React.createElement(LMR, { className: "px-3 py-2", left: name, right: String(count || '') },
                React.createElement("div", { className: midClassName }, discription));
        };
        this.roleClick = (role) => {
            store.setRole(role);
            nav.push(React.createElement(RolePage, null));
        };
        this.newRole = (evt) => {
            evt.preventDefault();
            nav.push(React.createElement(NewRole, null));
        };
        this.allUsersClick = () => {
            store.setRole(undefined);
            nav.push(React.createElement(MembersPage, null));
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.loadRoles();
        });
    }
    render() {
        let right = React.createElement("a", { className: "small", href: '#', onClick: this.newRole }, "\u65B0\u589E");
        let header = React.createElement(LMR, { className: "px-3 small bg-light", left: "\u89D2\u8272", right: right });
        return React.createElement(Page, { header: "\u7528\u6237\u89D2\u8272" },
            React.createElement(LMR, { className: "my-3 px-3 py-2 bg-white", left: '用户', right: String(store.memberCount), onClick: this.allUsersClick },
                React.createElement("div", { className: midClassName }, "\u8BBE\u7F6E\u7528\u6237\u89D2\u8272")),
            React.createElement(List, { header: header, items: store.roles, none: "[\u65E0]", item: { render: this.renderRole, onClick: this.roleClick } }));
    }
};
Members = __decorate([
    observer
], Members);
export { Members };
//# sourceMappingURL=index.js.map