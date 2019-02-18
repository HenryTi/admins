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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
import { observable, computed } from 'mobx';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import { Page } from '../page';
import { nav } from '../nav';
import { inputFactory } from './inputSchema';
export class FormSchema {
    constructor(formFields, values) {
        this.errors = [];
        let { fields, onSumit, fieldTag, submitText, resetButton, clearButton } = formFields;
        this.initValues = values;
        this.fieldTag = fieldTag || 'div';
        this.submitText = submitText || '提交';
        if (resetButton === true)
            this.resetButton = '重来';
        else
            this.resetButton = resetButton;
        if (clearButton === true)
            this.clearButton = '清除';
        else
            this.clearButton = clearButton;
        this.submit = onSumit;
        this._inputs = {};
        this.inputs = [];
        this.hasLabel = false;
        for (let field of fields) {
            let name = field.name;
            /*
            if (values !== undefined) {
                let v = values[name];
                if (v !== undefined) field.defaultValue = v;
            }*/
            if (field.label !== undefined)
                this.hasLabel = true;
            let v = this._inputs[field.name] = inputFactory(this, field);
            this.inputs.push(v);
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onFinish = this.onFinish.bind(this);
        this.onNext = this.onNext.bind(this);
    }
    clear() {
        this.inputs.forEach(v => v.clear());
        this.errors.splice(0, this.errors.length);
    }
    reset() {
        this.inputs.forEach(v => v.reset());
        this.errors.splice(0, this.errors.length);
    }
    values() {
        let ret = {};
        for (let vi of this.inputs) {
            let v = vi.value;
            if (v === '')
                v = undefined;
            ret[vi.field.name] = v;
        }
        return ret;
    }
    get hasError() {
        return this.inputs.some(vi => vi.err !== undefined);
    }
    get notFilled() {
        let ret = this.inputs.every(vi => !vi.filled);
        console.log('not filled %s', ret);
        return ret;
    }
    $(name) { return this._inputs[name]; }
    removeInput(name) {
        let input = this._inputs[name];
        if (input !== undefined) {
            let index = this.inputs.findIndex(v => v === input);
            if (index >= 0)
                this.inputs.splice(index, 1);
        }
    }
    setInputError(name, err) {
        let input = this._inputs[name];
        if (input === undefined)
            return;
        input.err = err;
    }
    onReset() {
        this.reset();
    }
    onClear() {
        this.clear();
    }
    onSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            if (this.submit === undefined) {
                alert('no submit funciton defined');
                return;
            }
            for (let input of this.inputs) {
                let blur = input.props.onBlur;
                if (blur === undefined)
                    continue;
                blur();
            }
            let ret = yield this.submit(this.values());
            if (ret === undefined)
                return;
            //if (ret === undefined) {
            //    alert('no submit return');
            //    return;
            //}
            if (ret.success === true) {
                if (this.onSuccess !== undefined) {
                    this.onSuccess(ret.result);
                    return;
                }
            }
            else {
                if (this.onError !== undefined) {
                    this.onError(ret.result);
                    return;
                }
            }
            nav.push(React.createElement(ResultPage, { return: ret, onFinish: this.onFinish, onNext: this.onNext }));
        });
    }
    onFinish() {
        nav.pop();
    }
    onNext() {
        this.clear();
    }
    fieldContainerClassNames() {
        return classNames(this.hasLabel ? 'col-sm-10' : 'col-sm-12');
    }
    setInputValues() {
        if (this.initValues === undefined)
            return;
        for (let i in this._inputs) {
            let v = this.initValues[i];
            if (v !== undefined)
                this._inputs[i].setInitValue(v);
        }
    }
    renderInput(vInput) {
        switch (vInput.field.type) {
            default: return this.renderString(vInput);
            case 'checkbox': return this.renderCheckBox(vInput);
            case 'text': return this.renderTextArea(vInput);
        }
    }
    renderString(vInput) {
        let { err } = vInput;
        let cn = classNames('form-control', 'has-success', err ? 'is-invalid' : 'is-valid');
        return React.createElement("input", Object.assign({ className: cn }, vInput.props));
    }
    renderTextArea(vInput) {
        let { err } = vInput;
        let _a = vInput.props, { value, inputtag } = _a, attributes = __rest(_a, ["value", "inputtag"]);
        let cn = classNames('form-control', 'has-success', err ? 'is-invalid' : 'is-valid');
        return React.createElement("textarea", Object.assign({ className: cn }, attributes), vInput.value);
    }
    renderCheckBox(vInput) {
        let { props, field, value } = vInput;
        return React.createElement("label", { className: 'form-check-label h-100 align-items-center d-flex bg-light' },
            React.createElement("input", { type: 'checkbox', className: 'form-check-input position-static ml-0', name: field.name, checked: vInput.value === 1, onChange: props.onChange, ref: props.ref }));
    }
    renderLabel(vInput) {
        if (this.hasLabel === false)
            return null;
        return React.createElement("label", { className: 'col-sm-2 col-form-label' }, vInput !== undefined ? vInput.label : null);
    }
    renderErr(vInput) {
        return React.createElement("div", { className: "invalid-feedback" }, vInput.err);
    }
    renderField(vInput) {
        return React.createElement("div", { className: 'form-group row', key: vInput.id },
            this.renderLabel(vInput),
            React.createElement("div", { className: this.fieldContainerClassNames() },
                this.renderInput(vInput),
                vInput.err && this.renderErr(vInput)));
    }
    renderSeperator(vInput) {
        return null;
        //return <hr key={_.uniqueId()} style={{margin:'20px 0px'}} />;
    }
    renderSumit() {
        let cn = classNames('btn', 'btn-primary', this.hasLabel ? undefined : 'btn-block');
        return React.createElement("button", { className: cn, key: _.uniqueId(), type: 'submit', disabled: this.notFilled || this.hasError }, this.submitText);
    }
    renderReset() {
        return React.createElement("button", { className: 'btn btn-secondary"', key: _.uniqueId(), type: 'button', onClick: this.onReset }, this.resetButton);
    }
    renderClear() {
        return React.createElement("button", { className: 'btn btn-secondary"', key: _.uniqueId(), type: 'button', onClick: this.onClear }, this.clearButton);
    }
    renderFormErrors() {
        if (this.errors.length === 0)
            return null;
        return React.createElement("div", { className: 'form-group row' },
            React.createElement("div", { className: this.fieldContainerClassNames() },
                this.renderLabel(undefined),
                this.errors.map(e => React.createElement("div", { className: 'invalid-feedback', style: { display: 'block' } }, e))));
    }
    renderButtons() {
        if (this.hasLabel === true) {
            return React.createElement("div", { className: 'form-group row', key: _.uniqueId() },
                this.renderLabel(undefined),
                React.createElement("div", { className: this.fieldContainerClassNames() },
                    React.createElement("div", { className: "row container" },
                        React.createElement("div", { className: "col-auto mr-auto" }, this.renderSumit()),
                        React.createElement("div", { className: "col-auto" }, this.clearButton && this.renderClear()),
                        React.createElement("div", { className: "col-auto" }, this.resetButton && this.renderReset()))));
        }
        return React.createElement("div", { className: 'form-group row', key: _.uniqueId() },
            React.createElement("div", { className: this.fieldContainerClassNames() }, this.renderSumit()),
            this.clearButton ? React.createElement("div", { className: "col-auto" }, "this.renderClear()") : null,
            this.resetButton ? React.createElement("div", { className: "col-auto" }, "this.renderReset()") : null);
    }
}
__decorate([
    observable
], FormSchema.prototype, "errors", void 0);
__decorate([
    computed
], FormSchema.prototype, "hasError", null);
__decorate([
    computed
], FormSchema.prototype, "notFilled", null);
class ResultPage extends React.Component {
    render() {
        let { return: ret, onNext, onFinish } = this.props;
        let { success, message, result } = ret;
        if (message === undefined) {
            message = success === true ? '提交成功' : '提交发生错误';
        }
        return React.createElement(Page, { back: "close" },
            React.createElement("div", { className: 'jumbotron' },
                React.createElement("div", { className: 'lead' }, message),
                React.createElement("p", null, JSON.stringify(result)),
                React.createElement("hr", { className: "my-4" }),
                React.createElement("div", { className: 'lead' },
                    React.createElement("button", { className: 'btn btn-primary mr-2', type: 'button', onClick: () => { nav.pop(); onFinish(); } }, "\u5B8C\u6210"),
                    React.createElement("button", { className: 'btn btn-default mr-2', type: 'button', onClick: () => { nav.pop(); onNext(); } }, "\u7EE7\u7EED"))));
    }
}
//# sourceMappingURL=formSchema.js.map