var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// field._tuid 用这个接口
// Tuid, TuidDiv 实现这个接口
export class TuidBox {
    constructor(tuid) {
        this.ownerField = undefined;
        this.tuid = tuid;
    }
    boxId(id) {
        return this.tuid.boxId(id);
    }
    getIdFromObj(obj) {
        return this.tuid.getIdFromObj(obj);
    }
    useId(id) {
        return this.tuid.useId(id);
    }
    showInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            alert('showInfo not implemented');
        });
    }
}
export class TuidBoxDiv extends TuidBox {
    constructor(tuid, div, ownerField) {
        super(tuid);
        this.div = div;
        this.ownerField = ownerField;
    }
    boxId(id) {
        return this.div.boxId(id);
    }
    getIdFromObj(obj) {
        return this.div.getIdFromObj(obj);
    }
    useId(id) {
        return this.div.useId(id);
    }
}
//# sourceMappingURL=tuidBox.js.map