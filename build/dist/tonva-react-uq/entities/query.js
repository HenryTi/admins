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
import { Entity } from './entity';
export class Query extends Entity {
    get typeName() { return 'query'; }
    setSchema(schema) {
        super.setSchema(schema);
        let { returns } = schema;
        this.returns = returns;
        this.isPaged = returns.find(v => v.name === '$page') !== undefined;
    }
    resetPage(size, params) {
        this.pageStart = undefined;
        this.pageSize = size;
        this.params = params;
        this.more = false;
        this.list = undefined;
    }
    get hasMore() { return this.more; }
    loadPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageSize === undefined) {
                throw 'call resetPage(size:number, params:any) first';
            }
            let pageStart;
            if (this.pageStart !== undefined) {
                switch (this.startField.type) {
                    default:
                        pageStart = this.pageStart;
                        break;
                    case 'date':
                    case 'time':
                    case 'datetime':
                        pageStart = this.pageStart.getTime();
                        break;
                }
            }
            let page = yield this.page(this.params, pageStart, this.pageSize + 1);
            /*
            await this.loadSchema();
            let res = await this.tvApi.page(this.name, pageStart, this.pageSize+1, this.params);
            let data = await this.unpackReturns(res);
            let page = data['$page'] as any[];
            */
            this.list = observable.array([], { deep: false });
            if (page !== undefined) {
                if (page.length > this.pageSize) {
                    this.more = true;
                    page.pop();
                    let ret = this.returns.find(r => r.name === '$page');
                    this.startField = ret.fields[0];
                    this.pageStart = page[page.length - 1][this.startField.name];
                }
                else {
                    this.more = false;
                }
                this.list.push(...page);
            }
            //this.loaded = true;
        });
    }
    page(params, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            let res = yield this.tvApi.page(this.name, pageStart, pageSize + 1, this.buildParams(params));
            let data = yield this.unpackReturns(res);
            return data.$page; // as any[];
        });
    }
    query(params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            let res = yield this.tvApi.query(this.name, this.buildParams(params));
            let data = yield this.unpackReturns(res);
            return data;
        });
    }
    table(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.query(params);
            for (let i in ret) {
                return ret[i];
            }
        });
    }
    obj(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.table(params);
            if (ret.length > 0)
                return ret[0];
        });
    }
    scalar(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.obj(params);
            for (let i in ret)
                return ret[i];
        });
    }
}
__decorate([
    observable
], Query.prototype, "list", void 0);
//# sourceMappingURL=query.js.map