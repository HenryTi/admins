import { BoxId, BoxDivId } from './boxId';
import { Tuid } from './tuid';
import { TuidDiv } from './tuidDiv';
import { Field } from '../uq';

// field._tuid 用这个接口
// Tuid, TuidDiv 实现这个接口
export class TuidBox {
    tuid: Tuid;
    ownerField:Field = undefined;
    constructor(tuid: Tuid) {
        this.tuid = tuid;
    }

    boxId(id:number):BoxId {
        return this.tuid.boxId(id);
    }
    getIdFromObj(obj:any):number {
        return this.tuid.getIdFromObj(obj);
    }
    useId(id:number):void {
        return this.tuid.useId(id);
    }
    async showInfo() {
        alert('showInfo not implemented');
    }
}

export class TuidBoxDiv extends TuidBox {
    ownerField: Field;
    private div: TuidDiv;
    constructor(tuid: Tuid, div: TuidDiv, ownerField: Field) {
        super(tuid);
        this.div = div;
        this.ownerField = ownerField;
    }

    boxId(id:number):BoxId {
        return this.div.boxId(id);
    }
    getIdFromObj(obj:any):number {
        return this.div.getIdFromObj(obj);
    }
    useId(id:number):void {
        return this.div.useId(id);
    }
}
