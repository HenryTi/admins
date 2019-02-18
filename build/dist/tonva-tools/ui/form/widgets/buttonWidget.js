var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Unknown } from './unknown';
import { Widget } from './widget';
import { observer } from 'mobx-react';
export class ButtonWidget extends Widget {
    constructor() {
        super(...arguments);
        this.onClick = () => __awaiter(this, void 0, void 0, function* () {
            this.clearError();
            this.clearContextError();
            let { name, type } = this.itemSchema;
            if (type === 'submit') {
                this.context.checkRules();
                if (this.context.hasError === true) {
                    return;
                }
            }
            let { onButtonClick } = this.context.form.props;
            if (onButtonClick === undefined) {
                alert(`button ${name} clicked. you should define form onButtonClick`);
                return;
            }
            let ret = yield onButtonClick(name, this.context);
            if (ret === undefined)
                return;
            this.context.setError(name, ret);
        });
        this.observerRender = observer(() => {
            let { name, type } = this.itemSchema;
            let Templet, cn, label;
            if (this.ui !== undefined) {
                let { widget: widgetType } = this.ui;
                if (widgetType !== 'button')
                    return Unknown(type, widgetType, ['button']);
                Templet = this.ui.Templet;
                cn = this.ui.className;
                label = this.ui.label;
            }
            let { form, hasError } = this.context;
            let context = this.context;
            let disabled = type === 'submit' && hasError;
            let content;
            if (this.children !== undefined)
                content = this.children;
            else if (typeof Templet === 'function')
                content = Templet();
            else if (Templet !== undefined)
                content = Templet;
            else
                content = label;
            let button = React.createElement("button", { className: cn, type: "button", disabled: disabled, onClick: this.onClick }, content || name);
            if (context.inNode === true)
                return React.createElement(React.Fragment, null,
                    button,
                    this.renderErrors());
            return React.createElement("div", { className: form.ButtonClass },
                React.createElement("div", null, this.renderErrors()),
                button);
        });
    }
    render() {
        return React.createElement(this.observerRender, null);
    }
    renderContainer() {
        if (this.visible === false)
            return null;
        let { form, inNode } = this.context;
        if (inNode === true)
            return this.render();
        return form.FieldContainer(null, this.render());
    }
}
//# sourceMappingURL=buttonWidget.js.map