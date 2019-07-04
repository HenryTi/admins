var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { nav } from '../nav';
import { observable } from 'mobx';
export class ItemEdit {
    constructor(itemSchema, uiItem, label, value) {
        this.isChanged = false;
        this.itemSchema = itemSchema;
        this.uiItem = uiItem;
        this.value = value;
        let { name } = itemSchema;
        this.name = name;
        this.label = label;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.internalStart();
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.internalEnd();
        });
    }
    internalEnd() {
        return __awaiter(this, void 0, void 0, function* () { nav.pop(); });
    }
    verifyValue() {
        if (this.uiItem === undefined)
            return;
        let { rules } = this.uiItem;
        if (rules === undefined)
            return;
        let nv = this.newValue;
        function verifyRule(rule, value) {
            let error = rule(nv);
            if (error !== undefined) {
                if (typeof error !== 'object')
                    return error;
                else
                    return JSON.stringify(error);
            }
        }
        if (Array.isArray(rules)) {
            for (let rule of rules) {
                let error = verifyRule(rule, nv);
                if (error !== undefined) {
                    this.error = error;
                    break;
                }
            }
        }
        else {
            this.error = verifyRule(rules, nv);
        }
    }
}
__decorate([
    observable
], ItemEdit.prototype, "error", void 0);
__decorate([
    observable
], ItemEdit.prototype, "isChanged", void 0);
//# sourceMappingURL=itemEdit.js.map