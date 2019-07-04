var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { PureJSONContent } from '../../controllers';
export class BoxId {
    get obj() {
        return this.tuid.valueFromId(this.id);
    }
    constructor(tuid, id) {
        this.tuid = tuid;
        this.id = id;
    }
    render(ui, x) {
        if (this.id === undefined || this.id === null)
            return;
        let boxName = this.boxName(); // this.tuid.name;
        let val = this.obj; // this.tuid.valueFromId(this.id);
        if (this.isUndefined() === true) {
            if (ui !== undefined)
                return ui(val, x);
            return PureJSONContent(val, x);
        }
        switch (typeof val) {
            case 'undefined':
                return React.createElement("del", { className: "text-black-50" },
                    boxName,
                    " undefined");
            case 'number':
                return React.createElement("del", { className: "text-black-50" },
                    boxName,
                    " ",
                    this.id);
        }
        if (ui === undefined) {
            ui = this.ui();
        }
        if (ui !== undefined) {
            let ret = ui(val, this.res());
            if (ret !== undefined)
                return ret;
            return React.createElement("del", { className: "text-danger" },
                boxName,
                " ",
                this.id);
        }
        return PureJSONContent(val);
    }
    boxName() { return this.tuid.name; }
    //valueFromId(): any {return this.tuid.valueFromId(this.id)}
    isUndefined() { return this.tuid === undefined; }
    ui() { return this.tuid.ui; }
    res() { return this.tuid.res; }
    assure() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tuid.assureBox(this.id);
        });
    }
}
export class BoxDivId extends BoxId {
    constructor(tuid, div, id) {
        super(tuid, id);
        this.div = div;
    }
    get obj() {
        return this.div.valueFromId(this.id);
    }
    boxName() { return this.div.name; }
    //valueFromId(): any {return this.div.valueFromId(this.id)}
    isUndefined() { return this.div === undefined; }
    ui() { return this.div.ui; }
    res() { return this.div.res; }
    assure() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.div.assureBox(this.id);
        });
    }
}
//# sourceMappingURL=boxId.js.map