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
import { observable } from 'mobx';
export class CacheIds {
    constructor(maxCount = 100) {
        this.arr = [];
        this.dict = new Map();
        this.maxCount = maxCount;
    }
    loadIds(ids) {
        let arr = [];
        for (let id of ids) {
            if (id === null)
                continue;
            let item = this.dict.get(id);
            if (item === undefined) {
                arr.push(id);
                item = { id: id };
                this.dict.set(id, item);
            }
        }
        this.loadId(arr);
    }
    get(id) {
        if (id === undefined || id === null)
            return null;
        let item = this.dict.get(id);
        if (item === undefined) {
            this.dict.set(id, { id: id });
            this.loadId([id]);
            item = this.dict.get(id);
        }
        return item;
    }
    setItem(id, item) {
        if (item === undefined) {
            this.dict.set(id, null);
            this.arr.push({ id: id });
        }
        else {
            this.dict.set(id, item);
            this.arr.push(item);
        }
        if (this.arr.length > this.maxCount) {
            item = this.arr.shift();
            this.dict.delete(item.id);
        }
    }
    loadId(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this._loadIds(ids);
            if (items === undefined) {
                for (let id of ids) {
                    if (id === null)
                        continue;
                    let item = yield this._loadId(id);
                    this.setItem(id, item);
                }
            }
            else {
                for (let id of ids) {
                    let item = items.find(v => v.id === id);
                    this.setItem(id, item);
                }
            }
        });
    }
}
__decorate([
    observable
], CacheIds.prototype, "dict", void 0);
//# sourceMappingURL=cacheIds.js.map