import _ from 'lodash';
import { Context } from '../context';
import { FormRes } from '../formRes';

export abstract class Rule {
    abstract check(defy:string[], value:any):void;
}

export type ContextRule = (context:Context)=>{[target:string]:string[]|string} | string[] | string;
export type FieldRule = (value:any) => string[] | string;

export class RuleCustom extends Rule {
    private func: FieldRule;
    constructor(func: FieldRule) {
        super();
        this.func = func;
    }
    check(defy:string[], value:any) {
        let ret = this.func(value);
        if (ret === undefined) return;
        switch (typeof ret) {
            case 'undefined': return;
            case 'string': defy.push(ret as string); return;
            default: defy.push(...ret); return;
        }        
    }
}

export abstract class RulePredefined extends Rule {
    protected res: FormRes;
    constructor(res: FormRes) {
        super();
        this.res = res;
    }
}

export class RuleRequired extends RulePredefined {
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
        defy.push(this.res.required);
    }
}

export class RuleNum extends RulePredefined {
    private minMsg: _.TemplateExecutor;
    private maxMsg: _.TemplateExecutor;
    protected min: number;
    protected max: number
    constructor(res: FormRes, min?: number, max?: number) {
        super(res);
        this.minMsg = _.template(res.min);
        this.maxMsg = _.template(res.max);
        this.min = min;
        this.max = max;
    }
    check(defy:string[], value:any) {
        if (value === undefined || value === null) return;
        let n = Number(value);
        if (n === NaN) {
            defy.push(this.res.number);
        }
        else {
            this.checkMore(defy, n);
        }
    }

    protected checkMore(defy:string[], value: number) {
        if (this.min !== undefined && Number(value) < this.min) {
            defy.push(this.minMsg({min:this.min}));
        }
        if (this.max !== undefined && Number(value) > this.max) {
            defy.push(this.maxMsg({max:this.max}));
        }
    }
}

export class RuleInt extends RuleNum {
    protected checkMore(defy:string[], n: number) {
        super.checkMore(defy, n);
        if (Number.isInteger(n) === false) {
            defy.push(this.res.integer);
        }
    }
}
