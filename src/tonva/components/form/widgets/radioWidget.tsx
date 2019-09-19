import * as React from 'react';
import classNames from 'classnames';
//import { TextWidget } from './textWidget';
import { Widget } from './widget';
import { UiRadio } from '../../schema';
import { RowContext } from '../context';


const radioStyle:React.CSSProperties = {height: 'auto'};

export class RadioWidget extends Widget {
    protected inputs: {[index:number]: HTMLInputElement} = {};
    protected get ui(): UiRadio {return this._ui as UiRadio};

    protected setElementValue(value:any) {
        for (let i in this.inputs) {
            let input = this.inputs[i];
            input.checked = value === input.value;
        }
    }
    setReadOnly(value:boolean) {
        this.readOnly = value;
        for (let i in this.inputs) this.inputs[i].readOnly = value;
    }
    setDisabled(value:boolean) {
        this.disabled = value;
        for (let i in this.inputs) this.inputs[i].disabled = value
    }

    /*
    protected onInputChange = (evt: React.ChangeEvent<any>) => {
        this.changeValue(evt.target.value, true);
    }
    */

    render() {
        let {defaultValue, list} = this.ui;
        let {isRow} = this.context;
        let rowKey:number;
        if (isRow === true) {
            rowKey = (this.context as RowContext).rowKey;
        }
        let cn = classNames(this.className, 'py-0');
        return <span className={cn} style={radioStyle}>
                {list.map((v,index) => {
                    let {value, title} = v;
                    let name = this.name;
                    if (rowKey !== undefined) name += '-' + rowKey;
                    return <label key={index} className="form-radio-inline">
                        <input ref={input=>this.inputs[index]=input} type="radio" name={name}
                            value={value} defaultChecked={(this.defaultValue || defaultValue)===value}
                            onChange={this.onInputChange} />
                        {title || value}
                    </label>;
                    //</span>
                })}
            </span>;
    }
}
