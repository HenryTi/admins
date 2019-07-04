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
import { observable, computed } from 'mobx';
import { uid } from './uid';
export class PageItems {
    constructor(itemObservable = false) {
        this.isFirst = true;
        this.loading = false;
        this.beforeLoad = true;
        this.loaded = false;
        this.allLoaded = false;
        this.firstSize = 100;
        this.pageStart = undefined;
        this.pageSize = 30;
        this.appendPosition = 'tail';
        this._items = observable.array([], { deep: itemObservable });
    }
    get items() {
        if (this.beforeLoad === true)
            return null;
        if (this.loaded === false)
            return undefined;
        return this._items;
    }
    scrollToTop() {
        this.topDiv = '$$' + uid();
    }
    scrollToBottom() {
        this.bottomDiv = '$$' + uid();
    }
    reset() {
        this.isFirst = true;
        this.beforeLoad = true;
        this.loaded = false;
        this.param = undefined;
        this.allLoaded = false;
        this._items.clear();
        this.setPageStart(undefined);
    }
    append(item) {
        if (this.appendPosition === 'tail')
            this._items.unshift(item);
        else
            this._items.push(item);
    }
    first(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.reset();
            this.beforeLoad = false;
            this.param = param;
            yield this.more();
        });
    }
    more() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.allLoaded === true)
                return;
            if (this.loading === true)
                return;
            this.loading = true;
            let pageSize = this.pageSize + 1;
            if (this.isFirst === true) {
                if (this.firstSize > this.pageSize)
                    pageSize = this.firstSize + 1;
            }
            let ret = yield this.load(this.param, this.pageStart, pageSize);
            this.loading = false;
            this.loaded = true;
            let len = ret.length;
            if (this.isFirst === true && len > this.firstSize ||
                this.isFirst === false && len > this.pageSize) {
                this.allLoaded = false;
                --len;
                ret.splice(len, 1);
            }
            else {
                this.allLoaded = true;
            }
            if (len === 0) {
                this._items.clear();
                return;
            }
            this.setPageStart(ret[len - 1]);
            if (this.appendPosition === 'tail')
                this._items.push(...ret);
            else
                this._items.unshift(...ret.reverse());
            this.isFirst = false;
        });
    }
}
__decorate([
    observable
], PageItems.prototype, "loading", void 0);
__decorate([
    observable
], PageItems.prototype, "beforeLoad", void 0);
__decorate([
    observable
], PageItems.prototype, "loaded", void 0);
__decorate([
    observable
], PageItems.prototype, "allLoaded", void 0);
__decorate([
    computed
], PageItems.prototype, "items", null);
__decorate([
    observable
], PageItems.prototype, "topDiv", void 0);
__decorate([
    observable
], PageItems.prototype, "bottomDiv", void 0);
//# sourceMappingURL=pageItems.js.map