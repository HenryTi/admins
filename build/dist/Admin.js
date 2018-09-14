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
import { Col } from 'reactstrap';
import { observer } from 'mobx-react';
import { nav, Page, meInFrame } from 'tonva-tools';
import { List, LMR, FA, PropGrid } from 'tonva-react-form';
import { Coordinator, VmPage } from 'tonva-react-usql';
import { StringValueEdit } from './tools';
import { appIcon } from './consts';
import { store } from './store';
import Administors from './Administors';
//import DevActions from './Dev';
import AppsPage from './Apps';
import { Members } from './Members';
import { mainApi } from 'api';
import { CrOrganization } from 'organization';
import { ObjView, appsProps, usqsProps, busesProps, serversProps, usqldbsProps } from './Dev';
export class CrAdmin extends Coordinator {
    loadAdminUnits() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.userAdminUnits();
            this.adminUnits = ret;
            if (ret.length === 1) {
                meInFrame.unit = ret[0].id;
                yield store.loadUnit();
                let a;
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
            }
            else {
                let user = nav.user;
                if (user === undefined) {
                    console.log('autorun: user has logged out');
                    return;
                }
                console.log('autorun login');
                yield store.loadUnit();
            }
            this.showVm(VmAdmin);
        });
    }
}
export class VmAdmin extends VmPage {
    constructor() {
        super(...arguments);
        this.selectUnitPage = () => {
            return React.createElement(Page, { header: "\u9009\u62E9\u5C0F\u53F7", logout: logout },
                React.createElement(List, { items: this.coordinator.adminUnits, item: { render: this.renderRow, onClick: this.onRowClick } }));
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
            let { isProduction, adminUnits } = this.coordinator;
            if (isProduction === false && adminUnits.length > 1) {
                this.openPage(this.selectUnitPage);
            }
            else {
                this.openPageElement(React.createElement(AdminPage, null));
            }
            /*
            if (this.isProduction === true) return <AdminPage />;
            let {adminUnits} = store;
            if (adminUnits === undefined)
                return <Page>loading ... </Page>;
            if (adminUnits.length === 1)
                return <AdminPage />;
            return <SelectUnit />;
            */
        });
    }
    get view() { return undefined; }
}
const logout = () => {
    store.logout();
};
let AdminPage = class AdminPage extends React.Component {
    constructor() {
        super(...arguments);
        this.appsAction = {
            main: 'App设置',
            right: '增减',
            icon: 'cog',
            page: AppsPage,
        };
        this.usersAction = {
            main: '用户角色',
            right: '权限',
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
            main: '系统管理员',
            right: '增减',
            icon: 'universal-access',
            page: Administors,
        };
        this.organizeAction = {
            main: '组织结构',
            right: '调整',
            icon: 'sitemap',
            cr: new CrOrganization
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
            //let {vm, page} = item;
            let { title } = item;
            if (title !== undefined) {
                let { objProps } = item;
                return nav.push(React.createElement(ObjView, Object.assign({}, objProps)));
            }
            else {
                let { page: P, cr } = item;
                if (P !== undefined)
                    nav.push(React.createElement(P, null));
                else {
                    yield cr.start();
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
            if ((type & 2) !== 0) {
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
            top = React.createElement("div", { className: 'row px-3 my-4 bg-white py-2 cursor-pointer', onClick: () => nav.push(React.createElement(UnitProps, null)) },
                React.createElement(Col, { xs: "auto" },
                    React.createElement("img", { src: icon || appIcon })),
                React.createElement(Col, { xs: "auto" },
                    React.createElement("h6", { className: 'text-dark' }, name),
                    React.createElement("h6", null,
                        React.createElement("small", { className: 'text-secondary' }, nick)),
                    React.createElement("div", { className: 'text-info' }, discription)));
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