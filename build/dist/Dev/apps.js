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
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as _ from 'lodash';
import { Button } from 'reactstrap';
import { nav, Page } from 'tonva-tools';
import { Media, PropGrid, List, SearchBox, LMR, Muted } from 'tonva-react-form';
import { UnitSpan, IdDates, ServerSpan } from '../tools';
import { appIcon, appItemIcon } from '../consts';
import { store } from '../store';
import { Row } from './row';
import { NewService, ServiceInfo } from './servicePage';
let Info = class Info extends React.Component {
    constructor() {
        super(...arguments);
        this.usqs = { label: '关联Usq', type: 'list', list: undefined, row: UsqRow };
    }
    componentWillMount() {
        store.dev.services.cur = undefined;
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.dev.apps.loadCurApis();
            yield store.dev.services.loadAppServices(this.props.id);
            this.usqs.list = store.dev.apps.usqs;
        });
    }
    render() {
        let { unit, name, discription, icon, date_init, date_update } = this.props;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        let rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: icon || appIcon, main: name, discription: disp }) },
            '',
            { type: 'component', label: '所有者', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true })) },
            this.usqs,
            '',
            {
                type: 'component',
                label: 'Service',
                vAlign: 'stretch',
                component: React.createElement(ServiceRow, null),
            },
        ];
        return React.createElement("div", null,
            React.createElement(PropGrid, { rows: rows, values: this.props }));
    }
};
__decorate([
    observable
], Info.prototype, "usqs", void 0);
Info = __decorate([
    observer
], Info);
let ServiceRow = class ServiceRow extends React.Component {
    newClick() {
        let dev = store.dev;
        nav.push(React.createElement(NewService, { type: 2, id: dev.apps.cur.id }));
    }
    infoClick() {
        nav.push(React.createElement(ServiceInfo, null));
    }
    setProp(prop, value) {
        let service = store.dev.services.cur;
        switch (prop) {
            case 'url':
                service.url = value;
                break;
            case 'server':
                service.server = value;
                break;
        }
    }
    render() {
        let service = store.dev.services.cur;
        if (service === null)
            return '...';
        let content, click;
        if (service === undefined) {
            click = this.newClick;
            content = React.createElement(Muted, null, "\u65E0\uFF0C\u70B9\u51FB\u8BBE\u7F6E");
        }
        else {
            let { url, server } = service;
            click = this.infoClick;
            content = React.createElement("div", null,
                React.createElement("div", null, url),
                React.createElement(ServerSpan, { id: server }));
        }
        return React.createElement("div", { className: "d-flex w-100 align-items-center cursor-pointer", style: { flex: 1 }, onClick: click }, content);
    }
};
ServiceRow = __decorate([
    observer
], ServiceRow);
export { ServiceRow };
class UsqRow extends React.Component {
    render() {
        let { name, discription } = this.props;
        let disp;
        if (discription)
            disp = React.createElement("div", { className: "small text-muted" }, discription);
        return React.createElement("div", { className: 'form-control-plaintext' },
            React.createElement("div", null, name),
            disp);
    }
}
const appsProps = {
    title: 'APP',
    formRows: [
        {
            label: '名称',
            field: { name: 'name', type: 'string', maxLength: 100, required: true },
        },
        {
            label: '描述',
            field: { name: 'discription', type: 'string', maxLength: 250 },
            face: { type: 'textarea' }
        },
        {
            label: '图标',
            field: { name: 'icon', type: 'string', maxLength: 250 },
        },
        {
            label: '公开',
            field: { name: 'public', type: 'bool', defaultValue: 1 }
        },
    ],
    row: (item) => {
        return React.createElement(Row, { icon: item.icon || appItemIcon, main: item.name, vice: item.discription });
    },
    items: () => store.dev.apps,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    },
    info: Info,
    extraMenuActions: [
        { icon: 'cogs', caption: '设置关联USQ', action: () => nav.push(React.createElement(AppUsqs, null)) }
    ],
};
let AppUsqs = class AppUsqs extends React.Component {
    constructor() {
        super(...arguments);
        this.anySelected = false;
        this.ref = (list) => {
            this._list = list;
        };
        /*
        async removeBind() {
            let apiIds:number[] = this._list.selectedItems.map(v => v.id);
            await store.dev.apps.appBindApi(apiIds, false);
        }*/
        this.onSelect = (item, isSelected, anySelected) => {
            this.anySelected = anySelected;
        };
        this.row = (item) => {
            return React.createElement(LMR, { className: "p-2", right: React.createElement("small", { className: "text-muted" }, item.discription) }, item.name);
            /*
            return <div className="p-2">
                <div>{item.name}</div>
                <small className="ml-auto text-muted">{item.discription}</small>
            </div>;*/
        };
    }
    render() {
        let btnProps = this.anySelected ?
            { color: 'danger', /*onClick:this.removeBind, */ icon: 'trash', text: '取消' } :
            { color: 'primary', onClick: () => nav.push(React.createElement(Usqs, null)), icon: 'plus', text: '新增' };
        let btn = (p) => React.createElement(Button, { outline: true, color: p.color, size: "sm", onClick: p.onClick },
            React.createElement("i", { className: "fa fa-" + p.icon }),
            " ",
            p.text,
            "\u5173\u8054");
        let listHeader = React.createElement("div", { className: "va-row py-1 justify-content-center" }, btn(btnProps));
        return React.createElement(Page, { header: "\u5173\u8054USQ" },
            React.createElement(List, { ref: this.ref, header: listHeader, items: store.dev.apps.usqs, item: { render: this.row, onSelect: this.onSelect } }));
    }
};
__decorate([
    observable
], AppUsqs.prototype, "anySelected", void 0);
AppUsqs = __decorate([
    observer
], AppUsqs);
let Usqs = class Usqs extends React.Component {
    constructor() {
        super(...arguments);
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
            yield store.dev.apps.searchApi(key);
        });
        this.row = (usq) => {
            let isConnected = store.dev.apps.usqs.find(a => a.id === usq.id) !== undefined;
            let btnProps = {
                outline: true,
                size: 'sm'
            }, btnContent;
            if (isConnected) {
                _.assign(btnProps, { onClick: () => this.onBind(usq, false), color: 'success' });
                btnContent = "已关联";
            }
            else {
                _.assign(btnProps, { onClick: () => this.onBind(usq, true), color: 'primary' });
                btnContent = React.createElement("span", null,
                    React.createElement("i", { className: "fa fa-check" }),
                    " \u5173\u8054");
            }
            return React.createElement("div", { className: "d-flex justify-content-start py-1 px-3" },
                React.createElement("div", { className: "align-self-center" }, usq.name + ' - ' + usq.discription),
                React.createElement("footer", { className: "ml-auto" },
                    React.createElement(Button, Object.assign({}, btnProps), btnContent)));
        };
    }
    onBind(api, bind) {
        store.dev.apps.appBindUsq([{ id: api.id, access: ['*'] }]);
    }
    render() {
        let header = React.createElement(SearchBox, { className: "w-100 mx-1", onSearch: this.onSearch, placeholder: "\u641C\u7D22USQ\u540D\u5B57", maxLength: 100 });
        return React.createElement(Page, { back: "close", header: header },
            React.createElement(List, { items: store.dev.apps.searchedApis, item: { render: this.row }, loading: null }));
    }
};
Usqs = __decorate([
    observer
], Usqs);
export default appsProps;
//# sourceMappingURL=apps.js.map