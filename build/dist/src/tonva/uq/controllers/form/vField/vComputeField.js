import React from 'react';
import { VField } from './vField';
import { observer } from 'mobx-react';
export class VComputeField extends VField {
    constructor(form, field, fieldRes) {
        super(form, field, undefined, fieldRes);
        this.view = observer(() => {
            let value = this.form.values[this.field.name];
            let { placeHolder, suffix } = this.fieldRes;
            let ctrlCN = 'form-control form-control-input bg-light';
            if (value === null)
                value = '';
            let input = React.createElement("input", { className: ctrlCN, type: "text", placeholder: placeHolder, readOnly: true, value: value });
            let inputGroup;
            if (suffix === undefined)
                inputGroup = input;
            else
                inputGroup = React.createElement("div", { className: "input-group" },
                    input,
                    React.createElement("div", { className: "input-group-append" },
                        React.createElement("span", { className: "input-group-text" }, suffix)));
            return inputGroup;
            /*
                return <div
                className="form-control form-control-plaintext border border-info rounded bg-light cursor-pointer">
                {value} &nbsp;
            </div>;
            */
        });
    }
}
//# sourceMappingURL=vComputeField.js.map