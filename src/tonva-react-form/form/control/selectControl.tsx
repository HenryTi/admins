import * as React from 'react';
import {observable} from 'mobx';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import {FormView} from '../formView';
import {Field} from '../field';
import {Face, SelectFace} from '../face';
import {Control} from './control';

export class SelectControl extends Control {
    constructor (formView:FormView, field:Field, face:Face) {
        super(formView, field, face);
        this.ref = this.ref.bind(this);
    }
    protected face: SelectFace;
    protected element: HTMLSelectElement;
    protected getValueFromElement():any {
        let {selectedIndex, selectedOptions} = this.element;
        let v:any = selectedOptions[0].value;
        switch (this.field.type) {
            case 'number': v = Number(v); break;
            case 'date': v = new Date(v); break;
            case 'bool': 
                if (typeof v === 'string') {
                    v = ((v as string).toLowerCase() === 'true');
                }
                break;
        }
        return v;
    }
    renderControl():JSX.Element {
        let {list} = this.face;
        let def = this.face.default;
        let options: any[] = [];
        if (def === undefined)
            options.push(<option key={-1} value={undefined}>请选择</option>);
        options.push(...list.map((item, index) => {
            let t, v;
            if (typeof item !== 'object') t = v = item;
            else {
                t = item.text;
                v = item.value;
            }
            return <option key={index} value={v}>{t}</option>;
        }));
        return <div className="form-control-static">
            <select name={this.field.name} className="form-control" ref={this.ref}>
                {options}
            </select>
        </div>;
    }
}
