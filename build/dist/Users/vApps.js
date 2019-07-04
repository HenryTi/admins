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
import { List, SearchBox, LMR, FA } from 'tonva';
export class VApps extends VPage {
    constructor() {
        super(...arguments);
        this.renderRow = (appUsers, index) => {
            let { app, users } = appUsers;
            let { id, name, discription } = app;
            let right = React.createElement("small", { className: "text-muted" }, discription);
            return React.createElement("div", { className: "d-block px-3 py-2" },
                React.createElement(LMR, { className: "mb-2", right: right },
                    React.createElement(FA, { name: "address-card-o", className: "text-primary mr-3" }),
                    React.createElement("b", null, name)),
                React.createElement("div", null,
                    React.createElement("small", { className: "text-muted" }, "\u7528\u6237: "),
                    users.length === 0 ? '[无]' : users.map(u => u.assigned || u.nick || u.name).join(', ')));
        };
        this.page = observer(() => {
            let { appUsersList, searchApp, onAppsClick } = this.controller;
            let searchBox = React.createElement(SearchBox, { className: "w-100 pr-1", onSearch: searchApp, placeholder: "\u641C\u7D22App", allowEmptySearch: true });
            return React.createElement(Page, { header: searchBox },
                React.createElement(List, { items: appUsersList, item: { render: this.renderRow, onClick: onAppsClick, key: (item => item.app.id) } }));
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=vApps.js.map