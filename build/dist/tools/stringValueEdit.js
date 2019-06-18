var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, Page } from 'tonva-tools';
export class StringValueEdit extends React.Component {
    constructor(props) {
        super(props);
        /*
        private ref = (input:HTMLInputElement) => {
            if (!input) return;
            input.value = this.props.value || '';
            this.input = input;
        }*/
        this.onChange = (evt) => {
            let val = this.props.value;
            let org = val && val.trim();
            this.value = evt.currentTarget.value.trim();
            this.setState({
                disabled: org === this.value
            });
        };
        this.onSubmit = () => __awaiter(this, void 0, void 0, function* () {
            let val = this.props.value;
            let org = val && val.trim();
            let v = this.value; // this.input.value.trim();
            let onChanged = this.props.onChanged;
            if (onChanged !== undefined) {
                let ret = yield onChanged(v, org);
                if (typeof ret === 'string') {
                    this.setState({ error: ret });
                    return;
                }
                nav.pop();
            }
        });
        this.state = {
            disabled: true,
        };
    }
    renderControl() {
        return React.createElement("input", { className: "form-control w-100", type: "text", 
            // ref={this.ref}
            defaultValue: this.props.value, onChange: this.onChange });
    }
    render() {
        let { title, onChanged, buttonText, info, value } = this.props;
        let { disabled, error } = this.state;
        let right = React.createElement("button", { className: "btn btn-success btn-sm", disabled: disabled, onClick: this.onSubmit }, buttonText || '保存');
        let errorDiv;
        if (error !== undefined)
            errorDiv = React.createElement("div", { className: 'text-danger' }, error);
        return React.createElement(Page, { header: title, right: right },
            React.createElement("div", { className: "my-4 mx-3" },
                this.renderControl(),
                errorDiv,
                React.createElement("small", { className: "d-block mt-2 text-muted" }, info)));
    }
}
export class TextValueEdit extends StringValueEdit {
    constructor() {
        super(...arguments);
        /*
        private textArea:HTMLTextAreaElement;
        private refTextArea = (textArea:HTMLTextAreaElement) => {
            if (!textArea) return;
            textArea.value = this.props.value || '';
            this.textArea = textArea;
        }
        */
        this.onTextAreaChange = (evt) => {
            let val = this.props.value;
            let org = val && val.trim();
            this.value = evt.currentTarget.value.trim();
            this.setState({
                disabled: org === this.value
            });
        };
    }
    renderControl() {
        return React.createElement("textarea", { className: "form-control w-100", rows: 8, 
            // ref={this.refTextArea}
            defaultValue: this.props.value, onChange: this.onTextAreaChange });
    }
}
//# sourceMappingURL=stringValueEdit.js.map