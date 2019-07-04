export class Rule {
}
export class RuleRequired extends Rule {
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
        defy.push('不能为空');
    }
}
export class RuleNum extends Rule {
    check(defy, value) {
        if (value === undefined || value === null)
            return;
        let n = Number(value);
        if (n === NaN)
            defy.push('必须是数字');
    }
}
export class RuleInt extends Rule {
    check(defy, value) {
        if (value === undefined || value === null)
            return;
        let n = Number(value);
        if (Number.isNaN(n) === true || Number.isInteger(n) === false) {
            defy.push('必须是整数');
        }
    }
}
export class RuleMin extends RuleNum {
    constructor(min) {
        super();
        this.min = min;
    }
    check(defy, value) {
        super.check(defy, value);
        if (Number(value) < this.min)
            defy.push('不能小于' + this.min);
    }
}
export class RuleMax extends RuleNum {
    constructor(max) {
        super();
        this.max = max;
    }
    check(defy, value) {
        super.check(defy, value);
        if (Number(value) > this.max)
            defy.push('不能小于' + this.max);
    }
}
//# sourceMappingURL=rule.js.map