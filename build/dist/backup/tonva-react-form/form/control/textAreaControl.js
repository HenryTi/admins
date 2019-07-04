import * as React from 'react';
import * as _ from 'lodash';
import { CharsControl } from './charsControl';
export class TextAreaControl extends CharsControl {
    setProps() {
        let p = super.setProps();
        let { maxLength } = this.field;
        let { rows } = this.face;
        _.assign(p, {
            maxLength: maxLength,
            rows: rows,
        });
        return p;
    }
    ;
    renderInput() {
        return React.createElement("textarea", Object.assign({ ref: t => { this.el = t; if (t !== undefined)
                t.value = ''; }, className: this.className() }, this.props));
    }
}
//# sourceMappingURL=textAreaControl.js.map