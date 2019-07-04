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
import { VPage, Page } from 'tonva';
import { List } from 'tonva';
export class VApp extends VPage {
    constructor() {
        super(...arguments);
        this.page = observer(() => {
            let { curApp, curAppUsers, onAppEditUsers } = this.controller;
            let right = React.createElement("button", { className: "btn btn-sm btn-success", onClick: () => onAppEditUsers() }, "\u589E\u51CF\u7528\u6237");
            return React.createElement(Page, { header: 'App - ' + (curApp.name), right: right },
                React.createElement(List, { items: curAppUsers, item: { render: this.renderApp } }));
        });
        this.renderApp = (user, index) => {
            let { name, nick, assigned } = user;
            let content;
            if (assigned)
                content = React.createElement("span", null,
                    assigned,
                    " \u00A0 ",
                    React.createElement("small", { className: "text-muted" }, name));
            else if (nick)
                content = React.createElement("span", null,
                    nick,
                    " \u00A0 ",
                    React.createElement("small", { className: "text-muted" }, name));
            else
                content = React.createElement(React.Fragment, null, name);
            return React.createElement("div", { className: "px-3 py-2" }, content);
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=vApp.js.map