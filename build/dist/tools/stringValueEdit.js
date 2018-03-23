var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Button } from 'reactstrap';
import { nav, Page } from 'tonva-tools';
export class StringValueEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
        };
        this.ref = this.ref.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    ref(input) {
        if (!input)
            return;
        input.value = this.props.value || '';
        this.input = input;
    }
    onChange(evt) {
        let val = this.props.value;
        let org = val && val.trim();
        let v = evt.currentTarget.value.trim();
        this.setState({
            disabled: org === v
        });
    }
    onSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            let val = this.props.value;
            let org = val && val.trim();
            let v = this.input.value.trim();
            let onChanged = this.props.onChanged;
            if (onChanged !== undefined) {
                yield onChanged(v, org);
                nav.pop();
            }
        });
    }
    render() {
        let { title, onChanged, buttonText, info, value } = this.props;
        let right = React.createElement(Button, { color: "success", size: "sm", disabled: this.state.disabled, onClick: this.onSubmit }, buttonText || '保存');
        return React.createElement(Page, { header: title, right: right },
            React.createElement("div", { className: "m-4" },
                React.createElement("input", { className: "form-control w-100", type: "text", ref: this.ref, onChange: this.onChange }),
                React.createElement("small", { className: "d-block mt-2 text-muted" }, info)));
    }
}
//# sourceMappingURL=stringValueEdit.js.map