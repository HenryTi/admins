var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VPage, Page, nav } from "tonva-tools";
import { LMR } from 'tonva-react-form';
export class UqBindPage extends VPage {
    constructor() {
        super(...arguments);
        this.onCheckChanged = (evt) => {
            let { target } = evt;
            this.accessChecked[target.name] = target.checked;
        };
        this.saveUqBind = () => __awaiter(this, void 0, void 0, function* () {
            let acc = [];
            if (this.accesses) {
                for (let i in this.accessChecked) {
                    if (this.accessChecked[i] === true)
                        acc.push(i);
                }
            }
            yield this.controller.saveUqBind(this.uqAccess.uq, acc);
            nav.pop();
        });
        this.removeUqBind = () => __awaiter(this, void 0, void 0, function* () {
            yield this.controller.removeUqBind(this.uqAccess.uq);
            nav.pop();
        });
        this.page = () => {
            let { uq, bind_access } = this.uqAccess;
            let { owner, name, discription, access } = uq;
            let btnDelete;
            if (bind_access !== null && bind_access !== undefined) {
                btnDelete = React.createElement("button", { className: "btn btn-outline-danger btn-sm", onClick: this.removeUqBind }, "\u53D6\u6D88\u5173\u8054");
            }
            let checkAccessList;
            if (this.accesses) {
                checkAccessList = React.createElement("div", { className: "mt-3" }, this.accesses.map(v => {
                    let checked = this.accessChecked[v];
                    return React.createElement("label", { key: v, className: "d-inline-block mr-4" },
                        React.createElement("input", { onChange: this.onCheckChanged, style: { width: '1.1rem', height: '1.1rem' }, name: v, type: "checkbox", defaultChecked: checked }),
                        "\u00A0",
                        v);
                }));
            }
            return React.createElement(Page, { header: "\u5173\u8054UQ" },
                React.createElement("div", { className: "m-3 py-3 px-3 bg-white border" },
                    React.createElement("div", null,
                        owner,
                        " / ",
                        name),
                    React.createElement("div", { className: "text-muted" }, discription),
                    checkAccessList,
                    React.createElement(LMR, { className: "pt-3", right: btnDelete },
                        React.createElement("button", { className: "btn btn-primary btn-sm", onClick: this.saveUqBind }, "\u4FDD\u5B58\u5173\u8054"))));
        };
    }
    open(uqAccess) {
        return __awaiter(this, void 0, void 0, function* () {
            this.uqAccess = uqAccess;
            let { uq, bind_access } = this.uqAccess;
            let { access } = uq;
            if (access) {
                this.accessChecked = {};
                this.accesses = access.split(',');
                for (let acc of this.accesses) {
                    this.accessChecked[acc] = (bind_access && bind_access.find(bc => bc === acc)) !== undefined;
                }
            }
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=uqBindPage.js.map