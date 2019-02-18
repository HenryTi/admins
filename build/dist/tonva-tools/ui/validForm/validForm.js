var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import * as classNames from 'classnames';
import { observer } from 'mobx-react';
let ValidForm1 = class ValidForm1 extends React.Component {
    componentDidMount() {
        this.props.formSchema.setInputValues();
    }
    render() {
        let { className, children, formSchema } = this.props;
        let content;
        if (children === undefined) {
            let sep;
            content = [];
            formSchema.inputs.forEach((v, index) => {
                sep = formSchema.renderSeperator(v);
                if (sep !== null)
                    content.push(sep);
                content.push(formSchema.renderField(v));
            });
            sep = formSchema.renderSeperator();
            if (sep !== null)
                content.push(sep);
            content.push(formSchema.renderButtons());
            let errors = formSchema.renderFormErrors();
            if (errors !== null)
                content.push(errors);
        }
        else
            content = children;
        return React.createElement("div", { className: classNames('container', className) },
            React.createElement("form", { onSubmit: formSchema.onSubmit }, content));
    }
};
ValidForm1 = __decorate([
    observer
], ValidForm1);
export { ValidForm1 };
//# sourceMappingURL=validForm.js.map