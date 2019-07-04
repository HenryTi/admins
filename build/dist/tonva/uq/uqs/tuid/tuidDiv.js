var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { IdDivCache } from './idCache';
import { TuidBoxDiv } from './tuidBox';
import { BoxDivId } from './boxId';
import { Entity } from '../entity';
export class TuidDiv extends Entity {
    constructor(uq, tuid, name) {
        super(uq, name, 0);
        this.typeName = 'div';
        this.tuid = tuid;
        this.idName = 'id';
        this.idCache = new IdDivCache(tuid, this);
    }
    ;
    get owner() { return this.tuid; }
    /*
    setSchema(schema:any) {
        super.setSchema(schema);
        this.buildFieldsTuid();
    }*/
    setUIRes(ui, res) {
        this.ui = ui && ui.content;
        this.res = res;
    }
    buildFieldsTuid() {
        super.buildFieldsTuid();
        let { mainFields } = this.schema;
        if (mainFields === undefined)
            debugger;
        this.uq.buildFieldTuid(this.cacheFields = mainFields);
    }
    buildTuidBox(ownerField) {
        return new TuidBoxDiv(this.tuid, this, ownerField);
    }
    getIdFromObj(obj) { return obj[this.idName]; }
    cacheValue(value) {
        this.idCache.cacheValue(value);
    }
    useId(id, defer) {
        this.idCache.useId(id, defer);
    }
    boxId(id) {
        if (typeof id === 'object')
            return id;
        this.useId(id);
        return new BoxDivId(this.tuid, this, id);
    }
    valueFromId(id) {
        return this.idCache.getValue(id);
    }
    assureBox(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.idCache.assureObj(id);
        });
    }
    cacheIds() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.idCache.cacheIds();
        });
    }
    cacheTuidFieldValues(values) {
        let fields = this.schema.fields;
        this.cacheFieldsInValue(values, fields);
    }
    unpackTuidIds(values) {
        return this.unpackTuidIdsOfFields(values, this.cacheFields);
    }
}
//# sourceMappingURL=tuidDiv.js.map