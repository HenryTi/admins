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
import { fieldDefaultValue } from "../../entities";
import { VMapMain } from "./vMain";
import { observable } from "mobx";
import { PureJSONContent } from '../form/viewModel';
import { VInputValues } from './inputValues';
export class MapItem {
    constructor(parent, tuid, box, keyIndex) {
        this.children = observable.array([], { deep: true });
        this.parent = parent;
        this.tuid = tuid;
        this.box = box;
        this.keyIndex = keyIndex;
        this.isLeaf = false;
    }
}
export class CMap extends CEntity {
    constructor() {
        super(...arguments);
        this.addClick = (item) => __awaiter(this, void 0, void 0, function* () {
            let { keyIndex, children } = item;
            let keysLen = this.keyFields.length;
            let keysLast = keysLen - 1;
            let idx = keyIndex + 1;
            if (idx >= keysLen)
                return;
            let keyField = this.keyFields[idx];
            let kn = keyField.name;
            let tuid = keyField._tuid;
            let searchParam = {};
            let data = {};
            for (let p = item; p !== undefined; p = p.parent) {
                let { keyIndex: ki, box } = p;
                let kn = this.keyFields[ki].name;
                //searchParam[kn] = data['_' + kn] = box.id;
                searchParam[kn] = data[kn] = box.id;
            }
            let id = yield this.searchOnKey(keyField, searchParam);
            if (id === undefined || id <= 0)
                return;
            tuid.useId(id);
            let idBox = tuid.boxId(id);
            let arr1 = {};
            let values = {};
            if (keyIndex + 1 === keysLast) {
                tuid.useId(id);
                //values[kn] = arr1['_' + kn] = idBox;
                values[kn] = arr1[kn] = idBox;
                if (this.entity.fields.length > 0) {
                    let ret = yield this.vCall(VInputValues, data);
                    for (let i in ret) {
                        //values[i] = arr1['_' + i] = ret[i];
                        values[i] = arr1[i] = ret[i];
                    }
                }
            }
            else {
                //values[kn] = data['_' + kn] = idBox;
                values[kn] = data[kn] = idBox;
                for (let i = idx + 1; i < keysLast; i++) {
                    //data['_' + this.keyFields[i].name] = 0;
                    data[this.keyFields[i].name] = 0;
                }
                // 填map的key field 0 值
                //arr1['_' + this.keyFields[keysLast].name] = 0;
                arr1[this.keyFields[keysLast].name] = 0;
                let { fields } = this.entity;
                for (let f of fields) {
                    let { name, type, null: nullable } = f;
                    if (!(nullable === true)) {
                        //arr1['_' + f.name] = fieldDefaultValue(type);
                        arr1[f.name] = fieldDefaultValue(type);
                    }
                }
            }
            data.arr1 = [arr1];
            yield this.entity.actions.add.submit(data);
            let rowIndex = children.findIndex(v => v.box.id === id);
            if (rowIndex < 0) {
                children.push(this.createItem(item, tuid, idBox, idx, values));
            }
            else {
                let { fields } = this.entity;
                if (fields !== undefined && fields.length > 0) {
                    let row = children[rowIndex];
                    children.splice(rowIndex, 1);
                    row.values = values;
                    /*
                    for (let f of fields) {
                        let {name:fn} = f;
                        row.values[fn] = values[fn];
                    }*/
                    children.splice(rowIndex, 0, row);
                }
            }
            this.removeCeased();
        });
        this.removeClick = (item) => __awaiter(this, void 0, void 0, function* () {
            let keyField = this.keyFields[item.keyIndex];
            let tuid = keyField._tuid;
            let cTuidMain = this.cUq.cTuidMain(tuid.Main);
            let label = cTuidMain.getLable(tuid);
            let confirmDelete = this.res.confirmDelete
                || _.template('do you really want to remove ${label}?');
            if (confirm(confirmDelete({ label: label })) === false)
                return;
            let map = this.entity;
            let data = {};
            let arr1 = data['arr1'] = [];
            let v0 = {};
            arr1.push(v0);
            for (let p = item; p !== undefined; p = p.parent) {
                let ki = p.keyIndex;
                //v0['_'+this.keyFields[ki].name] = p.box.id;
                v0[this.keyFields[ki].name] = p.box.id;
            }
            let len = this.keyFields.length;
            for (let i = item.keyIndex + 1; i < len; i++) {
                let k = this.keyFields[i];
                //v0['_'+k.name] = -1;
                v0[k.name] = -1;
            }
            yield map.actions.del.submit(data);
            let children = item.parent.children;
            let index = children.findIndex(v => v === item);
            if (index >= 0)
                children.splice(index, 1);
        });
    }
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            let { keys, schemaFrom } = this.entity;
            this.isFrom = schemaFrom !== undefined;
            let q = this.entity.queries.all;
            let result = yield q.query({});
            //let data = await this.entity.unpackReturns(res);
            let ret = result.ret;
            let keysLen = keys.length;
            this.keyUIs = _.clone(this.ui.keys || []);
            this.keyFields = [];
            let retFields = q.returns[0].fields;
            for (let i = 0; i < keysLen; i++) {
                this.keyFields.push(retFields[i]);
                if (i >= this.keyUIs.length) {
                    this.keyUIs.push({
                        content: PureJSONContent,
                    });
                }
            }
            this.items = observable([]);
            let item = undefined;
            for (let r of ret) {
                let newItem = this.addItem(item, r);
                if (newItem !== undefined) {
                    this.items.push(newItem);
                    item = newItem;
                }
            }
            yield this.openVPage(this.VMapMain);
        });
    }
    createItem(parent, tuid, box, keyIndex, values) {
        let item = new MapItem(parent, tuid, box, keyIndex);
        if (keyIndex === this.keyFields.length - 1) {
            item.isLeaf = true;
            item.values = values;
        }
        return item;
    }
    addItem(item, row) {
        let ret = undefined;
        let keysLen = this.keyFields.length;
        let p = item;
        for (let i = 0; i < keysLen; i++) {
            let key = this.keyFields[i];
            let { name } = key;
            let tuid = key._tuid;
            let val = row[name];
            if (val === undefined)
                break;
            let { id } = val;
            if (i === 0) {
                if (id === 0)
                    continue;
                if (p === undefined || p.box.id !== id) {
                    ret = p = this.createItem(undefined, tuid, val, i, row);
                }
                continue;
            }
            let { children, box } = p;
            let len = children.length;
            if (len > 0) {
                let n = children[len - 1];
                if (n.box.id === id) {
                    p = n;
                    continue;
                }
            }
            if (id > 0) {
                children.push(p = this.createItem(p, tuid, val, i, row));
            }
        }
        return ret;
    }
    searchOnKey(keyField, param) {
        return __awaiter(this, void 0, void 0, function* () {
            let { _tuid, _ownerField } = keyField;
            let cTuidSelect = this.cUq.cTuidSelect(_tuid);
            let callParam = param;
            if (_ownerField !== undefined) {
                callParam = param[_ownerField.name];
                if (typeof callParam === 'object') {
                    callParam = callParam.id;
                }
            }
            let ret = yield cTuidSelect.call(callParam);
            return _tuid.getIdFromObj(ret);
        });
    }
    get VMapMain() { return VMapMain; }
}
//# sourceMappingURL=cMap.js.map