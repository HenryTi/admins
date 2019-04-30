import { Entities, Field, ArrFields, FieldMap } from './entities';
import { TuidMain, Tuid } from './tuid';

const tab = '\t';
const ln = '\n';

export abstract class Entity {
    protected entities: Entities;
    protected schema: any;
    private jName: string;
    sys?: boolean;
    readonly name: string;
    readonly typeId: number;
    abstract get typeName(): string;
    get sName():string {return this.jName || this.name}
    fields: Field[];
    arrFields: ArrFields[];
    returns: ArrFields[];

    constructor(entities:Entities, name:string, typeId:number) {
        this.entities = entities;
        this.name = name;
        this.typeId = typeId;
        this.sys = this.name.indexOf('$') >= 0;
    }

    public face: any;           // 对应字段的label, placeHolder等等的中文，或者语言的翻译

    protected get tvApi() {return this.entities.uqApi;}
    getApiFrom() {return this.entities.uqApi;}

    private fieldMaps: {[arr:string]: FieldMap} = {};
    fieldMap(arr?:string): FieldMap {
        if (arr === undefined) arr = '$';
        let ret = this.fieldMaps[arr];
        if (ret === undefined) {
            let fields:Field[];
            if (arr === '$') fields = this.fields;
            else if (this.arrFields !== undefined) {
                let arrFields = this.arrFields.find(v => v.name === arr);
                if (arrFields !== undefined) fields = arrFields.fields;
            }
            else if (this.returns !== undefined) {
                let arrFields = this.returns.find(v => v.name === arr);
                if (arrFields !== undefined) fields = arrFields.fields;
            }
            if (fields === undefined) return {};
            ret = {};
            for (let f of fields) ret[f.name] = f;
            this.fieldMaps[arr] = ret;
        }
        return ret;
    }

    public async loadSchema():Promise<void> {
        if (this.schema !== undefined) return;
        let schema = await this.entities.uqApi.schema(this.name);
        this.setSchema(schema);
        this.buildFieldsTuid();
    }

    public setSchema(schema:any) {
        if (schema === undefined) return;
        if (this.schema !== undefined) return;
        this.schema = schema;
        let {name} = schema;
        if (name !== this.name) this.jName = name;
        this.buildFieldsTuid();
    }

    public buildFieldsTuid() {
        let {fields, arrs, returns} = this.schema;
        this.entities.buildFieldTuid(this.fields = fields);
        this.entities.buildArrFieldsTuid(this.arrFields = arrs, fields);
        this.entities.buildArrFieldsTuid(this.returns = returns, fields);
        //this.newMain = this.buildCreater(fields);
        //this.newArr = this.buildArrCreater(arrs);
        //this.newRet = this.buildArrCreater(returns);
    }

    schemaStringify():string {
        return JSON.stringify(this.schema, (key:string, value:any) => {
            if (key === '_tuid') return undefined;
            return value;
        }, 4);
    }

    tuidFromField(field:Field):Tuid {
        let {_tuid, tuid} = field;
        if (tuid === undefined) return;
        if (_tuid !== undefined) return _tuid;
        return field._tuid = this.entities.getTuid(tuid, undefined);
    }

    tuidFromName(fieldName:string, arrName?:string):Tuid {
        if (this.schema === undefined) return;
        let {fields, arrs} = this.schema;
        let entities = this.entities;
        function getTuid(fn:string, fieldArr:Field[]) {
            if (fieldArr === undefined) return;
            let f = fieldArr.find(v => v.name === fn);
            if (f === undefined) return;
            return entities.getTuid(f.tuid, undefined);
        }
        let fn = fieldName.toLowerCase();
        if (arrName === undefined) return getTuid(fn, fields);
        if (arrs === undefined) return;
        let an = arrName.toLowerCase();
        let arr = (arrs as ArrFields[]).find(v => v.name === an);
        if (arr === undefined) return;
        return getTuid(fn, arr.fields);
    }

    protected buildParams(params:any):any {
        let result = {};
        let fields = this.fields;
        if (fields !== undefined) this.buildFieldsParams(result, fields, params);
        let arrs = this.arrFields;
        if (arrs !== undefined) {
            for (let arr of arrs) {
                let {name, fields} = arr;
                let paramsArr:any[] = params[name];
                if (paramsArr === undefined) continue;
                let arrResult = [];
                result[name] = arrResult;
                for (let pa of params) {
                    let rowResult = {};
                    this.buildFieldsParams(rowResult, fields, pa);
                    arrResult.push(rowResult);
                }
            }
        }
        return result;
    }

    private buildFieldsParams(result:any, fields:Field[], params:any) {
        for (let field of fields) {
            let {name} = field;
            let d = params[name];
            let val:any;
            switch (typeof d) {
                default: val = d; break;
                case 'object':
                    let tuid = field._tuid;
                    if (tuid === undefined) val = d.id;
                    else val = tuid.getIdFromObj(d);
                    break;
            }
            result[name] = val;
        }
    }

