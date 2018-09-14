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
import { List, FA, LMR, Badge } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { appIcon } from '../consts';
import { store } from '../store';
import { NewApp } from './new';
import { Info } from './info';
let AppsPage = class AppsPage extends React.Component {
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.loadApps();
        });
    }
    itemRender(app, index) {
        let { name, discription, icon, inUnit } = app;
        let ban;
        if (inUnit === 0)
            ban = React.createElement(FA, { className: "text-danger", name: 'ban' });
        return React.createElement(LMR, { className: "px-3 py-2", left: React.createElement(Badge, null,
                React.createElement("img", { src: icon || appIcon })), right: ban },
            React.createElement("div", null, name),
            React.createElement("small", { className: "text-muted" }, discription));
    }
    appClick(app) {
        nav.push(React.createElement(Page, { header: "App\u8BE6\u7EC6\u4FE1\u606F" },
            React.createElement(Info, { app: app })));
    }
    newItem() {
        nav.push(React.createElement(NewApp, Object.assign({}, this.props)));
    }
    render() {
        let right = React.createElement(Button, { color: 'secondary', size: 'sm', onClick: () => this.newItem() },
            React.createElement(FA, { name: "plus" }));
        return React.createElement(Page, { header: "App\u8BBE\u7F6E", right: right },
            React.createElement(List, { items: store.apps, item: { render: this.itemRender, onClick: this.appClick } }));
    }
};
AppsPage = __decorate([
    observer
], AppsPage);
export default AppsPage;
//# sourceMappingURL=index.js.map