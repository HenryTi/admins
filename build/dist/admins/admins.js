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
import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
import { nav, Page, ListView } from 'tonva-tools';
import consts from '../consts';
import { mainData } from '../store';
let UnitAdminsView = class UnitAdminsView extends React.Component {
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            //await mainData.loadUnitAdmins();
        });
    }
    converter(admin) {
        return {
            key: admin.id,
            date: undefined,
            main: admin.name,
            vice: admin.nick,
            icon: admin.icon || consts.appItemIcon,
            right: React.createElement("aside", null, "ddd")
            //unread: 0,
        };
    }
    render() {
        let me = nav.local.user.get().id;
        let list = mainData.unitAdmins && mainData.unitAdmins.sort((a, b) => {
            if (a.isOwner === 1)
                if (b.isOwner === 1)
                    return a.id < b.id ? -1 : 1;
                else
                    return -1;
            if (b.isOwner === 1)
                return -1;
            return a.id < b.id ? -1 : 1;
        });
        return React.createElement(Page, { header: " - 小号管理组" },
            React.createElement(ListView, { items: list, converter: this.converter }),
            React.createElement(Card, null,
                React.createElement(CardHeader, null, "\u8BF4\u660E"),
                React.createElement(CardBody, null,
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement(CardText, null, "\u7BA1\u7406\u7EC4\u5305\u62EC\u4E3B\u4EBA\uFF0C\u9AD8\u7BA1\uFF0C\u7BA1\u7406\u5458\u548C\u6210\u5458")),
                        React.createElement("li", null,
                            React.createElement(CardText, null, "\u4E3B\u4EBA\u53EF\u4EE5\u589E\u51CF\u9AD8\u7BA1\u548C\u7BA1\u7406\u5458")),
                        React.createElement("li", null,
                            React.createElement(CardText, null, "\u9AD8\u7BA1\u53EF\u4EE5\u589E\u51CF\u7BA1\u7406\u5458")),
                        React.createElement("li", null,
                            React.createElement(CardText, null, "\u7BA1\u7406\u5458\u53EF\u4EE5\u589E\u51CF\u7BA1\u7406\u7528\u6237\u4EE5\u53CA\u673A\u6784\u7684\u5F00\u53D1\u7B49"))))));
    }
};
UnitAdminsView = __decorate([
    observer
], UnitAdminsView);
export default UnitAdminsView;
//# sourceMappingURL=admins.js.map