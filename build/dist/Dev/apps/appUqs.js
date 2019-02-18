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
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { List, LMR, SearchBox } from 'tonva-react-form';
import { UnitSpan } from 'tools';
import { store } from 'store';
import { nav, Page, VPage } from 'tonva-tools';
export class SearchUqPage extends VPage {
    constructor() {
        super(...arguments);
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
            let pageStart = 0;
            let pageSize = 100;
            this.uqs = yield this.controller.searchUq(key, pageStart, pageSize);
        });
        this.page = observer(() => {
            let header = React.createElement(SearchBox, { className: "w-100 mx-1", onSearch: this.onSearch, placeholder: "\u641C\u7D22UQ\u540D\u5B57", maxLength: 100 });
            return React.createElement(Page, { back: "close", header: header },
                React.createElement(List, { items: this.uqs, item: { render: this.row, onClick: this.controller.onUq } }));
        });
        this.row = (uq) => {
            let { owner, name, discription } = uq;
            return React.createElement(LMR, { className: "py-2 px-3", right: discription },
                React.createElement("div", null,
                    owner,
                    " / ",
                    name));
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.uqs = yield this.controller.getMyUqs();
            this.openPage(this.page);
        });
    }
}
__decorate([
    observable
], SearchUqPage.prototype, "uqs", void 0);
let AppUqs = class AppUqs extends React.Component {
    constructor() {
        super(...arguments);
        this.anySelected = false;
        this.onSelect = (item, isSelected, anySelected) => {
            this.anySelected = anySelected;
        };
        this.row = (item) => {
            let { name, unit, discription } = item;
            return React.createElement(LMR, { className: "p-2", right: React.createElement("small", { className: "text-muted" }, discription) },
                React.createElement(UnitSpan, { id: unit }),
                "/",
                name);
        };
        this.removeBind = () => {
            if (this.list === null)
                return;
            let { selectedItems } = this.list;
            if (selectedItems === undefined)
                return;
            if (selectedItems.length === 0)
                return;
            store.dev.apps.appBindUq(selectedItems.map(v => {
                return { id: v.id, access: ['*'] };
            }), false);
        };
    }
    render() {
        let btnProps = this.anySelected ?
            { color: 'danger', onClick: this.removeBind, icon: 'trash', text: '取消' } :
            { color: 'primary', onClick: () => nav.push(React.createElement(Uqs, null)), icon: 'plus', text: '新增' };
        let btn = (p) => React.createElement("button", { className: classNames('btn', 'btn-outline-' + p.color, 'btn-sm'), onClick: p.onClick },
            React.createElement("i", { className: "fa fa-" + p.icon }),
            " ",
            p.text,
            "\u5173\u8054");
        let listHeader = React.createElement("div", { className: "va-row py-1 justify-content-center" }, btn(btnProps));
        return React.createElement(Page, { header: "\u5173\u8054UQ" },
            React.createElement(List, { ref: list => this.list = list, header: listHeader, items: store.dev.apps.uqs, item: { render: this.row, onSelect: this.onSelect } }));
    }
};
__decorate([
    observable
], AppUqs.prototype, "anySelected", void 0);
AppUqs = __decorate([
    observer
], AppUqs);
export { AppUqs };
let Uqs = class Uqs extends React.Component {
    constructor() {
        super(...arguments);
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
            yield store.dev.apps.searchUq(key);
        });
        this.row = (uq) => {
            let isConnected = store.dev.apps.uqs.find(a => a.id === uq.id) !== undefined;
            let cn = ['btn', 'btn-sm'];
            let btnContent, onClick;
            if (isConnected) {
                cn.push('btn-success');
                onClick = () => this.onBind(uq, false);
                btnContent = "已关联";
            }
            else {
                cn.push('btn-primary');
                onClick = () => this.onBind(uq, true);
                btnContent = React.createElement("span", null,
                    React.createElement("i", { className: "fa fa-check" }),
                    " \u5173\u8054");
            }
            return React.createElement("div", { className: "d-flex justify-content-start py-1 px-3" },
                React.createElement("div", { className: "align-self-center" }, uq.name + ' - ' + uq.discription),
                React.createElement("footer", { className: "ml-auto" },
                    React.createElement("button", { className: classNames(cn), onClick: onClick }, btnContent)));
        };
    }
    onBind(uq, bind) {
        store.dev.apps.appBindUq([{ id: uq.id, access: ['*'] }], bind);
    }
    render() {
        let header = React.createElement(SearchBox, { className: "w-100 mx-1", onSearch: this.onSearch, placeholder: "\u641C\u7D22UQ\u540D\u5B57", maxLength: 100 });
        return React.createElement(Page, { back: "close", header: header },
            React.createElement(List, { items: store.dev.apps.searchedUqs, item: { render: this.row }, loading: null }));
    }
};
Uqs = __decorate([
    observer
], Uqs);
//# sourceMappingURL=appUqs.js.map