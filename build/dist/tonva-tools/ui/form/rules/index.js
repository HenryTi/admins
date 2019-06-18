import _ from 'lodash';
export class Rule {
}
export class RuleCustom extends Rule {
    constructor(func) {
        super();
        this.func = func;
    }
    check(defy, value) {
        let ret = this.func(value);
        if (ret === undefined)
            return;
        switch (typeof ret) {
            case 'undefined': return;
            case 'string':
                defy.push(ret);
                return;
            default:
                defy.push(...ret);
                return;
        }
    }
}
export class RulePredefined extends Rule {
    constructor(res) {
        super();
        this.res = res;
    }
}
export class RuleRequired extends RulePredefined {
    check(defy, value) {
        switch (typeof value) {
            default:
            case 'boolean': return;
            case 'object':
                if (value !== null)
                    return;
                break;
            case 'string':
                if (value.trim().length > 0)
                    return;
                break;
            case 'number':
                if (value !== NaN)
                    return;
                break;
            case 'undefined':
                break;
        }
        defy.push(this.res.required);
    }
}
export class RuleNum extends RulePredefined {
    constructor(res, min, max) {
        super(res);
        this.minMsg = _.template(res.min);
        this.maxMsg = _.template(res.max);
        this.min = min;
        this.max = max;
    }
    check(defy, value) {
        if (value === undefined || value === null)
            return;
        let n = Number(value);
        if (n === NaN) {
            defy.push(this.res.number);
        }
        else {
            this.checkMore(defy, n);
        }
    }
    checkMore(defy, value) {
        if (this.min !== undefined && Number(value) < this.min) {
            defy.push(this.minMsg({ min: this.min }));
        }
        if (this.max !== undefined && Number(value) > this.max) {
            defy.push(this.maxMsg({ max: this.max }));
        }
    }
}
export class RuleInt extends RuleNum {
    checkMore(defy, n) {
        super.checkMore(defy, n);
        if (Number.isInteger(n) === false) {
            defy.push(this.res.integer);
        }
    }
}
//# sourceMappingURL=index.js.map