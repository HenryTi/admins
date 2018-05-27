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
import { List, LMR, FA, Media, Muted, PropGrid } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { store } from '../store';
import consts from '../consts';
import { StringValueEdit } from '../tools';
import { RoleApps } from './roleApps';
let MemberPage = class MemberPage extends React.Component {
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.loadRoles();
            yield store.loadMemberRoles();
        });
    }
    onAssigned(value, orgValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.unitAssignMember(value);
        });
    }
    renderMemberRole(role) {
        let { name, discription } = role;
        return React.createElement(LMR, { className: "py-1 px-2 align-items-center", left: name, right: React.createElement(Muted, null, discription) });
    }
    roleClick(role) {
        nav.push(React.createElement(RoleApps, { role: role }));
    }
    setRole() {
        nav.push(React.createElement(SetRole, null));
    }
    render() {
        let roleUser = store.roleMember;
        let { nick, name, assigned, icon } = roleUser;
        let disp = React.createElement("div", null,
            React.createElement("div", null,
                React.createElement(Muted, null, "\u552F\u4E00\u540D: "),
                name),
            React.createElement("div", null,
                React.createElement(Muted, null, "\u6635\u79F0: "),
                nick || React.createElement(Muted, null, "[\u65E0]")));
        let rows = [
            '',
            {
                type: 'component',
                component: React.createElement(Media, { icon: icon || consts.appIcon, main: roleUser.assigned || nick || name, discription: disp })
            },
            '',
            {
                label: '备注名',
                type: 'string',
                name: 'assigned',
                onClick: () => nav.push(React.createElement(StringValueEdit, { title: "\u4FEE\u6539\u5907\u6CE8\u540D", value: roleUser.assigned, onChanged: this.onAssigned, info: "\u52A0\u4E00\u4E2A\u5907\u6CE8\uFF0C\u4FBF\u4E8E\u7504\u522B\u7528\u6237" })),
            },
            '',
        ];
        let right = React.createElement(Button, { color: "success", size: "sm", onClick: this.setRole }, "\u4FEE\u6539\u89D2\u8272");
        return React.createElement(Page, { header: "\u7528\u6237\u8BE6\u60C5", right: right },
            React.createElement(PropGrid, { rows: rows, values: roleUser }),
            React.createElement("div", { className: "px-3 py-1" },
                React.createElement("small", null,
                    React.createElement(FA, { name: "angle-double-right" }),
                    " \u6240\u5C5E\u89D2\u8272")),
            React.createElement(List, { items: store.memberRoles, item: { render: this.renderMemberRole, onClick: this.roleClick } }));
    }
};
MemberPage = __decorate([
    observer
], MemberPage);
export { MemberPage };
let SetRole = class SetRole extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.loadRoles();
            yield store.loadMemberRoles();
        });
    }
    renderRole(role, index) {
        return React.createElement(LMR, { className: "py-1 px-2 align-items-center", left: role.name, right: React.createElement("small", { className: "text-muted" }, role.discription) });
    }
    roleSelect(role, isSelected, anySelected) {
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.setMemberRoles(this.list.selectedItems);
            nav.pop();
        });
    }
    render() {
        let right = React.createElement(Button, { color: "success", size: "sm", onClick: this.submit }, "\u4FDD\u5B58");
        let roles = store.roles;
        let memberRoles = store.memberRoles;
        return React.createElement(Page, { header: "\u4FEE\u6539\u89D2\u8272", right: right },
            React.createElement(List, { ref: list => this.list = list, items: roles, selectedItems: memberRoles, compare: (role, selectRole) => role.id === selectRole.id, item: { render: this.renderRole, onSelect: this.roleSelect } }));
    }
};
SetRole = __decorate([
    observer
], SetRole);
//# sourceMappingURL=memberPage.js.map