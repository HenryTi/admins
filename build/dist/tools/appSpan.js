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
import { Media, PropGrid } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { store } from '../store';
import { devApi } from '../api';
import { span } from './span';
import { IdDates } from './idDates';
import { UnitSpan } from './unitSpan';
let AppSpan = class AppSpan extends React.Component {
    constructor() {
        super(...arguments);
        /*
        constructor(props:any) {
            super(props);
            this.onClick = this.onClick.bind(this);
        }
        componentWillMount() {
            let {id} = this.props;
            store.cacheApps.get(id);
        }
        */
        this.onClick = (evt) => {
            evt.preventDefault();
            nav.push(React.createElement(AppInfo, { id: this.props.id }));
            return false;
        };
    }
    render() {
        let { id, isLink, className } = this.props;
        let app = store.cacheApps.get(id);
        let content;
        if (app === null) {
            content = id;
        }
        else {
            let { name, icon, discription } = app;
            let isPublic = app.public;
            let disc = discription && '- ' + discription;
            if (name !== undefined) {
                content = React.createElement(React.Fragment, null,
                    name,
                    " \u00A0 ",
                    React.createElement("small", { className: "text-muted" }, disc));
            }
            else {
                content = id;
            }
        }
        return span(isLink, className, this.onClick, content);
    }
};
AppSpan = __decorate([
    observer
], AppSpan);
export { AppSpan };
let AppInfo = class AppInfo extends React.Component {
    constructor(props) {
        super(props);
        this.apis = {
            label: '关联API', type: 'list', list: undefined, row: AppRow
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.apis.list = yield devApi.loadAppUqs(this.props.id);
        });
    }
    render() {
        let app = store.cacheApps.get(this.props.id);
        let { unit, name, discription, icon, date_init, date_update } = app;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        this.rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: icon, main: name, discription: disp }) },
            '',
            { type: 'component', label: '所有者', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true })) },
            this.apis,
        ];
        return React.createElement(Page, { header: 'APP - 详细资料' },
            React.createElement(PropGrid, { rows: this.rows, values: this.props }));
    }
};
__decorate([
    observable
], AppInfo.prototype, "apis", void 0);
AppInfo = __decorate([
    observer
], AppInfo);
class AppRow extends React.Component {
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
//# sourceMappingURL=appSpan.js.map