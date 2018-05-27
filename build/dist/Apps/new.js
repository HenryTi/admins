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
import { SearchBox, List, LMR, Badge } from 'tonva-react-form';
import { nav, Page, PagedItems } from 'tonva-tools';
import consts from '../consts';
import { mainApi } from '../api';
import { store } from '../store';
import { Info } from './info';
class PagedApps extends PagedItems {
    constructor(unitId) {
        super();
        this.unitId = unitId;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mainApi.searchApp(this.unitId, this.param, this.pageStart, this.pageSize);
        });
    }
    setPageStart(item) {
        if (item === undefined)
            this.pageStart = 0;
        else
            this.pageStart = item.id;
    }
}
let NewApp = class NewApp extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.appClick = this.appClick.bind(this);
        this.appActed = this.appActed.bind(this);
        this.apps = new PagedApps(store.unit.id);
    }
    onSearch(key) {
        this.apps.first(key);
    }
    appClick(app) {
        nav.push(React.createElement(Page, { header: "App\u8BE6\u7EC6\u4FE1\u606F" },
            React.createElement(Info, { app: app, appActed: this.appActed })));
    }
    appActed(appId, inUnit) {
        let apps = this.apps.items; //.replace .find(v => v.id === appId);
        let app = apps.find(v => v.id === appId);
        app.inUnit = inUnit;
        apps.replace([app]);
    }
    renderApp(app) {
        let { name, discription, icon, inUnit } = app;
        let right;
        if (inUnit === 1)
            right = React.createElement("small", null, "\u5DF2\u542F\u7528");
        else if (inUnit === 0)
            right = React.createElement("small", null, "\u5DF2\u505C\u7528");
        return React.createElement(LMR, { className: "px-3 py-2", left: React.createElement(Badge, null,
                React.createElement("img", { src: icon || consts.appIcon })), right: right },
            React.createElement("div", null, name),
            React.createElement("small", { className: "text-muted" }, discription));
    }
    render() {
        let center = React.createElement(SearchBox, { onSearch: this.onSearch, className: "w-100 mx-1", placeholder: "\u641C\u7D22App", maxLength: 100 });
        return React.createElement(Page, { header: center },
            React.createElement(List, { items: this.apps.items, item: { onClick: this.appClick, render: this.renderApp }, before: "\u641C\u7D22App\u540D\u5B57" }));
    }
};
NewApp = __decorate([
    observer
], NewApp);
export { NewApp };
//# sourceMappingURL=new.js.map