var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Entity } from './entity';
import { PageItems } from 'tonva-tools';
export class Sheet extends Entity {
    get typeName() { return 'sheet'; }
    /*
    setStates(states: SheetState[]) {
        for (let state of states) {
            this.setStateAccess(this.states.find(s=>s.name==state.name), state);
        }
    }*/
    setSchema(schema) {
        super.setSchema(schema);
        this.states = schema.states;
    }
    build(obj) {
        this.states = [];
        for (let op of obj.ops) {
            this.states.push({ name: op, actions: undefined });
        }
        /*
        for (let p in obj) {
            switch(p) {
                case '#':
                case '$': continue;
                default: this.states.push(this.createSheetState(p, obj[p])); break;
            }
        }*/
    }
    createSheetState(name, obj) {
        let ret = { name: name, actions: [] };
        let actions = ret.actions;
        for (let p in obj) {
            let action = { name: p };
            actions.push(action);
        }
        return ret;
    }
    /*
    private setStateAccess(s:SheetState, s1:SheetState) {
        if (s === undefined) return;
        for (let action of s1.actions) {
            let acn = action.name;
            let ac = s.actions.find(a=>a.name === acn);
            if (ac === undefined) continue;
            s.actions.push(action);
        }
    }*/
    save(discription, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            let { appId } = this.entities;
            let text = this.pack(data);
            let ret = yield this.tvApi.sheetSave(this.name, { app: appId, discription: discription, data: text });
            return ret;
            /*
            let {id, state} = ret;
            if (id > 0) this.changeStateCount(state, 1);
            return ret;
            */
        });
    }
    action(id, flow, state, action) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            return yield this.tvApi.sheetAction(this.name, { id: id, flow: flow, state: state, action: action });
        });
    }
    unpack(data) {
        return __awaiter(this, void 0, void 0, function* () {
            //if (this.schema === undefined) await this.loadSchema();
            let ret = data[0];
            let brief = ret[0];
            let sheetData = this.unpackSheet(brief.data);
            let flows = data[1];
            return {
                brief: brief,
                data: sheetData,
                flows: flows,
            };
        });
    }
    getSheet(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            let ret = yield this.tvApi.getSheet(this.name, id);
            if (ret[0].length === 0)
                return yield this.getArchive(id);
            return yield this.unpack(ret);
        });
    }
    getArchive(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            let ret = yield this.tvApi.sheetArchive(this.name, id);
            return yield this.unpack(ret);
        });
    }
    getArchives(pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            let ret = yield this.tvApi.sheetArchives(this.name, { pageStart: pageStart, pageSize: pageSize });
            return ret;
        });
    }
    getStateSheets(state, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            let ret = yield this.tvApi.stateSheets(this.name, { state: state, pageStart: pageStart, pageSize: pageSize });
            return ret;
        });
    }
    createPageStateItems() { return new PageStateItems(this); }
    stateSheetCount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSchema();
            let ret = yield this.tvApi.stateSheetCount(this.name);
            return this.states.map(s => {
                let n = s.name, count = 0;
                let r = ret.find(v => v.state === n);
                if (r !== undefined)
                    count = r.count;
                return { state: n, count: count };
            });
        });
    }
}
export class PageStateItems extends PageItems {
    constructor(sheet) {
        super(true);
        this.sheet = sheet;
        this.pageSize = 10;
    }
    load(param, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.sheet.getStateSheets(param, pageStart, pageSize);
            return ret;
        });
    }
    setPageStart(item) {
        this.pageStart = item === undefined ? 0 : item.id;
    }
}
//# sourceMappingURL=sheet.js.map