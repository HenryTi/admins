var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Page } from 'tonva-tools';
import { FA } from 'tonva-react-form';
import { VSheet } from "./vSheet";
export class VSheetSaved extends VSheet {
    constructor() {
        super(...arguments);
        this.restart = () => __awaiter(this, void 0, void 0, function* () {
            this.ceasePage();
            yield this.event('new');
        });
        this.actionClick = (action) => __awaiter(this, void 0, void 0, function* () {
            this.ceasePage();
            let { id, flow, state } = this.brief;
            let res = yield this.controller.action(id, flow, state, action.name);
            this.openPage(this.acted);
        });
        this.buttons = React.createElement(React.Fragment, null,
            React.createElement("button", { className: "btn btn-outline-primary mr-3", onClick: this.restart }, "\u7EE7\u7EED\u5F00\u5355"),
            React.createElement("button", { className: "btn btn-outline-info", onClick: () => this.backPage() }, "\u8FD4\u56DE"));
        this.view = () => {
            let { states } = this.entity;
            const state = '$';
            let s = states.find(v => v.name === state);
            let actionButtons = React.createElement(React.Fragment, null, s.actions.map((v, index) => React.createElement("button", { key: index, className: "btn btn-primary mr-3", onClick: () => this.actionClick(v) }, this.controller.getActionLabel(state, v.name))));
            return React.createElement(Page, { header: "\u5DF2\u4FDD\u5B58", back: "close" },
                React.createElement("div", { className: "p-3 d-flex flex-column align-items-center" },
                    React.createElement("div", { className: "text-success" },
                        React.createElement(FA, { name: "check-circle-o" }),
                        " \u5355\u636E\u5DF2\u4FDD\u5B58\uFF01\u7CFB\u7EDF\u5C1A\u672A\u5904\u7406"),
                    React.createElement("div", { className: "p-3" },
                        actionButtons,
                        this.buttons)));
        };
        this.acted = () => {
            return React.createElement(Page, null,
                React.createElement("div", { className: "p-3 d-flex flex-column align-items-center" },
                    React.createElement("div", { className: "text-success" },
                        React.createElement(FA, { name: "check-circle-o" }),
                        " \u5355\u636E\u5DF2\u5904\u7406\uFF01"),
                    React.createElement("div", { className: "p-3" }, this.buttons)));
        };
    }
    open(brief) {
        return __awaiter(this, void 0, void 0, function* () {
            this.brief = brief;
            this.openPage(this.view);
        });
    }
}
//# sourceMappingURL=vSaved.js.map