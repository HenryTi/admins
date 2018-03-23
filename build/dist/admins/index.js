var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, Page, ListView } from 'tonva-tools';
import { mainData } from '../store';
import UnitAdminsView from './admins';
const iconStyle = { color: '#7f7fff', margin: '6px 0' };
const iconFont = (name) => React.createElement("i", { style: iconStyle, className: 'fa fa-lg fa-' + name });
export default class UnitMan extends React.Component {
    constructor(props) {
        super(props);
        this.items = [
            {
                main: '管理员',
                right: '增删管理员',
                icon: iconFont('universal-access'),
                onClick: () => nav.push(React.createElement(UnitAdminsView, null))
            },
            {
                main: '用户',
                right: '增删用户',
                icon: iconFont('users'),
                onClick: () => nav.push(React.createElement(UnitAdminsView, null))
            },
            {
                main: '开发',
                right: 'api, app, server 等资源',
                icon: iconFont('laptop'),
                onClick: () => nav.push(React.createElement(UnitAdminsView, null))
            }
        ];
        //if (this.props.isOwner === 0) this.items.shift();
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainData.loadUnit();
        });
    }
    converter(item) {
        item.key = item.main;
        return item;
    }
    render() {
        let unit = mainData.unit;
        let title = '管理小号';
        let header = title, top;
        if (unit !== undefined) {
            header = title + ' - ' + (unit.nick || unit.name);
            top = React.createElement("div", null,
                React.createElement("p", null, unit.name),
                React.createElement("p", null, unit.nick),
                React.createElement("p", null, unit.discription),
                React.createElement("p", null, unit.icon));
        }
        return React.createElement(Page, { header: header, debugLogout: true },
            top,
            React.createElement(ListView, { items: this.items, converter: this.converter }));
    }
}
//# sourceMappingURL=index.js.map