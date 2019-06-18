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
import { store } from '../store';
import { span } from './span';
let UnitSpan = class UnitSpan extends React.Component {
    constructor() {
        super(...arguments);
        this.onClick = (evt) => {
            evt.preventDefault();
            nav.push(React.createElement(UnitInfo, { id: this.props.id }));
            return false;
        };
    }
    render() {
        let { id, isLink, className } = this.props;
        if (id === undefined)
            return null;
        let unit = store.cacheUnits.get(id);
        let content;
        let { name, nick, discription } = unit;
        let disc = discription && '- ' + discription;
        if (nick) {
            content = React.createElement(React.Fragment, null,
                nick,
                " \u00A0 ",
                React.createElement("small", { className: "text-muted" },
                    name,
                    " ",
                    disc));
        }
        else if (name) {
            content = React.createElement(React.Fragment, null,
                name,
                " \u00A0 ",
                React.createElement("small", { className: "text-muted" }, disc));
        }
        else {
            content = id;
        }
        return span(isLink, className, this.onClick, content);
    }
};
UnitSpan = __decorate([
    observer
], UnitSpan);
export { UnitSpan };
let UnitName = class UnitName extends React.Component {
    render() {
        let { id, isLink, className } = this.props;
        if (id === undefined)
            return null;
        let unit = store.cacheUnits.get(id);
        let { name } = unit;
        return React.createElement(React.Fragment, null, name);
    }
};
UnitName = __decorate([
    observer
], UnitName);
export { UnitName };
class UnitInfo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let unit = store.cacheUnits.get(this.props.id);
        let { name, nick, icon, discription } = unit;
        this.rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: icon, main: name, discription: discription }) },
            '',
        ];
        return React.createElement(Page, { header: '小号 - 详细资料' },
            React.createElement(PropGrid, { rows: this.rows, values: this.props }));
    }
}
//# sourceMappingURL=unitSpan.js.map