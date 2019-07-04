import * as React from 'react';
import {observable} from 'mobx';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import {FormView} from '../formView';
import {Field} from '../field';
import {Face, RadioFace} from '../face';
import {Control} from './control';

export class RadioControl extends Control {
    protected face: RadioFace;
    renderControl():JSX.Element {
        return <div className="form-control-static">
            <div className="form-control">
            {
                this.face.list.map((item, index) => {
                    let t, v;
                    if (typeof item !== 'object') t = v = item;
                    else {
                        t = item.text;
                        v = item.value;
                    }
                    return <label key={index} className="custom-control custom-radio w-25">
                        <input type='radio'
                            name={this.field.name} 
                            className="custom-control-input" />
                        <span className="custom-control-indicator"></span>
                        <span className="custom-control-description">{t}</span>
                    </label>;
                })
            }
            </div>
        </div>;
    }
}
