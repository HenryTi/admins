
export abstract class Rule {
    abstract check(defy:string[], value:any);
}

export class RuleRequired extends Rule {
    check(defy:string[], value:any) {
        switch (typeof value) {
            default:
            case 'boolean': return;
            case 'object':
                if (value !== null) return;
                break;
            case 'string':
                if ((value as string).trim().length > 0) return;
                break;
            case 'number':
                if ((value as number) !== NaN) return;
                break;
            case 'undefined':
                break;
        }
        defy.push('不能为空');
    }
}

export class RuleNum extends Rule {
    check(defy:string[], value:any) {
        if (value === undefined || value === null) return;
        let n = Number(value);
        if (n === NaN) defy.push('必须是数字');
    }
}

export class RuleInt extends Rule {
    check(defy:string[], value:any) {
        if (value === undefined || value === null) return;
        let n = Number(value);
        if (Number.isNaN(n) === true || Number.isInteger(n) === false) {
            defy.push('必须是整数');
        }
    }
}

export class RuleMin extends RuleNum {
    constructor(min: number) {
        super();
        this.min = min;
    }
    min: number;
    check(defy:string[], value:any) {
        super.check(defy, value);
        if (Number(value) < this.min) defy.push('不能小于' + this.min);
    }
}

export class RuleMax extends RuleNum {
    constructor(max: number) {
        super();
        this.max = max;
    }
    max: number;
    check(defy:string[], value:any) {
        super.check(defy, value);
        if (Number(value) > this.max) defy.push('不能小于' + this.max);
    }
}
