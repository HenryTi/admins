import * as React from 'react';
import * as _ from 'lodash';
import {CharsControl} from './charsControl';
import {StringField} from '../field';
import {TextAreaFace} from '../face';

export class TextAreaControl extends CharsControl {
    protected field: StringField;
    protected face: TextAreaFace;
    private el: HTMLTextAreaElement;
    protected setProps() {
        let p = super.setProps();
        let {maxLength} = this.field;
        let {rows} = this.face;
        _.assign(p, {
            maxLength: maxLength,
            rows: rows,
        });
        return p;
    };
    protected renderInput():JSX.Element {
        return <textarea ref={t=>{this.el = t;if (t!==undefined) t.value=''}} className={this.className()} {...this.props} />;
    }
}
