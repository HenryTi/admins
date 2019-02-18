import { TextWidget } from './textWidget';
import { RuleNum, RuleInt } from '../rules';
export class NumberWidget extends TextWidget {
    constructor() {
        super(...arguments);
        this.inputType = 'number';
    }
    buildRules() {
        super.buildRules();
        let res = this.context.form.res;
        let { min, max } = this.itemSchema;
        this.rules.push(this.itemSchema.type === 'integer' ?
            new RuleNum(res, min, max) :
            new RuleInt(res, min, max));
        /*
        if (this.itemSchema.type === 'integer') {
            this.rules.push(new RuleInt);
        }
        let {min, max} = this.itemSchema;
        if (min !== undefined) this.rules.push(new RuleMin(min));
        if (max !== undefined) this.rules.push(new RuleMax(max));
        */
    }
    parse(value) {
        if (value === undefined || value === null)
            return;
        return Number(value);
    }
}
//# sourceMappingURL=numberWidget.js.map