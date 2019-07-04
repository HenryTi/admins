var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import classNames from 'classnames';
import { observable } from 'mobx';
import { Widget } from './widget';
export class SelectWidget extends Widget {
    constructor() {
        super(...arguments);
        this.onInputChange = (evt) => {
            this.setDataValue(evt.target.value);
        };
    }
    setElementValue(value) { this.select.value = value; }
    setReadOnly(value) { this.select.disabled = this.readOnly = !value; }
    setDisabled(value) { this.select.disabled = this.disabled = value; }
    render() {
        if (this.readOnly === true) {
            let option = this.ui.list.find(v => v.value === this.value);
            let title = (option === undefined) ? '(???)' : option.title;
            return React.createElement("span", { className: "form-control w-min-6c" }, title);
        }
        return React.createElement("select", { ref: (select) => this.select = select, className: classNames(this.className, 'form-control'), defaultValue: this.defaultValue, onChange: this.onInputChange }, this.ui.list.map((v, index) => {
            let { title, value } = v;
            let cn;
            //if (value === undefined || value === null) cn = 'text-light small';
            //else cn = 'text-danger';
            return React.createElement("option", { className: cn, key: index, value: value }, title || value);
        }));
    }
}
__decorate([
    observable
], SelectWidget.prototype, "readOnly", void 0);
//# sourceMappingURL=selectWidget.js.map