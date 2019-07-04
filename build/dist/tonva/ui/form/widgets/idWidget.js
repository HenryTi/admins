var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
import { observable } from 'mobx';
export class IdWidget extends Widget {
    constructor() {
        super(...arguments);
        this.onClick = () => __awaiter(this, void 0, void 0, function* () {
            let pickId = this.ui && this.ui.pickId;
            if (pickId === undefined) {
                alert('no pickId defined!');
                return;
            }
            let id = yield pickId(this.context, this.name, this.value);
            this.setDataValue(id);
            this.clearError();
            this.clearContextError();
            this.checkRules();
        });
    }
    setReadOnly(value) { this.readOnly = value; }
    setDisabled(value) { this.disabled = value; }
    render() {
        let placeholder, Templet;
        if (this.ui !== undefined) {
            placeholder = this.ui.placeholder;
            Templet = this.ui.Templet;
        }
        let cn = {
            'form-control': true,
            'required-item': this.itemSchema.required === true,
            'cursor-pointer': true,
            'is-invalid': this.hasError,
        };
        let content;
        if (this.value === undefined || this.value === null) {
            content = placeholder || 'placeholder';
            cn['text-muted'] = true;
        }
        else if (Templet === undefined) {
            content = React.createElement(React.Fragment, null, this.value);
        }
        else if (typeof Templet === 'function') {
            content = Templet(this.value);
        }
        else {
            content = Templet;
        }
        return React.createElement(React.Fragment, null,
            React.createElement("div", { className: classNames(cn), onClick: this.onClick }, content),
            this.renderErrors());
    }
}
__decorate([
    observable
], IdWidget.prototype, "value", void 0);
//# sourceMappingURL=idWidget.js.map