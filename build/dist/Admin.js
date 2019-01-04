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
import { nav, Page, meInFrame, Controller, VPage } from 'tonva-tools';
import { List, LMR, FA, PropGrid } from 'tonva-react-form';
import { StringValueEdit } from './tools';
import { appIcon } from './consts';
import { store } from './store';
import Administors from './Administors';
//import DevActions from './Dev';
import AppsPage from './Apps';
import { Members } from './Members';
import { mainApi } from 'api';
import { COrganization } from 'organization';
import { ObjView, appsProps, usqsProps, busesProps, serversProps, usqldbsProps } from './Dev';
export class CAdmin extends Controller {
    loadAdminUnits() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.userAdminUnits();
            this.adminUnits = ret;
            if (ret.length === 1) {
                meInFrame.unit = ret[0].id;
                yield store.loadUnit();
            }
        });
    }
    internalStart(param) {
        return __awaiter(this, void 0, void 0, function* () {
            store.init();
            this.isProduction = document.location.hash.startsWith('#tv');
            console.log('admins isProduction %s', this.isProduction);
            if (this.isProduction === false) {
                yield this.loadAdminUnits();
                this.showVPage(VAdmin);
                return;
            }
            yield store.loadUnit();
            this.showVPage(VAdmin);
            /*
                let user = nav.user;
                if (user === undefined) {
                    console.log('autorun: user has logged out');
                    return;
                }
            
                console.log('autorun login');
                */
            /*
             setTimeout(async () => {
                 // 等待 tonva-tools 里面的initSubWin的nav.user的赋值
                 // 这个地方实际上有问题的，不应该这么写。程序逻辑顺序逻辑错误。
                 // 2018-11-5: 临时凑合用延时的方式来解决。
                 await store.loadUnit();
                 this.showVPage(VAdmin);
             }, 200);
             */
        });
    }
}
export class VAdmin extends VPage {
    constructor() {
        super(...arguments);
        this.selectUnitPage = () => {
            return React.createElement(Page, { header: "\u9009\u62E9\u5C0F\u53F7", logout: logout },
                React.createElement(List, { items: this.controller.adminUnits, item: { render: this.renderRow, onClick: this.onRowClick } }));
        };
        this.noUnitPage = () => {
            let { nick, name } = nav.user;
            return React.createElement(Page, { header: "\u6CA1\u6709\u5C0F\u53F7", logout: logout },
                React.createElement("div", { className: "p-3 small text-info" },
                    nick || name,
                    ": \u6CA1\u6709\u9700\u8981\u7BA1\u7406\u7684\u5C0F\u53F7"));
        };
        this.renderRow = (item, index) => {
            return React.createElement(LMR, { className: "p-2", right: 'id: ' + item.id },
                React.createElement("div", null, item.nick || item.name));
        };
        this.onRowClick = (item) => __awaiter(this, void 0, void 0, function* () {
            meInFrame.unit = item.id; // 25;
            yield store.loadUnit();
            this.closePage();
            this.openPageElement(React.createElement(AdminPage, null));
        });
    }
    showEntry() {
        return __awaiter(this, void 0, void 0, function* () {
            let { isProduction, adminUnits } = this.controller;
            if (isProduction === false) {
                switch (adminUnits.length) {
                    default:
                        this.openPage(this.selectUnitPage);
                        return;
                    case 0:
                        this.openPage(this.noUnitPage);
                        return;
                    case 1:
                        this.openPageElement(React.createElement(AdminPage, null));
                        return;
                }
            }
            if (store.unit === undefined) {
                this.openPage(this.noUnitPage);
                return;
            }
            this.openPageElement(React.createElement(AdminPage, null));
        });
    }
    get view() { return undefined; }
}
const logout = () => {
    store.logout();
};
const rArrow = React.createElement(FA, { name: "angle-right" });
let AdminPage = class AdminPage extends React.Component {
    constructor() {
        super(...arguments);
        this.appsAction = {
            main: '启停App',
            right: rArrow,
            icon: 'play',
            page: AppsPage,
        };
        this.usersAction = {
            main: '用户角色',
            right: rArrow,
            icon: 'users',
            page: Members,
        };
        /*
        private devAction:Item = {
            main: <DevActions />,
            right: '程序开发相关管理',
            icon: 'laptop',
            //page: Dev,
        };*/
        this.adminsAction = {
            main: '管理员',
            right: rArrow,
            icon: 'universal-access',
            page: Administors,
        };
        this.cOrganization = new COrganization;
        this.organizeAction = {
            main: this.cOrganization.label,
            right: rArrow,
            icon: this.cOrganization.icon,
            controller: this.cOrganization
        };
        this.noneAction = {
            main: '请耐心等待分配任务',
            icon: 'hourglass-start',
        };
        this.row = (item, index) => {
            let { title } = item;
            let left, mid, r;
            if (title !== undefined) {
                let { icon, count } = item;
                left = React.createElement(FA, { className: "text-primary", name: icon, fixWidth: true, size: "lg" });
                mid = title;
                r = count > 0 && React.createElement("small", { className: "text-muted" }, count);
            }
            else {
                let { right, main, icon } = item;
                left = typeof icon === 'string' ?
                    React.createElement(FA, { className: "text-primary", name: icon, fixWidth: true, size: "lg" }) :
                    item.icon;
                mid = main;
                r = React.createElement("small", { className: "text-muted" }, right);
            }
            return React.createElement(LMR, { className: "px-3 py-2 align-items-center", left: left, right: r },
                React.createElement("div", { className: "px-3" },
                    React.createElement("b", null, mid)));
        };
        this.rowClick = (item) => __awaiter(this, void 0, void 0, function* () {
            let { title } = item;
            if (title !== undefined) {
                let { objProps } = item;
                return nav.push(React.createElement(ObjView, Object.assign({}, objProps)));
            }
            else {
                let { page: P, controller } = item;
                if (P !== undefined)
                    nav.push(React.createElement(P, null));
                else {
                    yield controller.start();
                }
            }
        });
    }
    componentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            let { unit, dev } = store;
            let { isAdmin, isOwner, type } = unit;
            if ((type & 1) !== 0) {
                // dev unit
                this.caption = '开发号';
                yield store.dev.loadCounts();
            }
            else {
                this.caption = '小号';
            }
        });
    }
    buildItems() {
        let { unit, dev } = store;
        let { isAdmin, isOwner, type } = unit;
        let items = [];
        if (isOwner === 1) {
            items.push(this.adminsAction);
        }
        if (isAdmin === 1) {
            if ((type & 2) !== 0 && unit.name !== '$$$') {
                // unit
                items.push(this.appsAction, this.usersAction, this.organizeAction);
            }
            if ((type & 1) !== 0) {
                // dev unit
                let { counts } = dev;
                if (counts !== undefined) {
                    let devItems = [
                        {
                            title: 'APP',
                            count: counts.app,
                            icon: 'tablet',
                            //items: store.dev.apps,
                            //page: <ObjView {...appsProps} items={store.dev.apps} />
                            objProps: appsProps
                        },
                        {
                            title: 'USQ',
                            count: counts.usq,
                            icon: 'cogs',
                            //items: store.dev.apis, 
                            objProps: usqsProps,
                        },
                        {
                            title: 'BUS',
                            count: counts.bus,
                            icon: 'cogs',
                            objProps: busesProps,
                        },
                        {
                            title: 'Server',
                            count: counts.server,
                            icon: 'server',
                            //items: store.dev.servers, 
                            //page: <ObjView {...serversProps} items={store.dev.servers} />
                            objProps: serversProps,
                        },
                        /*
                        {
                            title: 'Service',
                            count: counts.service,
                            icon: 'microchip',
                            //items: store.dev.services,
                            //page: <ObjView {...servicesProps} items={store.dev.services} />
                            objProps: servicesProps,
                        },*/
                        {
                            title: 'UsqlDB',
                            count: counts.usqldb,
                            icon: 'database',
                            objProps: usqldbsProps,
                        },
                    ];
                    items.push(...devItems);
                }
            }
        }
        return items;
    }
    render() {
        let unit = store.unit;
        if (unit === undefined) {
            console.log("admin render without unit");
            return null;
        }
        console.log("admin render with unit");
        let items = this.buildItems();
        if (items === undefined) {
            return React.createElement(Page, { header: "" });
        }
        let title = this.caption;
        let header = title, top;
        if (unit !== undefined) {
            let { name, nick, icon, discription } = unit;
            header = title + ' - ' + (unit.nick || unit.name);
            top = React.createElement(LMR, { className: 'px-3 my-4 bg-white py-2 cursor-pointer', onClick: () => nav.push(React.createElement(UnitProps, null)), left: React.createElement("div", null,
                    React.createElement("img", { src: icon || appIcon })) },
                React.createElement("div", { className: "px-3" },
                    React.createElement("h6", { className: 'text-dark' }, name),
                    React.createElement("h6", null,
                        React.createElement("small", { className: 'text-secondary' }, nick)),
                    React.createElement("div", { className: 'small text-info' }, discription)));
        }
        return React.createElement(Page, { header: header, logout: logout },
            top,
            React.createElement(List, { items: items, item: { render: this.row, onClick: this.rowClick } }));
    }
};
AdminPage = __decorate([
    observer
], AdminPage);
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