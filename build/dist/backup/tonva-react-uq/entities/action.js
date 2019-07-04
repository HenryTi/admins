var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Entity } from './entity';
export class Action extends Entity {
    get typeName() { return 'action'; }
    submit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            let text = this.pack(data);
            return yield this.tvApi.action(this.name, { data: text });
        });
    }
}
//# sourceMappingURL=action.js.map