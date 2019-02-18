var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import _ from 'lodash';
import { CEntity } from "../CVEntity";
import { VTuidMain } from './vTuidMain';
import { VTuidEdit } from './vTuidEdit';
import { VTuidSelect } from './vTuidSelect';
import { VTuidInfo } from "./vTuidInfo";
import { TuidPageItems } from "./pageItems";
import { VTuidMainList } from './vTuidList';
export class CTuid extends CEntity {
    buildPageItems() {
        return new TuidPageItems(this.entity.owner || this.entity);
    }
    searchMain(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.PageItems === undefined) {
                this.PageItems = this.buildPageItems();
            }
            if (key !== undefined)
                yield this.PageItems.first(key);
        });
    }
    getDivItems(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.entity.searchArr(ownerId, undefined, 0, 1000);
            return ret;
        });
    }
}
export class CTuidMain extends CTuid {
    constructor(cUq, entity, ui, res) {
        super(cUq, entity, ui, res);
        let tuid = this.entity;
        this.proxies = tuid.proxies;
        if (this.proxies !== undefined) {
            this.proxyLinks = [];
            for (let i in this.proxies) {
                let link = this.cUq.linkFromName('tuid', i);
                this.proxyLinks.push(link);
            }
        }
    }
    from() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.entity.cFrom();
            if (ret === undefined)
                return this;
            return ret;
        });
    }
    cUqFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.entity.cUqFrom();
        });
    }
    cEditFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            let cUq = yield this.entity.cUqFrom();
            return yield cUq.cTuidEditFromName(this.entity.name);
        });
    }
    cInfoFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            let cUq = yield this.entity.cUqFrom();
            return yield cUq.cTuidInfoFromName(this.entity.name);
        });
    }
    cSelectFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            let cUq = yield this.entity.cUqFrom();
            return yield cUq.cTuidSelectFromName(this.entity.name);
        });
    }
    getLable(tuid) {
        if (tuid === this.entity)
            return this.label;
        let { name } = tuid;
        let { arrs } = this.res;
        if (arrs !== undefined) {
            let arr = arrs[name];
            if (arr !== undefined) {
                let label = arr.label;
                if (label !== undefined)
                    return label;
            }
        }
        return name;
    }
    get VTuidMain() { return VTuidMain; }
    get VTuidEdit() { return VTuidEdit; }
    get VTuidList() { return VTuidMainList; }
    internalStart(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isFrom = this.entity.schemaFrom !== undefined;
            yield this.openVPage(this.VTuidMain);
        });
    }
    onEvent(type, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let v;
            switch (type) {
                default: return;
                case 'new':
                    v = this.VTuidEdit;
                    break;
                case 'list':
                    v = this.VTuidList;
                    break;
                case 'edit':
                    yield this.edit(value);
                    return;
                case 'item-changed':
                    this.itemChanged(value);
                    return;
                case 'info':
                    let cTuidInfo = new CTuidInfo(this.cUq, this.entity, this.ui, this.res);
                    yield cTuidInfo.start(value);
                    return;
            }
            yield this.openVPage(v, value);
        });
    }
    edit(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let values = undefined;
            if (id !== undefined) {
                values = yield this.entity.load(id);
            }
            let v = this.VTuidEdit;
            yield this.openVPage(v, values);
        });
    }
    itemChanged({ id, values }) {
        if (this.PageItems === undefined)
            return;
        let items = this.PageItems.items;
        let item = items.find(v => v.id === id);
        if (item !== undefined) {
            _.merge(item, values);
        }
    }
}
export class CTuidEdit extends CTuidMain {
    internalStart(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.edit(id);
        });
    }
}
export class CTuidList extends CTuidMain {
    internalStart(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openVPage(this.VTuidList);
        });
    }
}
export class CTuidDiv extends CTuid {
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            alert('tuid div: ' + this.entity.name);
        });
    }
}
export class CTuidSelect extends CTuid {
    internalStart(param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openVPage(this.VTuidSelect, param);
        });
    }
    beforeStart() {
        return __awaiter(this, void 0, void 0, function* () {
            //if (await super.beforeStart() === false) return false;
            yield this.entity.loadSchema();
            if (this.PageItems !== undefined)
                this.PageItems.reset();
            return true;
        });
    }
    get VTuidSelect() { return VTuidSelect; }
    idFromItem(item) {
        return item.id;
    }
}
export class CTuidInfo extends CTuid {
    internalStart(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.entity.load(id);
            yield this.openVPage(this.VTuidInfo, data);
        });
    }
    get VTuidInfo() { return VTuidInfo; }
}
//# sourceMappingURL=cTuid.js.map