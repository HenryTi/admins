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
import { nav, Page, appInFrame, Controller, VPage, Image, Edit } from 'tonva-tools';
import { List, LMR, FA } from 'tonva-react-form';
import { store } from './store';
import Administors from './Administors';
import AppsPage from './Apps';
import { Members } from './Members';
import { mainApi } from 'api';
import { COrganization } from 'organization';
import { ObjView, 
//appsProps, 
busesProps, serversProps, UQController } from './Dev';
import { AppController } from './Dev';
import { UsersController } from 'Users';
export class CAdmin extends Controller {
    loadAdminUnits() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.userAdminUnits();
            let adminUnits = this.adminUnits = ret[0];
            console.log('loadAdminUnits', adminUnits);
            if (adminUnits.length === 1) {
                appInFrame.unit = adminUnits[0].id;
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
                this.openVPage(VAdmin);
                return;
            }
            yield store.loadUnit();
            this.openVPage(VAdmin);
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
            appInFrame.unit = item.id; // 25;
            store.init();
            yield store.loadUnit();
            this.closePage();
            this.openPageElement(React.createElement(AdminPage, null));
        });
    }
    open() {
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
const logout = () => __awaiter(this, void 0, void 0, function* () {
    store.logout();
});
const rArrow = React.createElement(FA, { name: "chevron-right" });
const typeCaptions = {
    1: '开发号',
    2: '小号',
    3: '系统号'
};
let AdminPage = class AdminPage extends React.Component {
    constructor() {
        super(...arguments);
        this.appsAction = {
            main: '启停App',
            right: rArrow,
            icon: 'play-circle-o',
            page: AppsPage,
        };
        this.usersAction = {
            main: '用户角色',
            right: rArrow,
            icon: 'users',
            page: Members,
        };
        this.newUsersAction = {
            main: '用户管理',
            right: rArrow,
            icon: 'user-o',
            controller: new UsersController(undefined),
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
            if (typeof item === 'string') {
                return React.createElement("div", { className: "px-3 pt-3 pb-1 small text-muted", style: { backgroundColor: '#f0f0f0' } }, item);
            }
            let { title } = item;
            let left, mid, r;
            if (title !== undefined) {
                let { icon, count } = item;
                left = React.createElement(FA, { className: "text-primary", name: icon, fixWidth: true, size: "lg" });
                mid = title;
                r = count > 0 && React.createElement("span", null, count);
            }
            else {
                let { right, main, icon } = item;
                left = typeof icon === 'string' ?
                    React.createElement(FA, { className: "text-primary", name: icon, fixWidth: true, size: "lg" }) :
                    item.icon;
                mid = main;
                r = React.createElement("span", null, right);
            }
            return React.createElement(LMR, { className: "px-3 py-2 align-items-center", left: left, right: r },
                React.createElement("div", { className: "px-3" },
                    React.createElement("b", null, mid)));
        };
        this.rowClick = (item) => __awaiter(this, void 0, void 0, function* () {
            let { title } = item;
            if (title !== undefined) {
                let { objProps, onClick } = item;
                if (objProps !== undefined)
                    return nav.push(React.createElement(ObjView, Object.assign({}, objProps)));
                else {
                    onClick();
                    return;
                }
            }
            else {
                let { page: P, controller } = item;
                if (P !== undefined)
                    nav.push(React.createElement(P, null));
                else {
                    yield controller.start(store.unit);
                }
            }
        });
    }
    componentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            let { unit, dev } = store;
            let { isAdmin, isOwner, type } = unit;
            this.caption = typeCaptions[type];
            if ((type & 1) !== 0) {
                yield store.dev.loadCounts();
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
        console.log('unit:', unit);
        if (isAdmin === 1) {
            if ((type & 2) !== 0) {
                // unit
                items.push('小号管理', this.appsAction, 
                //this.usersAction, 
                this.newUsersAction);
            }
            if ((type & 1) !== 0) {
                // dev unit
                let { counts } = dev;
                let appAction = {
                    title: 'APP',
                    count: counts && counts.app,
                    icon: 'tablet',
                    onClick: () => new AppController(undefined).start(unit.id),
                };
                let uqAction = {
                    title: 'UQ',
                    count: counts && counts.uq,
                    icon: 'database',
                    onClick: () => new UQController(undefined).start(unit.id),
                };
                let busAction = {
                    title: 'BUS',
                    count: counts && counts.bus,
                    icon: 'cogs',
                    objProps: busesProps,
                };
                let serverAction = {
                    title: 'Server',
                    count: counts && counts.server,
                    icon: 'server',
                    objProps: serversProps,
                };
                items.push('开发号管理');
                if (isOwner > 0)
                    items.push(appAction);
                items.push(uqAction, busAction);
                if (isOwner > 0)
                    items.push(serverAction);
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
        let header, top;
        if (unit !== undefined) {
            let { name, nick, icon, discription } = unit;
            let title, vice;
            if (nick) {
                title = nick;
                vice = React.createElement("h6", null,
                    React.createElement("small", { className: 'text-secondary' }, name));
            }
            else {
                title = name;
            }
            if (this.caption !== undefined)
                header = this.caption + ' - ' + title;
            top = React.createElement(LMR, { className: 'px-3 my-4 bg-white py-2 cursor-pointer', onClick: () => nav.push(React.createElement(UnitProps, null)), left: React.createElement("div", null,
                    React.createElement(Image, { className: "w-3c h-3c", src: icon })) },
                React.createElement("div", { className: "px-3" },
                    React.createElement(LMR, { right: vice },
                        React.createElement("h6", { className: 'text-dark font-weight-bold' }, title)),
                    React.createElement("div", { className: 'small text-info' }, discription)));
        }
        else {
            header = '系统管理';
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
        /*
        private rows:Prop[] = [
            '',
            {label: '标志图', type: 'string', name: 'icon'},
            '=',
            {label: '唯一号', type: 'string', name: 'name'},
            {
                label: '名称',
                type: 'string',
                name: 'nick',
                onClick:()=>nav.push(<StringValueEdit
                    title="修改名称"
                    value={store.unit.nick}
                    onChanged={this.onNickChanged}
                    info="好的名字会提升接受度" />)
            },
            {
                label: '说明',
                type: 'string',
                name: 'discription',
                onClick:()=>nav.push(<StringValueEdit
                    title="修改说明"
                    value={store.unit.discription}
                    onChanged={this.onDiscriptionChanged}
                    info="对小号做一个说明" />)
            },
        ];
        */
        this.schema = [
            { name: 'icon', type: 'image' },
            { name: 'nick', type: 'string' },
            { name: 'discription', type: 'string' },
        ];
        this.uiSchema = {
            items: {
                nick: { widget: 'text', label: '别名', placeholder: '好的别名更方便记忆' },
                icon: { widget: 'image', label: '标志图' },
                discription: { widget: 'text', label: '描述', placeholder: '简短清晰的描述' },
            }
        };
        /*
        async onNickChanged(value:any, orgValue:any):Promise<void> {
            await store.unitChangeProp('nick', value);
        }
        async onDiscriptionChanged(value:any, orgValue:any):Promise<void> {
            await store.unitChangeProp('discription', value);
        }
        */
        this.onItemChanged = (itemSchema, newValue, preValue) => __awaiter(this, void 0, void 0, function* () {
            let { name } = itemSchema;
            //await userApi.userSetProp(name, newValue);
            yield store.unitChangeProp(name, newValue);
            //this.data[name] = newValue;
            //nav.user[name] = newValue;
            //nav.saveLocalUser();
        });
    }
    //<PropGrid rows={this.rows} values={store.unit} alignValue="right" />
    render() {
        let unit = store.unit;
        let { isRoot, isOwner } = unit;
        return React.createElement(Page, { header: "\u5C0F\u53F7\u4FE1\u606F" },
            React.createElement(Edit, { schema: this.schema, uiSchema: this.uiSchema, data: store.unit, onItemChanged: this.onItemChanged, stopEdit: !(isRoot > 0 && isOwner > 0) }));
    }
}
//# sourceMappingURL=Admin.js.map