    pack(data:any):string {
        let ret:string[] = [];
        let fields = this.fields;
        if (fields !== undefined) this.packRow(ret, fields, data);
        let arrs = this.arrFields; //schema['arrs'];
        if (arrs !== undefined) {
            for (let arr of arrs) {
                this.packArr(ret, arr.fields, data[arr.name]);
            }
        }
        return ret.join('');
    }

    private escape(row:any, field:Field):any {
        let d = row[field.name];
        switch (typeof d) {
            default: return d;
            case 'object':
                let tuid = field._tuid;
                if (tuid === undefined) return d.id;
                return tuid.getIdFromObj(d);
            case 'string':
                let len = d.length;
                let r = '', p = 0;
                for (let i=0;i<len;i++) {
                    let c = d.charCodeAt(i);
                    switch(c) {
                        case 9: r += d.substring(p, i) + '\\t'; p = i+1; break;
                        case 10: r += d.substring(p, i) + '\\n'; p = i+1; break;
                    }
                }
                return r + d.substring(p);
            case 'undefined': return '';
        }
    }

    private packRow(result:string[], fields:Field[], data:any) {
        let len = fields.length;
        if (len === 0) return;
        let ret = '';
        ret += this.escape(data, fields[0]);
        for (let i=1;i<len;i++) {
            let f = fields[i];
            ret += tab + this.escape(data, f);
        }
        result.push(ret + ln);
    }

    private packArr(result:string[], fields:Field[], data:any[]) {
        if (data !== undefined) {
            for (let row of data) {
                this.packRow(result, fields, row);
            }
        }
        result.push(ln);
    }

    unpackSheet(data:string):any {
        let ret = {} as any; //new this.newMain();
        //if (schema === undefined || data === undefined) return;
        let fields = this.fields;
        let p = 0;
        if (fields !== undefined) p = this.unpackRow(ret, fields, data, p);
        let arrs = this.arrFields; //schema['arrs'];
        if (arrs !== undefined) {
            for (let arr of arrs) {
                p = this.unpackArr(ret, arr, data, p);
            }
        }
        return ret;
    }

    unpackReturns(data:string):any {
        let ret = {} as any;
        //if (schema === undefined || data === undefined) return;
        //let fields = schema.fields;
        let p = 0;
        //if (fields !== undefined) p = unpackRow(ret, schema.fields, data, p);
        let arrs = this.returns; //schema['returns'];
        if (arrs !== undefined) {
            for (let arr of arrs) {
                //let creater = this.newRet[arr.name];
                p = this.unpackArr(ret, arr, data, p);
            }
        }
        return ret;
    }

    protected unpackRow(ret:any, fields:Field[], data:string, p:number):number {
        let ch0 = 0, ch = 0, c = p, i = 0, len = data.length, fLen = fields.length;
        for (;p<len;p++) {
            ch0 = ch;
            ch = data.charCodeAt(p);
            if (ch === 9) {
                let f = fields[i];
                let {name} = f;
                if (ch0 !== 8) {
                    if (p>c) {
                        let v = data.substring(c, p);
                        ret[name] = this.to(ret, v, f);
                    }
                }
                else {
                    ret[name] = null;
                }
                c = p+1;
                ++i;
                if (i>=fLen) {
                    p = data.indexOf('\n', c);
                    if (p >= 0) ++p;
                    else p = len;
                    break;
                }
            }
            else if (ch === 10) {
                let f = fields[i];
                let {name} = f;
                if (ch0 !== 8) {
                    if (p>c) {
                        let v = data.substring(c, p);
                        ret[name] = this.to(ret, v, f);
                    }
                }
                else {
                    ret[name] = null;
                }
                ++p;
                ++i;
                break;
            }
        }
        return p;
    }

    private to(ret:any, v:string, f:Field):any {
        switch (f.type) {
            default: return v;
            case 'datetime':
            case 'date':
            case 'time':
                let date = new Date(Number(v));
                return date;
            case 'id':
            case 'tinyint':
            case 'smallint':
            case 'int':
            case 'dec': return Number(v);
            case 'bigint':
                let id = Number(v);
                let {_tuid} = f;
                if (_tuid === undefined) return id;
                _tuid.useId(id, true);
                return _tuid.boxId(id);
        }
    }

    private unpackArr(ret:any, arr:ArrFields, data:string, p:number):number {
        let vals:any[] = [], len = data.length;
        let {name, fields} = arr;
        while (p<len) {
            let ch = data.charCodeAt(p);
            if (ch === 10) {
                ++p;
                break;
            }
            let val = {} as any; //new creater();
            vals.push(val);
            p = this.unpackRow(val, fields, data, p);
        }
        ret[name] = vals;
        return p;
    }
}
