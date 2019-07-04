var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VPage, Page } from 'tonva';
import { List, LMR, Muted, FA } from 'tonva';
import { NewPage } from './editPage';
import { store } from 'store';
export class ListPage extends VPage {
    constructor() {
        super(...arguments);
        this.newItem = () => {
            this.controller.uq = undefined;
            this.openVPage(NewPage);
        };
        this.page = () => {
            let { uqList: list, listRowClick } = this.controller;
            let { isOwner } = store.unit;
            let right = isOwner > 0 && React.createElement("button", { className: 'btn btn-secondary btn-sm', onClick: () => this.newItem() },
                React.createElement(FA, { name: "plus" }));
            return React.createElement(Page, { header: "UQ", right: right },
                React.createElement(List, { items: list, item: { render: this.listRow, onClick: listRowClick } }));
        };
        this.listRow = (item) => {
            let { name, discription, service_count } = item;
            return React.createElement(LMR, { className: "py-1 px-3 align-items-center", left: React.createElement(FA, { name: "database", className: "text-primary fa-lg" }), right: React.createElement(React.Fragment, null, service_count) },
                React.createElement("div", { className: "py-2 px-3" },
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
//# sourceMappingURL=listPage.js.map