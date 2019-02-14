import * as React from 'react';
import classNames from 'classnames';
import { TextWidget } from './textWidget';
import { Widget } from './widget';
import { UiRadio } from '../uiSchema';
import { RowContext } from '../context';


//const radioStyle:React.CSSProperties = {width:'2em', height:'1.2em'};
export class RadioWidget extends Widget {
    protected inputs: {[index:number]: HTMLInputElement} = {};
    protected ui: UiRadio;

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

    render() {
        let {defaultValue, list} = this.ui;
        let {isRow, inNode} = this.context;
        let rowKey:number;
        if (isRow === true) {
            rowKey = (this.context as RowContext).rowKey;
        }
        let cn = classNames(this.className, 'form-radio-inline');
        return <span className={cn}>
                {list.map((v,index) => {
                    let {value, title} = v;
                    let name = this.name;
                    if (rowKey !== undefined) name += '-' + rowKey;
                    return <label key={index} className="form-radio-inline">
                        <input ref={input=>this.inputs[index]=input} type="radio" name={name}
                            value={value} defaultChecked={(this.defaultValue || defaultValue)===value} />
                        {title || value}
                    </label>;
                    //</span>
                })}
            </span>;
    }
}
/*
<div className="form-control d-flex border-0"><input
ref={(input)=>this.input = input}
className={classNames(this.className, 'align-self-center')}
type="checkbox"
style={{maxHeight:"1.2em"}}
defaultValue={this.defaultValue} 
onChange={this.onChange} />
</div>
*/