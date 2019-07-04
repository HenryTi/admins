import { Tuid, TuidLocal } from './tuid';
import { IdCache, IdDivCache } from './idCache';
import { TuidBox, TuidBoxDiv } from './tuidBox';
import { BoxId, BoxDivId } from './boxId';
import { Field, Uq } from '../uq';
import { Entity } from '../entity';

export class TuidDiv extends Entity {
    readonly typeName = 'div';
    private cacheFields: Field[];
    protected tuid: TuidLocal;
    protected idName: string;
    protected idCache: IdDivCache;;

    ui: React.StatelessComponent<any>;
    res: any;

    constructor(uq: Uq, tuid: TuidLocal, name: string) {
        super(uq, name, 0);
        this.tuid = tuid;
        this.idName = 'id';
        this.idCache = new IdDivCache(tuid, this);
    }

    get owner() {return this.tuid}

    /*
    setSchema(schema:any) {
        super.setSchema(schema);
        this.buildFieldsTuid();
    }*/

    setUIRes(ui:any, res:any) {
        this.ui = ui && ui.content;
        this.res = res;
    }

    buildFieldsTuid() {
        super.buildFieldsTuid();
        let {mainFields} = this.schema;
        if (mainFields === undefined) debugger;
        this.uq.buildFieldTuid(this.cacheFields = mainFields);
    }

    buildTuidBox(ownerField: Field): TuidBox {
        return new TuidBoxDiv(this.tuid, this, ownerField);
    }

    getIdFromObj(obj:any):number {return obj[this.idName]}
    cacheValue(value:any):void {
        this.idCache.cacheValue(value);
    }

    useId(id:number, defer?:boolean):void {
        this.idCache.useId(id, defer);
    }

    boxId(id:number):BoxId {
        if (typeof id === 'object') return id;
        this.useId(id);
        return new BoxDivId(this.tuid, this, id);
    }

    valueFromId(id:number):any {
        return this.idCache.getValue(id)
    }

    async assureBox(id:number):Promise<void> {
        await this.idCache.assureObj(id);
    }

    async cacheIds() {
        await this.idCache.cacheIds();
    }

    cacheTuidFieldValues(values:any) {
        let fields = this.schema.fields;
        this.cacheFieldsInValue(values, fields);
    }

    unpackTuidIds(values:any[]|string):any[] {
        return this.unpackTuidIdsOfFields(values, this.cacheFields);
    }
}
