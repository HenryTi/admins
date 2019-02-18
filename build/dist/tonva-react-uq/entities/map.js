var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Entity } from './entity';
export class Map extends Entity {
    constructor() {
        super(...arguments);
        this.actions = {};
        this.queries = {};
    }
    get typeName() { return 'map'; }
    setSchema(schema) {
        super.setSchema(schema);
        this.schemaFrom = this.schema.from;
        let { actions, queries, keys } = schema;
        this.entities.buildFieldTuid(this.keys = keys);
        //let t = this.schemaStringify();
        for (let i in actions) {
            let schema = actions[i];
            let { name } = schema;
            let action = this.entities.newAction(name, undefined);
            action.setSchema(schema);
            this.actions[i] = action;
        }
        for (let i in queries) {
            let schema = queries[i];
            let { name } = schema;
            let query = this.entities.newQuery(name, undefined);
            query.setSchema(schema);
            this.queries[i] = query;
        }
    }
    add(param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            return yield this.actions.add.submit(param);
        });
    }
    del(param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            return yield this.actions.del.submit(param);
        });
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            return yield this.queries.all.query({});
        });
    }
    page(param, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            return yield this.queries.page.page(param, pageStart, pageSize);
        });
    }
    query(param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            return yield this.queries.query.query(param);
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
//# sourceMappingURL=map.js.map