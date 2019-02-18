var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CEntity } from "../CVEntity";
import { VQueryMain } from "./vQueryMain";
import { VQuerySelect } from "./vQuerySelect";
export class CQueryBase extends CEntity {
}
export class CQuery extends CQueryBase {
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openVPage(this.VQueryMain);
        });
    }
    get VQueryMain() { return this.ui && this.ui.main || VQueryMain; }
}
export class CQuerySelect extends CQueryBase {
    internalStart(param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openVPage(this.VQuerySelect, param);
        });
    }
    get VQuerySelect() { return VQuerySelect; }
}
//# sourceMappingURL=cQuery.js.map