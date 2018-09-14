var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { Media, PropGrid } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { appIcon } from '../consts';
import { store } from '../store';
import { span } from './span';
import { IdDates } from './idDates';
import { UnitSpan } from './unitSpan';
let ServerSpan = class ServerSpan extends React.Component {
    constructor() {
        super(...arguments);
        /*
        constructor(props:any) {
            super(props);
            this.onClick = this.onClick.bind(this);
        }
        componentWillMount() {
            let {id} = this.props;
            store.cacheServers.get(id);
        }
        */
        this.onClick = (evt) => {
            evt.preventDefault();
            nav.push(React.createElement(ServerInfo, { id: this.props.id }));
            return false;
        };
    }
    render() {
        let { id, isLink, className } = this.props;
        let server = store.cacheServers.get(id);
        let content;
        if (server === null) {
            content = id;
        }
        else {
            let { cloud, ip, discription } = server;
            if (discription !== undefined) {
                content = React.createElement(React.Fragment, null,
                    discription,
                    " \u00A0 ",
                    React.createElement("small", { className: "text-muted" }, ip));
            }
            else {
                content = id;
            }
        }
        return span(isLink, className, this.onClick, content);
    }
};
ServerSpan = __decorate([
    observer
], ServerSpan);
export { ServerSpan };
class ServerInfo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let server = store.cacheServers.get(this.props.id);
        let { discription, cloud, ip, unit, date_init, date_update } = server;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        this.rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: appIcon, main: discription, discription: ip }) },
            '',
            { type: 'component', label: '所有者', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true })) },
            { type: 'string', label: '云服务', name: 'cloud' },
        ];
        return React.createElement(Page, { header: '服务器 - 详细资料' },
            React.createElement(PropGrid, { rows: this.rows, values: this.props }));
    }
}
//# sourceMappingURL=serverSpan.js.map