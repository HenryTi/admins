var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VPage, Page, Image } from "tonva-tools";
import { List, LMR, Badge, Muted, FA } from 'tonva-react-form';
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
            let { name, caption, discription, icon, url, urlDebug } = item;
            let left = React.createElement(Badge, { size: "sm" },
                React.createElement(Image, { src: icon }));
            let right = React.createElement("div", { className: "text-muted small text-right" },
                url || '-',
                React.createElement("br", null),
                urlDebug);
            let spanCaption = caption ?
                React.createElement(React.Fragment, null,
                    name,
                    ": ",
                    React.createElement("b", null, caption)) :
                React.createElement("b", null, name);
            return React.createElement(LMR, { className: "py-2 px-3 align-items-stretch", left: left, right: right },
                React.createElement("div", { className: "px-3" },
                    React.createElement("div", null, spanCaption),
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