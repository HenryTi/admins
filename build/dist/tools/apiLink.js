var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observer } from 'mobx-react';
import * as className from 'classnames';
import { Media, PropGrid } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import consts from '../consts';
import { store } from '../store';
import { IdDates } from './idDates';
import { UnitLink } from './unitLink';
let ApiLink = class ApiLink extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    componentWillMount() {
        let { id } = this.props;
        store.cacheApis.get(id);
    }
    onClick(evt) {
        evt.preventDefault();
        nav.push(React.createElement(ApiInfo, { id: this.props.id }));
        return false;
    }
    render() {
        let { id } = this.props;
        let api = store.cacheApis.get(id);
        let content;
        if (api === null) {
            content = id;
        }
        else {
            let { name, discription } = api;
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
        return React.createElement("a", { className: className(this.props.className), href: "#", onClick: this.onClick }, content);
    }
};
ApiLink = __decorate([
    observer
], ApiLink);
export { ApiLink };
let ApiInfo = class ApiInfo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let api = store.cacheApis.get(this.props.id);
        let { name, discription, unit, date_init, date_update } = api;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        this.rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: consts.appIcon, main: name, discription: disp }) },
            '',
            { type: 'component', label: '所有者', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitLink, { id: unit })) },
        ];
        return React.createElement(Page, { header: 'API - 详细资料' },
            React.createElement(PropGrid, { rows: this.rows, values: this.props }));
    }
};
ApiInfo = __decorate([
    observer
], ApiInfo);
//# sourceMappingURL=apiLink.js.map