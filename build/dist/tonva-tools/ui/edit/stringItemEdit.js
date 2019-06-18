var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav } from '../nav';
import { Page } from '../page';
import { observer } from 'mobx-react';
import { ItemEdit } from './itemEdit';
export class StringItemEdit extends ItemEdit {
    constructor() {
        super(...arguments);
        this.onChange = (evt) => {
            this.newValue = evt.target.value;
            let preValue = this.value;
            this.isChanged = (this.newValue != preValue);
        };
        this.onBlur = (evt) => {
            this.verifyValue();
        };
        this.onFocus = () => {
            this.error = undefined;
        };
        this.page = observer((props) => {
            let { resolve, reject } = props;
            let right = React.createElement("button", { className: "btn btn-sm btn-success", disabled: !this.isChanged, onClick: () => {
                    this.verifyValue();
                    if (this.error === undefined)
                        resolve(this.newValue);
                } }, "\u4FDD\u5B58");
            return React.createElement(Page, { header: '更改' + this.label, right: right },
                React.createElement("div", { className: "m-3" },
                    React.createElement("input", { type: "text", onChange: this.onChange, onBlur: this.onBlur, onFocus: this.onFocus, className: "form-control", defaultValue: this.value }),
                    this.uiItem && React.createElement("div", { className: "small muted m-2" }, this.uiItem.placeholder),
                    this.error && React.createElement("div", { className: "text-danger" }, this.error)));
        });
    }
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let element = React.createElement(this.page, { resolve: resolve, reject: reject });
                nav.push(element, reject);
            });
        });
    }
}
//# sourceMappingURL=stringItemEdit.js.map