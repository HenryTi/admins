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
import { observable } from 'mobx';
/*
export interface SearchBoxState {
    disabled: boolean;
}*/
export class SearchBox extends React.Component {
    constructor() {
        super(...arguments);
        this.key = null;
        /*
        constructor(props: SearchBoxProps) {
            super(props);
            this.state = {
                disabled: false,
            }
        }*/
        this.onChange = (evt) => {
            this.key = evt.target.value;
            if (this.key !== undefined) {
                this.key = this.key.trim();
                if (this.key === '')
                    this.key = undefined;
            }
            if (this.props.allowEmptySearch !== true) {
                this.disabled = !this.key;
            }
        };
        /*
        ref = (input: HTMLInputElement) => {
            this.input = input;
            this.key = this.props.initKey || '';
            if (input === null) return;
            input.value = this.key;
        }*/
        this.onSubmit = (evt) => __awaiter(this, void 0, void 0, function* () {
            evt.preventDefault();
            if (this.key === null)
                this.key = this.props.initKey || '';
            if (this.props.allowEmptySearch !== true) {
                if (!this.key)
                    return;
                if (this.input)
                    this.input.disabled = true;
            }
            yield this.props.onSearch(this.key);
            if (this.input)
                this.input.disabled = false;
        });
    }
    render() {
        let { className, inputClassName, label, placeholder, buttonText, maxLength, size } = this.props;
        let inputSize;
        switch (size) {
            default:
            case 'sm':
                inputSize = 'input-group-sm';
                break;
            case 'md':
                inputSize = 'input-group-md';
                break;
            case 'lg':
                inputSize = 'input-group-lg';
                break;
        }
        let lab;
        if (label !== undefined)
            lab = React.createElement("label", { className: "input-group-addon" }, label);
        return React.createElement("form", { className: className, onSubmit: this.onSubmit },
            React.createElement("div", { className: classNames("input-group", inputSize) },
                lab,
                React.createElement("input", { onChange: this.onChange, type: "text", name: "key", 
                    //ref={this.ref}
                    className: classNames('form-control', inputClassName || 'border-primary'), placeholder: placeholder, defaultValue: this.props.initKey, maxLength: maxLength }),
                React.createElement("div", { className: "input-group-append" },
                    React.createElement("button", { className: "btn btn-primary", type: "submit", disabled: this.disabled },
                        React.createElement("i", { className: 'fa fa-search' }),
                        React.createElement("i", { className: "fa" }),
                        buttonText))));
    }
}
__decorate([
    observable
], SearchBox.prototype, "disabled", void 0);
//# sourceMappingURL=searchBox.js.map