import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
import { UiCheckItem } from '../uiSchema';

export class CheckBoxWidget extends Widget {
    protected input: HTMLInputElement;
    protected ui: UiCheckItem;
    protected trueValue: any;
    protected falseValue: any;

    protected init() {
        super.init();
        if (this.ui !== undefined) {
            let {trueValue, falseValue} = this.ui;
            if (trueValue === undefined) this.trueValue = true;
            else this.trueValue = trueValue;
            if (falseValue === undefined) this.falseValue = false;
            else this.falseValue = falseValue;
        }
        else {
            this.trueValue = true;
            this.falseValue = false;
        }
    }
    protected setElementValue(value:any) {
        this.input.checked = value === this.trueValue;
    }
    setReadOnly(value:boolean) {this.input.readOnly = this.readOnly = value}
    setDisabled(value:boolean) {this.input.disabled = this.disabled = value}

    protected onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.setDataValue(evt.target.checked === true? this.trueValue : this.falseValue);
    }

    protected onClick = () => {
        this.context.removeErrors();
    }

    render() {
        let cn = classNames(this.className, 'form-check-inline');
        let input = <input
            ref={(input)=>this.input = input}
            className={'align-self-center'}
            type="checkbox"
            defaultChecked={this.defaultValue} 
            onChange={this.onInputChange}
            onClick={this.onClick} />;
        return this.context.inNode?
            <label className={cn}>
                {input} {(this.ui&&this.ui.label) || this.name}
            </label>
            :
            <div className={cn}>{input}</div>;
    }
}
