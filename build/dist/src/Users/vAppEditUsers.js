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
import { List, LMR, Muted } from 'tonva';
export class VAppEditUsers extends VPage {
    constructor() {
        super(...arguments);
        this.page = observer(() => {
            let { curApp, appEditUsers, onAppEditUsers } = this.controller;
            return React.createElement(Page, { header: curApp.name + ' - 增减用户' },
                React.createElement(List, { items: appEditUsers, item: { render: this.renderUser } }));
        });
        this.renderUser = (editUser, index) => {
            let { name, nick, assigned, bind } = editUser;
            let content;
            if (assigned)
                content = React.createElement(React.Fragment, null,
                    assigned,
                    " ",
                    React.createElement(Muted, null, name));
            else if (nick)
                content = React.createElement(React.Fragment, null,
                    nick,
                    " ",
                    React.createElement(Muted, null, name));
            else
                content = React.createElement(React.Fragment, null, name);
            let right = React.createElement("input", { type: "checkbox", defaultChecked: bind === 1, onChange: (evt) => this.onUserChanged(editUser, evt.target.checked) });
            return React.createElement(LMR, { className: "px-3 py-2 align-items-center", right: right }, content);
        };
        this.onUserChanged = (editUser, checked) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller.bindAppUser(editUser, checked);
            editUser.bind = checked === true ? 1 : 0;
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=vAppEditUsers.js.map