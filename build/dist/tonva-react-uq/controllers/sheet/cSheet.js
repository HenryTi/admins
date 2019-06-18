var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { observable } from "mobx";
import { postWsToTop } from 'tonva-tools';
import { CEntity } from "../CVEntity";
import { VSheetMain } from "./vMain";
import { VSheetNew } from "./vNew";
import { VSheetEdit } from "./vEdit";
import { VSheetAction } from "./vSheetAction";
import { VSheetSchema } from "./vSchema";
import { VArchives } from "./vArchives";
import { VSheetList } from "./vList";
import { VArchived } from "./vArchived";
import { VSheetSaved } from "./vSaved";
import { VSheetProcessing } from "./vSheetProcessing";
export class CSheet extends CEntity {
    constructor() {
        super(...arguments);
        this.statesCount = observable.array([], { deep: true });
        this.onSave = (values, valuesWithBox) => __awaiter(this, void 0, void 0, function* () {
            //let values = this.vForm.getValues();
            //let ret = await this.controller.saveSheet(values, this.vForm.values);
            let ret = yield this.saveSheet(values, valuesWithBox);
            this.ceasePage();
            //this.openPage(this.finishedPage);
            yield this.showSaved(ret);
        });
    }
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadStateSheetCount();
            this.pageStateItems = this.entity.createPageStateItems();
            yield this.openVPage(this.VSheetMain);
        });
    }
    onMessage(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let { type, body, from, to, push } = msg;
            if (type === 'sheet')
                this.onSheet(from, to, body);
        });
    }
    onSheet(from, to, sheetData) {
        let me = this.user.id;
        let { id, preState, state } = sheetData;
        console.log({ $: 'onMessage sheet', from: from, to: to.join(','), id: id, preState: preState, state: state, me: me, sheetData: sheetData });
        if (from === me) {
            this.sheetActPreState(id, preState);
        }
        if (to.find(v => v === me) !== undefined) {
            this.sheetActState(id, state, sheetData);
        }
    }
    sheetActPreState(id, preState) {
        this.changeStateCount(preState, -1);
        if (this.curState === undefined || this.curState !== preState)
            return;
        /*
        let index = this.stateSheets.findIndex(v => v.id === id);
        if (index>=0) {
            this.stateSheets.splice(index, 1);
        }*/
        let index = this.pageStateItems.items.findIndex(v => v.id === id);
        if (index >= 0) {
            this.pageStateItems.items.splice(index, 1);
        }
    }
    sheetActState(id, state, msg) {
        this.changeStateCount(state, 1);
        if (this.curState === undefined || this.curState !== state)
            return;
        /*
        if (this.stateSheets.findIndex(v => v.id === id) < 0) {
            this.stateSheets.push(msg);
        }
        */
        if (this.pageStateItems.items.findIndex(v => v.id === id) < 0) {
            this.pageStateItems.items.push(msg);
        }
    }
    changeStateCount(state, delta) {
        if (state === undefined)
            return;
        let index = this.statesCount.findIndex(v => v.state === state);
        console.log({ $: 'changeState', state: state, delta: delta, index: index });
        if (index < 0)
            return;
        let stateCount = this.statesCount[index];
        stateCount.count += delta;
        if (stateCount.count < 0)
            stateCount.count = 0;
    }
    get VSheetMain() { return (this.ui && this.ui.main) || VSheetMain; }
    get VSheetNew() { return this.ui.sheetNew || VSheetNew; }
    get VSheetSaved() { return this.ui.sheetSaved || VSheetSaved; }
    get VSheetEdit() { return this.ui.sheetEdit || VSheetEdit; }
    get VSheetSchema() { return VSheetSchema; }
    get VArchives() { return VArchives; }
    get VArchived() { return VArchived; }
    get VSheetList() { return VSheetList; }
    get VSheetAction() { return this.ui.sheetAction || VSheetAction; }
    get VSheetProcessing() { return VSheetProcessing; }
    onEvent(type, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let c;
            switch (type) {
                default: return;
                case 'new':
                    c = this.VSheetNew;
                    break;
                case 'schema':
                    c = this.VSheetSchema;
                    break;
                case 'archives':
                    c = this.VArchives;
                    break;
                case 'state':
                    this.curState = value.state;
                    c = this.VSheetList;
                    break;
                case 'archived':
                    yield this.showArchived(value);
                    return;
                case 'action':
                    yield this.showAction(value);
                    return;
                case 'processing':
                    yield this.showProcessing(value);
                    return;
            }
            yield this.openVPage(c, value);
        });
    }
    startSheet(sheetId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.beforeStart()) === false)
                return;
            yield this.onEvent('action', sheetId);
        });
    }
    showAction(sheetId) {
        return __awaiter(this, void 0, void 0, function* () {
            let sheetData = yield this.getSheetData(sheetId);
            postWsToTop({
                body: {
                    $type: 'msg',
                    action: '$sheet',
                    msg: {
                        id: sheetId,
                        uq: this.cUq.id,
                        state: sheetData.brief.state
                    }
                }
            });
            yield this.openVPage(this.VSheetAction, sheetData);
        });
    }
    showProcessing(sheetId) {
        return __awaiter(this, void 0, void 0, function* () {
            let sheetData = yield this.getSheetData(sheetId);
            yield this.openVPage(this.VSheetProcessing, sheetData);
        });
    }
    editSheet(sheetData) {
        return __awaiter(this, void 0, void 0, function* () {
            //alert('修改单据：程序正在设计中');
            let values = yield this.vCall(this.VSheetEdit, sheetData);
            return values;
        });
    }
    showArchived(inBrief) {
        return __awaiter(this, void 0, void 0, function* () {
            let sheetData = yield this.getArchived(inBrief.id);
            yield this.openVPage(this.VArchived, sheetData);
        });
    }
    showSaved(sheetData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openVPage(this.VSheetSaved, sheetData);
        });
    }
    getStateUI(stateName) {
        let { states } = this.res;
        if (states === undefined)
            return;
        return states[stateName];
    }
    getStateLabel(stateName) {
        let state = this.getStateUI(stateName);
        let ret = (state && state.label) || stateName;
        switch (ret) {
            default: return ret;
            case '$': return '新单';
        }
    }
    getActionLabel(stateName, actionName) {
        let state = this.getStateUI(stateName);
        if (state === undefined)
            return actionName;
        let actions = state.actions;
        if (actions === undefined)
            return actionName;
        let action = actions[actionName];
        return (action && action.label) || actionName;
    }
    loadStateSheetCount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.statesCount.clear();
            let statesCount = yield this.entity.stateSheetCount();
            this.statesCount.splice(0, 0, ...statesCount);
        });
    }
    getSheetData(sheetId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.entity.getSheet(sheetId);
        });
    }
    getArchived(sheetId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.entity.getArchive(sheetId);
        });
    }
    saveSheet(values, valuesWithBox) {
        return __awaiter(this, void 0, void 0, function* () {
            let { sheetTitle } = this.ui;
            let disc = sheetTitle === undefined ? this.label : sheetTitle(valuesWithBox, this.x);
            let ret = yield this.entity.save(disc, values);
            //let {id, state} = ret;
            //if (id > 0) this.changeStateCount(state, 1);
            return ret;
        });
    }
    action(id, flow, state, actionName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.entity.action(id, flow, state, actionName);
        });
    }
}
//# sourceMappingURL=cSheet.js.map