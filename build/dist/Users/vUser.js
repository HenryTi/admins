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
import { VPage, Page } from "tonva-tools";
import { List } from 'tonva-react-form';
export class VUser extends VPage {
    constructor() {
        super(...arguments);
        this.page = observer(() => {
            let { curUser, curUserApps, onUserEditApps } = this.controller;
            let right = React.createElement("button", { className: "btn btn-sm btn-success", onClick: () => onUserEditApps() }, "\u589E\u51CFApp");
            return React.createElement(Page, { header: '用户 - ' + (curUser.assigned || curUser.nick || curUser.name), right: right },
                React.createElement(List, { items: curUserApps, item: { render: this.renderApp } }));
        });
        this.renderApp = (app, index) => {
            let { name, discription } = app;
            return React.createElement("div", { className: "px-3 py-2" },
                name,
                " ",
                discription);
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=vUser.js.map