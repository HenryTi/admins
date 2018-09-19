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
import { List, Media, LMR, FA, PropGrid } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { StringValueEdit } from '../tools';
import { store } from '../store';
import { MembersPage } from './membersPage';
let RolePage = class RolePage extends React.Component {
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.loadApps();
            yield store.loadRoleApps();
        });
    }
    editRole() {
        nav.push(React.createElement(EditRole, null));
    }
    renderRoleApp(app, index) {
        return React.createElement(LMR, { className: "py-2 px-3 align-items-center", left: app.name, right: React.createElement("small", { className: "text-muted" }, app.discription) });
    }
    roleAppClick(app) {
        nav.push(React.createElement(RoleApps, null));
    }
    addRoleApp() {
        nav.push(React.createElement(RoleApps, null));
    }
    members() {
        nav.push(React.createElement(MembersPage, null));
    }
    render() {
        let { name, discription, count } = store.role;
        let rows = [
            '',
            {
                type: 'component',
                component: React.createElement(Media, { icon: undefined, main: name, discription: discription }),
                onClick: this.editRole,
            },
            '',
            {
                type: 'component',
                component: React.createElement(LMR, { className: "py-2", left: count === undefined || count === 0 ?
                        React.createElement("small", { className: "text-muted" }, "\u65E0\u7528\u6237") :
                        '共有 ' + count + ' 用户', right: React.createElement("div", null,
                        React.createElement(FA, { name: "chevron-right" })) }),
                onClick: this.members,
            },
            '=',
        ];
        let right = React.createElement(Button, { color: 'success', size: 'sm', onClick: () => this.addRoleApp() },
            React.createElement(FA, { name: "plus" }),
            " APP");
        return React.createElement(Page, { header: "\u89D2\u8272", right: right },
            React.createElement(PropGrid, { rows: rows, values: {} }),
            React.createElement("div", { className: "px-3 py-1" },
                React.createElement("small", null,
                    React.createElement(FA, { name: "angle-double-right" }),
                    " \u53EF\u7528APP\u5217\u8868")),
            React.createElement(List, { items: store.roleApps, item: { render: this.renderRoleApp, onClick: this.roleAppClick }, none: React.createElement("small", { className: "text-muted" }, "\u6CA1\u6709APP, \u70B9\u51FB\u53F3\u4E0A\u89D2\u6309\u94AE\u9009\u62E9APP") }));
    }
};
RolePage = __decorate([
    observer
], RolePage);
export { RolePage };
let EditRole = class EditRole extends React.Component {
    onNameChanged(value, orgValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.roleChangeProp('name', value);
        });
    }
    onDiscriptionChanged(value, orgValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.roleChangeProp('discription', value);
        });
    }
    render() {
        let role = store.role;
        let { id } = role;
        let isSysRole = id === 1 || id === 2;
        let rows = [
            '',
            {
                label: '名称',
                type: 'string',
                name: 'name',
                onClick: isSysRole ? undefined : () => nav.push(React.createElement(StringValueEdit, { title: "\u4FEE\u6539\u540D\u79F0", value: role.name, onChanged: this.onNameChanged, info: "\u597D\u7684\u540D\u5B57\u4FBF\u4E8E\u7406\u89E3" }))
            },
            {
                label: '描述',
                type: 'string',
                name: 'discription',
                onClick: isSysRole ? undefined : () => nav.push(React.createElement(StringValueEdit, { title: "\u4FEE\u6539\u63CF\u8FF0", value: role.discription, onChanged: this.onDiscriptionChanged, info: "\u5BF9\u89D2\u8272\u505A\u4E00\u4E2A\u8BF4\u660E" }))
            },
        ];
        return React.createElement(Page, { header: "\u4FEE\u6539\u89D2\u8272\u4FE1\u606F" },
            React.createElement(PropGrid, { rows: rows, values: role, alignValue: "right" }));
    }
};
EditRole = __decorate([
    observer
], EditRole);
let RoleApps = class RoleApps extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.loadApps();
            yield store.loadRoleApps();
        });
    }
    renderApp(app, index) {
        return React.createElement(LMR, { className: "py-1 px-2 align-items-center", left: app.name, right: React.createElement("small", { className: "text-muted" }, app.discription) });
    }
    appSelect(app, isSelected, anySelected) {
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.setRoleApps(this.list.selectedItems);
            nav.pop();
        });
    }
    render() {
        let right = React.createElement(Button, { color: "success", size: "sm", onClick: this.submit }, "\u4FDD\u5B58");
        let apps = store.apps;
        let roleApps = store.roleApps;
        return React.createElement(Page, { header: "\u9009\u62E9APP", right: right },
            React.createElement(List, { ref: list => this.list = list, items: apps, selectedItems: roleApps, item: { render: this.renderApp, onSelect: this.appSelect } }));
    }
};
RoleApps = __decorate([
    observer
], RoleApps);
//# sourceMappingURL=rolePage.js.map