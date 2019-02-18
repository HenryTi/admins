var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UqApi, Controller, UnitxApi, meInFrame, resLang } from 'tonva-tools';
import { Entities } from '../../entities';
import { CLink } from '../link';
import { CBook } from '../book';
import { CSheet } from '../sheet';
import { CAction } from '../action';
import { CQuery, CQuerySelect } from '../query';
import { CTuidMain, CTuidInfo, CTuidSelect, CTuidEdit, CTuidList } from '../tuid';
import { CMap } from '../map';
import { PureJSONContent } from '../form/viewModel';
import { VUq } from './vUq';
import { CHistory } from '../history';
import { CPending } from '../pending';
function lowerPropertyName(entities) {
    if (entities === undefined)
        return;
    for (let i in entities)
        entities[i.toLowerCase()] = entities[i];
}
export class CUq extends Controller /* implements Uq*/ {
    constructor(cApp, uq, appId, uqId, access, ui) {
        super(resLang(ui.res));
        this.schemaLoaded = false;
        this.isSysVisible = false;
        this.cApp = cApp;
        this.uq = uq;
        this.id = uqId;
        // 每一个ui都转换成小写的key的版本
        lowerPropertyName(ui.tuid);
        lowerPropertyName(ui.sheet);
        lowerPropertyName(ui.map);
        lowerPropertyName(ui.query);
        lowerPropertyName(ui.action);
        lowerPropertyName(ui.book);
        lowerPropertyName(ui.history);
        lowerPropertyName(ui.pending);
        this.ui = ui;
        this.CTuidMain = ui.CTuidMain || CTuidMain;
        this.CTuidEdit = ui.CTuidEdit || CTuidEdit;
        this.CTuidList = ui.CTuidList || CTuidList;
        this.CTuidSelect = ui.CTuidSelect || CTuidSelect;
        this.CTuidInfo = ui.CTuidInfo || CTuidInfo;
        this.CQuery = ui.CQuery || CQuery;
        this.CQuerySelect = ui.CQuerySelect || CQuerySelect;
        this.CMap = ui.CMap || CMap;
        this.CAction = ui.CAction || CAction;
        this.CSheet = ui.CSheet || CSheet;
        this.CBook = ui.CBook || CBook;
        this.CHistory = ui.CHistory || CHistory;
        this.CPending = ui.CPending || CPending;
        let token = undefined;
        let uqOwner, uqName;
        let p = uq.split('/');
        switch (p.length) {
            case 1:
                uqOwner = '$$$';
                uqName = p[0];
                break;
            case 2:
                uqOwner = p[0];
                uqName = p[1];
                break;
            default:
                console.log('uq must be uqOwner/uqName format');
                return;
        }
        let hash = document.location.hash;
        let baseUrl = hash === undefined || hash === '' ?
            'debug/' : 'tv/';
        let acc;
        if (access === null || access === undefined || access === '*') {
            acc = [];
        }
        else {
            acc = access.split(';').map(v => v.trim()).filter(v => v.length > 0);
        }
        let uqApi;
        if (uq === '$$$/$unitx') {
            // 这里假定，点击home link之后，已经设置unit了
            // 调用 UnitxApi会自动搜索绑定 unitx service
            uqApi = new UnitxApi(meInFrame.unit);
        }
        else {
            uqApi = new UqApi(baseUrl, uqOwner, uqName, acc, true);
        }
        this.entities = new Entities(this, uqApi, appId);
    }
    internalStart() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    loadEntites() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.entities.loadAccess();
        });
    }
    loadSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.schemaLoaded === true)
                    return;
                yield this.loadEntites();
                if (this.id === undefined)
                    this.id = this.entities.uqId;
                for (let i in this.ui) {
                    let g = this.ui[i];
                    if (g === undefined)
                        continue;
                    let { caption, collection } = g;
                    if (collection === undefined)
                        continue;
                    for (let j in collection) {
                        if (this.entities[i](j) === undefined) {
                            console.warn(i + ':' + '\'' + j + '\' is not uq entity');
                        }
                    }
                }
                this.schemaLoaded = true;
                return;
            }
            catch (err) {
                console.error(err);
                return this.error = err;
                //debugger;
                //return err.message;
            }
        });
    }
    getQuerySearch(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = this.entities.query(name);
            if (query === undefined)
                alert(`QUERY ${name} 没有定义!`);
            else {
                yield query.loadSchema();
                let { returns } = query;
                if (returns.length > 1) {
                    alert(`QUERY ${name} 返回多张表, 无法做QuerySearch`);
                }
            }
            return query;
        });
    }
    getTuidPlaceHolder(tuid) {
        let { tuidPlaceHolder, entity } = this.res;
        let { name } = tuid;
        let type;
        if (entity !== undefined) {
            let en = entity[name];
            if (en !== undefined) {
                type = en.label;
            }
        }
        return (tuidPlaceHolder || 'Select');
    }
    getNone() {
        let { none } = this.res;
        return none || 'none';
    }
    isVisible(entity) {
        return entity.sys !== true || this.isSysVisible;
    }
    navSheet(sheetTypeId, sheetId) {
        return __awaiter(this, void 0, void 0, function* () {
            let sheet = this.entities.sheetFromTypeId(sheetTypeId);
            if (sheet === undefined) {
                alert('sheetTypeId ' + sheetTypeId + ' is not exists!');
                return;
            }
            let cSheet = this.cSheet(sheet);
            yield cSheet.startSheet(sheetId);
        });
    }
    sheet(entityName) { return this.entities.sheet(entityName); }
    action(entityName) { return this.entities.action(entityName); }
    query(entityName) { return this.entities.query(entityName); }
    book(entityName) { return this.entities.book(entityName); }
    map(entityName) { return this.entities.map(entityName); }
    history(entityName) { return this.entities.history(entityName); }
    pending(entityName) { return this.entities.pending(entityName); }
    tuid(entityName) { return this.entities.tuid(entityName); }
    tuidDiv(entityName, divName) {
        let tuid = this.entities.tuid(entityName);
        if (tuid === undefined)
            return;
        let { divs } = tuid;
        if (divs === undefined)
            return;
        return divs[divName];
    }
    cSheetFromName(entityName) {
        let entity = this.entities.sheet(entityName);
        if (entity !== undefined)
            return this.cSheet(entity);
    }
    cActionFromName(entityName) {
        let entity = this.entities.action(entityName);
        if (entity !== undefined)
            return this.cAction(entity);
    }
    cQueryFromName(entityName) {
        let entity = this.entities.query(entityName);
        if (entity !== undefined)
            return this.cQuery(entity);
    }
    cBookFromName(entityName) {
        let entity = this.entities.book(entityName);
        if (entity !== undefined)
            return this.cBook(entity);
    }
    cMapFromName(entityName) {
        let entity = this.entities.map(entityName);
        if (entity !== undefined)
            return this.cMap(entity);
    }
    cHistoryFromName(entityName) {
        let entity = this.entities.history(entityName);
        if (entity !== undefined)
            return this.cHistory(entity);
    }
    cPendingFromName(entityName) {
        let entity = this.entities.pending(entityName);
        if (entity !== undefined)
            return this.cPending(entity);
    }
    cTuidMainFromName(entityName) {
        let entity = this.entities.tuid(entityName);
        if (entity !== undefined)
            return this.cTuidMain(entity);
    }
    cTuidEditFromName(entityName) {
        let entity = this.entities.tuid(entityName);
        if (entity !== undefined)
            return this.cTuidEdit(entity);
    }
    cTuidInfoFromName(entityName) {
        let entity = this.entities.tuid(entityName);
        if (entity !== undefined)
            return this.cTuidInfo(entity);
    }
    cTuidSelectFromName(entityName) {
        let entity = this.entities.tuid(entityName);
        if (entity !== undefined)
            return this.cTuidSelect(entity);
    }
    cFromName(entityType, entityName) {
        switch (entityType) {
            case 'sheet':
                let sheet = this.entities.sheet(entityName);
                if (sheet === undefined)
                    return;
                return this.cSheet(sheet);
            case 'action':
                let action = this.entities.action(entityName);
                if (action === undefined)
                    return;
                return this.cAction(action);
            case 'tuid':
                let tuid = this.entities.tuid(entityName);
                if (tuid === undefined)
                    return;
                return this.cTuidMain(tuid);
            case 'query':
                let query = this.entities.query(entityName);
                if (query === undefined)
                    return;
                return this.cQuery(query);
            case 'book':
                let book = this.entities.book(entityName);
                if (book === undefined)
                    return;
                return this.cBook(book);
            case 'map':
                let map = this.entities.map(entityName);
                if (map === undefined)
                    return;
                return this.cMap(map);
            case 'history':
                let history = this.entities.history(entityName);
                if (history === undefined)
                    return;
                return this.cHistory(history);
            case 'pending':
                let pending = this.entities.pending(entityName);
                if (pending === undefined)
                    return;
                return this.cPending(pending);
        }
    }
    linkFromName(entityType, entityName) {
        return this.link(this.cFromName(entityType, entityName));
    }
    getUI(t) {
        let ui, res;
        let { name, typeName } = t;
        if (this.ui !== undefined) {
            let tUI = this.ui[typeName];
            if (tUI !== undefined) {
                ui = tUI[name];
            }
        }
        let { entity } = this.res;
        if (entity !== undefined) {
            res = entity[name];
        }
        return { ui: ui || {}, res: res || {} };
    }
    link(cEntity) {
        return new CLink(cEntity);
    }
    get tuidLinks() {
        return this.entities.tuidArr.filter(v => this.isVisible(v)).map(v => this.link(this.cTuidMain(v)));
    }
    cTuidMain(tuid) {
        let { ui, res } = this.getUI(tuid);
        return new (ui && ui.CTuidMain || this.CTuidMain)(this, tuid, ui, res);
    }
    cTuidEdit(tuid) {
        let { ui, res } = this.getUI(tuid);
        return new (ui && ui.CTuidEdit || this.CTuidEdit)(this, tuid, ui, res);
    }
    cTuidList(tuid) {
        let { ui, res } = this.getUI(tuid);
        return new (ui && ui.CTuidList || this.CTuidList)(this, tuid, ui, res);
    }
    cTuidSelect(tuid) {
        let { ui, res } = this.getUI(tuid.owner || tuid);
        return new (ui && ui.CTuidSelect || this.CTuidSelect)(this, tuid, ui, res);
    }
    cTuidInfo(tuid) {
        let { ui, res } = this.getUI(tuid);
        return new (ui && ui.CTuidInfo || this.CTuidInfo)(this, tuid, ui, res);
    }
    cSheet(sheet /*, sheetUI?:SheetUI, sheetRes?:any*/) {
        let { ui, res } = this.getUI(sheet);
        //if (sheetUI !== undefined) ui = sheetUI;
        //if (sheetRes !== undefined) res = sheetRes;
        //return new (ui && ui.CSheet || this.CSheet)(this, sheet, sheetUI, sheetRes);
        return new (ui && ui.CSheet || this.CSheet)(this, sheet, ui, res);
    }
    get sheetLinks() {
        return this.entities.sheetArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cSheet(v));
        });
    }
    cAction(action) {
        let { ui, res } = this.getUI(action);
        return new (ui && ui.CAction || this.CAction)(this, action, ui, res);
    }
    get actionLinks() {
        return this.entities.actionArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cAction(v));
        });
    }
    cQuery(query) {
        let { ui, res } = this.getUI(query);
        return new (ui && ui.CQuery || this.CQuery)(this, query, ui, res);
    }
    cQuerySelect(queryName) {
        let query = this.entities.query(queryName);
        if (query === undefined)
            return;
        let { ui, res } = this.getUI(query);
        return new (ui && ui.CQuerySelect || this.CQuerySelect)(this, query, ui, res);
    }
    get queryLinks() {
        return this.entities.queryArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cQuery(v));
        });
    }
    cBook(book) {
        let { ui, res } = this.getUI(book);
        return new (ui && ui.CBook || this.CBook)(this, book, ui, res);
    }
    get bookLinks() {
        return this.entities.bookArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cBook(v));
        });
    }
    cHistory(history) {
        let { ui, res } = this.getUI(history);
        return new (ui && ui.CHistory || this.CHistory)(this, history, ui, res);
    }
    get historyLinks() {
        return this.entities.historyArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cHistory(v));
        });
    }
    cPending(pending) {
        let { ui, res } = this.getUI(pending);
        return new (ui && ui.CPending || this.CPending)(this, pending, ui, res);
    }
    get pendingLinks() {
        return this.entities.pendingArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cPending(v));
        });
    }
    cMap(map) {
        let { ui, res } = this.getUI(map);
        return new (ui && ui.CMap || this.CMap)(this, map, ui, res);
    }
    get mapLinks() {
        return this.entities.mapArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cMap(v));
        });
    }
    getTuidContent(tuid) {
        let { owner } = tuid;
        if (owner === undefined) {
            let { ui } = this.getUI(tuid);
            return (ui && ui.content) || PureJSONContent;
        }
        else {
            let { ui } = this.getUI(owner);
            return (ui && ui.divs && ui.divs[tuid.name].content) || PureJSONContent;
        }
    }
    showTuid(tuid, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let { owner } = tuid;
            let c = this.cTuidInfo(owner || tuid);
            yield c.start(id);
        });
    }
    get VUq() { return VUq; }
    render() {
        let v = new (this.VUq)(this);
        return v.render();
    }
}
//# sourceMappingURL=cUq.js.map