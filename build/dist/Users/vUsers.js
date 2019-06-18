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
import { List, SearchBox, FA } from 'tonva-react-form';
export class VUsers extends VPage {
    constructor() {
        super(...arguments);
        this.renderRow = (userApps, index) => {
            let { user, apps } = userApps;
            let { id, name, nick, icon, assigned } = user;
            return React.createElement("div", { className: "d-block px-3 py-2" },
                React.createElement("div", { className: "mb-2" },
                    React.createElement(FA, { name: "user-o", className: "text-primary mr-3" }),
                    React.createElement("b", null, assigned || nick || name)),
                React.createElement("div", null,
                    React.createElement("small", { className: "text-muted" }, "App: "),
                    apps.length === 0 ? '[无]' : apps.map(a => a.name).join(', ')));
        };
        this.page = observer(() => {
            let { userAppsList, searchUser, onUsersClick } = this.controller;
            let searchBox = React.createElement(SearchBox, { className: "w-100 pr-1", onSearch: searchUser, placeholder: "\u641C\u7D22\u7528\u6237", allowEmptySearch: true });
            return React.createElement(Page, { header: searchBox },
                React.createElement(List, { items: userAppsList, item: { render: this.renderRow, onClick: onUsersClick, key: (item => item.user.id) } }));
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=vUsers.js.map