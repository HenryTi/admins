var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { Media, PropGrid } from 'tonva';
import { nav, Page } from 'tonva';
import { appIcon } from 'consts';
import { store } from 'store';
import { IdDates } from './idDates';
import { span } from './span';
import { UnitSpan } from './unitSpan';
let UqSpan = class UqSpan extends React.Component {
    constructor() {
        super(...arguments);
        this.onClick = (evt) => {
            evt.preventDefault();
            nav.push(React.createElement(UqInfo, { id: this.props.id }));
            return false;
        };
    }
    render() {
        let { id, className, isLink } = this.props;
        let api = store.cacheUqs.get(id);
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
        return span(isLink, className, this.onClick, content);
    }
};
UqSpan = __decorate([
    observer
], UqSpan);
export { UqSpan };
let UqInfo = class UqInfo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let uq = store.cacheUqs.get(this.props.id);
        let { name, discription, unit, date_init, date_update } = uq;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        this.rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: appIcon, main: name, discription: disp }) },
            '',
            { type: 'component', label: '所有者', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true })) },
        ];
        return React.createElement(Page, { header: 'UQ - 详细资料' },
            React.createElement(PropGrid, { rows: this.rows, values: this.props }));
    }
};
UqInfo = __decorate([
    observer
], UqInfo);
//# sourceMappingURL=uqSpan.js.map