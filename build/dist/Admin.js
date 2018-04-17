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
import { Container, Row, Col } from 'reactstrap';
import { observer } from 'mobx-react';
import { nav, Page } from 'tonva-tools';
import { List, LMR, FA, PropGrid } from 'tonva-react-form';
import { StringValueEdit } from './tools';
import consts from './consts';
import { store } from './store';
import Administors from './Administors';
import Dev from './Dev';
import AppsPage from './Apps';
import { Members } from './Members';
let AdminPage = class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.appsAction = {
            main: 'App设置',
            right: '小号增减App',
            // 'mobile-phone'
            icon: 'cog',
            /*<StackedFA>
                <FA name="square-o" className="fa-stack-2x text-secondary" />
                <FA name="cog" className="fa-stack-1x text-primary"  />
            </StackedFA>*/
            page: AppsPage,
        };
        this.usersAction = {
            main: '用户角色',
            right: '用户权限',
            icon: 'users',
            page: Members,
        };
        this.devAction = {
            main: '应用开发',
            right: '程序开发相关管理',
            icon: 'laptop',
            page: Dev,
        };
        this.adminsAction = {
            main: '系统管理员',
            right: '增删管理员',
            icon: 'universal-access',
            page: Administors,
        };
        this.noneAction = {
            main: '请耐心等待分配任务',
            icon: 'hourglass-start',
        };
        this.logout = this.logout.bind(this);
    }
    logout() {
        store.logout();
    }
    getItems() {
        let unit = store.unit;
        let { isAdmin, isOwner, type } = unit;
        let items = [];
        if (isOwner === 1) {
            items.push(this.adminsAction);
        }
        if (isAdmin === 1) {
            if ((type & 2) !== 0) {
                // unit
                items.push(this.appsAction, this.usersAction);
            }
            if ((type & 1) !== 0) {
                // dev unit
                items.push(this.devAction);
            }
        }
        return items;
    }
    row(item, index) {
        return React.createElement(LMR, { className: "py-2 px-3 align-items-center", left: typeof item.icon === 'string' ?
                React.createElement(FA, { className: "text-primary", name: item.icon, fixWidth: true, size: "lg" }) :
                item.icon, right: React.createElement("small", { className: "text-muted" }, item.right) },
            React.createElement("b", null, item.main));
    }
    rowClick(item) {
        nav.push(React.createElement(item.page, null));
    }
    render() {
        let unit = store.unit;
        if (unit === undefined)
            return null;
        let items = this.getItems();
        if (items === undefined) {
            return React.createElement(Page, { header: "" });
        }
        let title = '管理小号';
        let header = title, top;
        if (unit !== undefined) {
            let { name, nick, icon, discription } = unit;
            header = title + ' - ' + (unit.nick || unit.name);
            top = React.createElement(Container, null,
                React.createElement(Row, { className: 'my-4 bg-white py-1 cursor-pointer', onClick: () => nav.push(React.createElement(UnitProps, null)) },
                    React.createElement(Col, { xs: 2, className: 'd-flex justify-content-end align-items-start' },
                        React.createElement("img", { className: 'w-75', src: icon || consts.appIcon })),
                    React.createElement(Col, { xs: "auto" },
                        React.createElement("h4", { className: 'text-dark' }, name),
                        React.createElement("h6", null,
                            React.createElement("small", { className: 'text-secondary' }, nick)),
                        React.createElement("div", { className: 'text-info' }, discription))));
        }
        return React.createElement(Page, { header: header, logout: this.logout },
            top,
            React.createElement(List, { items: items, item: { render: this.row, onClick: this.rowClick } }));
    }
};
AdminPage = __decorate([
    observer
], AdminPage);
export default AdminPage;
class UnitProps extends React.Component {
    constructor() {
        super(...arguments);
        this.rows = [
            '',
            { label: '标志图', type: 'string', name: 'icon' },
            '=',
            { label: '唯一号', type: 'string', name: 'name' },
            {
                label: '名称',
                type: 'string',
                name: 'nick',
                onClick: () => nav.push(React.createElement(StringValueEdit, { title: "\u4FEE\u6539\u540D\u79F0", value: store.unit.nick, onChanged: this.onNickChanged, info: "\u597D\u7684\u540D\u5B57\u4F1A\u63D0\u5347\u63A5\u53D7\u5EA6" }))
            },
            {
                label: '说明',
                type: 'string',
                name: 'discription',
                onClick: () => nav.push(React.createElement(StringValueEdit, { title: "\u4FEE\u6539\u8BF4\u660E", value: store.unit.discription, onChanged: this.onDiscriptionChanged, info: "\u5BF9\u5C0F\u53F7\u505A\u4E00\u4E2A\u8BF4\u660E" }))
            },
        ];
    }
    onNickChanged(value, orgValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.unitChangeProp('nick', value);
        });
    }
    onDiscriptionChanged(value, orgValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.unitChangeProp('discription', value);
        });
    }
    render() {
        return React.createElement(Page, { header: "\u5C0F\u53F7\u4FE1\u606F" },
            React.createElement(PropGrid, { rows: this.rows, values: store.unit, alignValue: "right" }));
    }
}
//# sourceMappingURL=Admin.js.map