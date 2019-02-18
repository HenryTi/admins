var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VPage, Page } from "tonva-tools";
import { List, LMR, Badge, Muted, FA } from 'tonva-react-form';
import { appItemIcon } from 'consts';
import { NewPage } from './editPage';
export class AppsPage extends VPage {
    constructor() {
        super(...arguments);
        this.newItem = () => {
            this.openVPage(NewPage);
        };
        this.page = () => {
            let { appList, listRowClick } = this.controller;
            let right = React.createElement("button", { className: 'btn btn-secondary btn-sm', onClick: () => this.newItem() },
                React.createElement(FA, { name: "plus" }));
            return React.createElement(Page, { header: "App", right: right },
                React.createElement(List, { items: appList, item: { render: this.appRow, onClick: listRowClick } }));
        };
        this.appRow = (item) => {
            let { name, discription, url, urlDebug } = item;
            let icon = appItemIcon;
            let left = React.createElement(Badge, { size: "sm", className: "pt-1" },
                React.createElement("img", { src: icon }));
            let right = React.createElement("div", { className: "text-muted small text-right" },
                url || '-',
                React.createElement("br", null),
                urlDebug);
            return React.createElement(LMR, { className: "py-1 px-3 align-items-stretch", left: left, right: right },
                React.createElement("div", { className: "px-3" },
                    React.createElement("div", null,
                        React.createElement("b", null, name)),
                    React.createElement("div", null,
                        React.createElement(Muted, null, discription))));
        };
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=appsPage.js.map