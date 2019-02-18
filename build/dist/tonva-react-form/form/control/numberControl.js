import * as _ from 'lodash';
import { CharsControl } from './charsControl';
const ErrInvalidNumber = '无效的数字';
const ErrMin = '最小值为';
const ErrMax = '最大值为';
const KeyCode_Neg = 45;
const KeyCode_Dot = 46;
export class NumberControl extends CharsControl {
    init() {
        super.init();
        this.extraChars = [];
        let { min, max } = this.field;
        if (min !== undefined) {
            this.rules.push((v) => { if (v === undefined)
                return; if (v < min)
                return ErrMin + min; return true; });
            if (min < 0)
                this.extraChars.push(KeyCode_Neg);
        }
        else {
            this.extraChars.push(KeyCode_Neg);
        }
        if (max !== undefined) {
            this.rules.push((v) => { if (v === undefined)
                return; if (v > max)
                return ErrMax + max; return true; });
        }
        switch (this.field.type) {
            case 'dec':
            case 'number':
                this.extraChars.push(KeyCode_Dot);
                break;
        }
    }
    parseValue(value) {
        if (value === undefined)
            return undefined;
        if (value.trim().length === 0)
            return undefined;
        let n = Number.parseFloat(value);
        if (isNaN(n))
            throw new Error(ErrInvalidNumber);
        return n;
    }
    setProps() {
        super.setProps();
        _.assign(this.props, {
            type: 'number',
            step: this.field.step,
            onKeyPress: this.onKeyPress.bind(this),
        });
    }
    onKeyPress(event) {
        let ch = event.charCode;
        if (ch === 8 || ch === 0 || ch === 13 || ch >= 48 && ch <= 57)
            return;
        if (this.extraChars !== undefined) {
            if (this.extraChars.indexOf(ch) >= 0) {
                switch (ch) {
                    case KeyCode_Dot:
                        this.onKeyDot();
                        break;
                    case KeyCode_Neg:
                        this.onKeyNeg();
                        event.preventDefault();
                        break;
                }
                return;
            }
        }
        event.preventDefault();
    }
    onKeyDot() {
        let v = this.element.value;
        let p = v.indexOf('.');
        if (p >= 0)
            this.element.value = v.replace('.', '');
    }
    onKeyNeg() {
        let v = this.element.value;
        let p = v.indexOf('-');
        if (p >= 0)
            v = v.replace('-', '');
        else
            v = '-' + v;
        this.element.value = v;
    }
}
//# sourceMappingURL=numberControl.js.map