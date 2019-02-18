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
import { List, LMR } from 'tonva-react-form';
export class VUserEditApps extends VPage {
    constructor() {
        super(...arguments);
        this.page = observer(() => {
            let { curUser, userEditApps, onUserEditApps } = this.controller;
            return React.createElement(Page, { header: (curUser.assigned || curUser.nick || curUser.name) + ' - 增减App' },
                React.createElement(List, { items: userEditApps, item: { render: this.renderApp } }));
        });
        this.renderApp = (editApp, index) => {
            let { name, discription, bind } = editApp;
            let right = React.createElement("input", { type: "checkbox", defaultChecked: bind === 1, onChange: (evt) => this.onAppChanged(editApp, evt.target.checked) });
            return React.createElement(LMR, { className: "px-3 py-2", right: right },
                name,
                " ",
                discription);
        };
        this.onAppChanged = (editApp, checked) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller.bindUserApp(editApp, checked);
            editApp.bind = checked === true ? 1 : 0;
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=vUserEditApps.js.map