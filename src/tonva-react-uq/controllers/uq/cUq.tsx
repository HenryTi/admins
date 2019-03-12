import * as React from 'react';
import _ from 'lodash';
import { UqApi, Controller, UnitxApi, appInFrame, resLang, nav } from 'tonva-tools';
import { Entities, TuidMain, Action, Sheet, Query, Book, Map, Entity, Tuid, History, Pending } from '../../entities';
import { CLink } from '../link';
import { CBook, BookUI } from '../book';
import { CSheet, SheetUI } from '../sheet';
import { ActionUI, CAction } from '../action';
import { QueryUI, CQuery, CQuerySelect } from '../query';
import { CTuidMain, TuidUI, CTuid, CTuidInfo, CTuidSelect, CTuidEdit, CTuidList } from '../tuid';
import { MapUI, CMap } from '../map';
import { CEntity, EntityUI } from '../CVEntity';
import { PureJSONContent } from '../form/viewModel';
import { VUq } from './vUq';
import { CHistory, HistoryUI } from '../history';
import { CPending, PendingUI } from '../pending';
import { CApp } from '../CApp';

export type EntityType = 'sheet' | 'action' | 'tuid' | 'query' | 'book' | 'map' | 'history' | 'pending';

export interface UqUI {
    CTuidMain?: typeof CTuidMain;
    CTuidEdit?: typeof CTuidEdit;
    CTuidList?: typeof CTuidList;
    CTuidSelect?: typeof CTuidSelect;
    CTuidInfo?: typeof CTuidInfo;
    CQuery?: typeof CQuery;
    CQuerySelect?: typeof CQuerySelect;
    CMap?: typeof CMap;
    CAction?: typeof CAction;
    CSheet?: typeof CSheet;
    CBook?: typeof CBook;
    CHistory?: typeof CHistory;
    CPending?: typeof CPending;
    tuid?: {[name:string]: TuidUI};
    sheet?: {[name:string]: SheetUI};
    action?: {[name:string]: ActionUI};
    map?: {[name:string]: MapUI};
    query?: {[name:string]: QueryUI};
    book?: {[name:string]: BookUI};    
    history?: {[name:string]: HistoryUI};
    pending?: {[name:string]: PendingUI};
    res?: any;
}

function lowerPropertyName(entities: {[name:string]: EntityUI}) {
    if (entities === undefined) return;
    for (let i in entities) entities[i.toLowerCase()] = entities[i];
}

export class CUq extends Controller /* implements Uq*/ {
    private ui:any;
    private CTuidMain: typeof CTuidMain;
    private CTuidEdit: typeof CTuidEdit;
    private CTuidList: typeof CTuidList;
    private CTuidSelect: typeof CTuidSelect;
    private CTuidInfo: typeof CTuidInfo;
    private CQuery: typeof CQuery;
    private CQuerySelect: typeof CQuerySelect;
    private CMap: typeof CMap;
    private CAction: typeof CAction;
    private CSheet: typeof CSheet;
    private CBook: typeof CBook;
    private CHistory: typeof CHistory;
    private CPending: typeof CPending;

    constructor(cApp:CApp, uq:string, appId:number, uqId:number, access:string, ui:UqUI) {
        super(resLang(ui.res));
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
        let uqOwner:string, uqName:string;
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
        let baseUrl = hash===undefined || hash===''? 
            'debug/':'tv/';

        let acc: string[];
        if (access === null || access === undefined || access === '*') {
            acc = [];
        }
        else {
            acc = access.split(';').map(v => v.trim()).filter(v => v.length > 0);
        }
        let uqApi:UqApi;
        if (uq === '$$$/$unitx') {
            // 这里假定，点击home link之后，已经设置unit了
            // 调用 UnitxApi会自动搜索绑定 unitx service
            uqApi = new UnitxApi(appInFrame.unit);
        }
        else {
            uqApi = new UqApi(baseUrl, uqOwner, uqName, acc, true);
        }
        this.entities = new Entities(this, uqApi, appId);
    }

    protected async internalStart() {
    }

    cApp:CApp;
    uq: string;
    id: number;
    res: any;
    entities:Entities;
    error: string;
    private schemaLoaded:boolean = false;

    protected async loadEntites() {
        await this.entities.loadAccess();
    }

    async loadSchema():Promise<string> {
        try {
            if (this.schemaLoaded === true) return;
            await this.loadEntites();
            if (this.id === undefined) this.id = this.entities.uqId;

            for (let i in this.ui) {
                let g = this.ui[i];
                if (g === undefined) continue;
                let {caption, collection} = g;
                if (collection === undefined) continue;
                for (let j in collection) {
                    if (this.entities[i](j) === undefined) {
                        console.warn(i + ':' + '\'' + j + '\' is not uq entity');
                    }
                }
            }
            this.schemaLoaded = true;
            return;
        }
        catch(err) {
            console.error(err);
            return this.error = err;
            //debugger;
            //return err.message;
        }
    }

    async getQuerySearch(name:string):Promise<Query> {
        let query = this.entities.query(name);
        if (query === undefined) 
            alert(`QUERY ${name} 没有定义!`);
        else {
            await query.loadSchema();
            let {returns} = query;
            if (returns.length > 1) {
                alert(`QUERY ${name} 返回多张表, 无法做QuerySearch`);
            }
        }
        return query;
    }
    getTuidPlaceHolder(tuid:Tuid) {
        let {tuidPlaceHolder, entity} = this.res;
        let {name} = tuid;
        let type:string;
        if (entity !== undefined) {
            let en = entity[name];
            if (en !== undefined) {
                type = en.label;
            }
        }
        return (tuidPlaceHolder || 'Select');
    }
    getNone() {
        let {none} = this.res;
        return none || 'none';
    }
    protected isSysVisible = false;
    protected isVisible(entity: Entity):boolean {
        return entity.sys !== true || this.isSysVisible;
    }

    async navSheet(sheetTypeId:number, sheetId:number) {
        let sheet = this.entities.sheetFromTypeId(sheetTypeId);
        if (sheet === undefined) {
            alert('sheetTypeId ' + sheetTypeId + ' is not exists!');
            return;
        }
        let cSheet = this.cSheet(sheet);
        await cSheet.startSheet(sheetId);
    }

    sheet(entityName:string) {return this.entities.sheet(entityName);}
    action(entityName:string) {return this.entities.action(entityName);}
    query(entityName:string) {return this.entities.query(entityName);}
    book(entityName:string) {return this.entities.book(entityName);}
    map(entityName:string) {return this.entities.map(entityName);}
    history(entityName:string) {return this.entities.history(entityName);}
    pending(entityName:string) {return this.entities.pending(entityName);}
    tuid(entityName:string) {return this.entities.tuid(entityName)}
    tuidDiv(entityName:string, divName:string) {
        let tuid = this.entities.tuid(entityName);
        if (tuid === undefined) return;
        let {divs} = tuid;
        if (divs === undefined) return;
        return divs[divName];
    }

    cSheetFromName(entityName:string):CSheet {
        let entity = this.entities.sheet(entityName);
        if (entity !== undefined) return this.cSheet(entity);
    }
    cActionFromName(entityName:string) {
        let entity = this.entities.action(entityName);
        if (entity !== undefined) return this.cAction(entity);
    }
    cQueryFromName(entityName:string) {
        let entity = this.entities.query(entityName);
        if (entity !== undefined) return this.cQuery(entity);
    }
    cBookFromName(entityName:string) {
        let entity = this.entities.book(entityName);
        if (entity !== undefined) return this.cBook(entity);
    }
    cMapFromName(entityName:string) {
        let entity = this.entities.map(entityName);
        if (entity !== undefined) return this.cMap(entity);
    }
    cHistoryFromName(entityName:string) {
        let entity = this.entities.history(entityName);
        if (entity !== undefined) return this.cHistory(entity);
    }
    cPendingFromName(entityName:string) {
        let entity = this.entities.pending(entityName);
        if (entity !== undefined) return this.cPending(entity);
    }
    cTuidMainFromName(entityName:string) {
        let entity = this.entities.tuid(entityName);
        if (entity !== undefined) return this.cTuidMain(entity);
    }
    cTuidEditFromName(entityName:string) {
        let entity = this.entities.tuid(entityName);
        if (entity !== undefined) return this.cTuidEdit(entity);
    }
    cTuidInfoFromName(entityName:string) {
        let entity = this.entities.tuid(entityName);
        if (entity !== undefined) return this.cTuidInfo(entity);
    }

    cTuidSelectFromName(entityName:string) {
        let entity = this.entities.tuid(entityName);
        if (entity !== undefined) return this.cTuidSelect(entity);
    }

    cFromName(entityType:EntityType, entityName:string): CEntity<Entity, EntityUI> {
        switch (entityType) {
            case 'sheet':
                let sheet = this.entities.sheet(entityName);
                if (sheet === undefined) return;
                return this.cSheet(sheet);
            case 'action':
                let action = this.entities.action(entityName);
                if (action === undefined) return;
                return this.cAction(action);
            case 'tuid':
                let tuid = this.entities.tuid(entityName);
                if (tuid === undefined) return;
                return this.cTuidMain(tuid);
            case 'query':
                let query = this.entities.query(entityName);
                if (query === undefined) return;
                return this.cQuery(query);
            case 'book':
                let book = this.entities.book(entityName);
                if (book === undefined) return;
                return this.cBook(book);
            case 'map':
                let map = this.entities.map(entityName);
                if (map === undefined) return;
                return this.cMap(map);
            case 'history':
                let history = this.entities.history(entityName);
                if (history === undefined) return;
                return this.cHistory(history);
            case 'pending':
                let pending = this.entities.pending(entityName);
                if (pending === undefined) return;
                return this.cPending(pending);
        }
    }

    linkFromName(entityType:EntityType, entityName:string) {
        return this.link(this.cFromName(entityType, entityName));
    }

    private getUI<T extends Entity, UI extends EntityUI>(t:T):{ui:UI, res:any} {
        let ui, res;
        let {name, typeName} = t;
        if (this.ui !== undefined) {
            let tUI = this.ui[typeName];
            if (tUI !== undefined) {
                ui = tUI[name];
            }
        }
        let {entity} = this.res;
        if (entity !== undefined) {
            res = entity[name];
        }
        return {ui: ui || {}, res: res || {} };
    }

    link(cEntity:CEntity<Entity, EntityUI>) {
        return new CLink(cEntity);
    }

    get tuidLinks() {
        return this.entities.tuidArr.filter(v => this.isVisible(v)).map(v => this.link(this.cTuidMain(v)));
    }
    cTuidMain(tuid:TuidMain):CTuidMain {
        let {ui, res} = this.getUI<TuidMain, TuidUI>(tuid);
        return new (ui && ui.CTuidMain || this.CTuidMain)(this, tuid, ui, res);
    }
    cTuidEdit(tuid:TuidMain):CTuidEdit {
        let {ui, res} = this.getUI<TuidMain, TuidUI>(tuid);
        return new (ui && ui.CTuidEdit || this.CTuidEdit)(this, tuid, ui, res);
    }
    cTuidList(tuid:TuidMain):CTuidList {
        let {ui, res} = this.getUI<TuidMain, TuidUI>(tuid);
        return new (ui && ui.CTuidList || this.CTuidList)(this, tuid, ui, res);
    }
    cTuidSelect(tuid:Tuid):CTuidSelect {
        let {ui, res} = this.getUI<Tuid, TuidUI>(tuid.owner || tuid);
        return new (ui && ui.CTuidSelect || this.CTuidSelect)(this, tuid, ui, res);
    }
    cTuidInfo(tuid:TuidMain):CTuidInfo {
        let {ui, res} = this.getUI<Tuid, TuidUI>(tuid);
        return new (ui && ui.CTuidInfo || this.CTuidInfo)(this, tuid, ui, res);
    }

    cSheet(sheet:Sheet/*, sheetUI?:SheetUI, sheetRes?:any*/):CSheet {
        let {ui, res} = this.getUI<Sheet, SheetUI>(sheet);
        //if (sheetUI !== undefined) ui = sheetUI;
        //if (sheetRes !== undefined) res = sheetRes;
        //return new (ui && ui.CSheet || this.CSheet)(this, sheet, sheetUI, sheetRes);
        return new (ui && ui.CSheet || this.CSheet)(this, sheet, ui, res);
    }
    get sheetLinks() { 
        return this.entities.sheetArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cSheet(v))
        });
    }

    cAction(action:Action):CAction {
        let {ui, res} = this.getUI<Action, ActionUI>(action);
        return new (ui && ui.CAction || this.CAction)(this, action, ui, res);
    }
    get actionLinks() { 
        return this.entities.actionArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cAction(v))
        });
    }

    cQuery(query:Query):CQuery {
        let {ui, res} = this.getUI<Query, QueryUI>(query);
        return new (ui && ui.CQuery || this.CQuery)(this, query, ui, res);
    }
    cQuerySelect(queryName:string):CQuerySelect {
        let query = this.entities.query(queryName);
        if (query === undefined) return;
        let {ui, res} = this.getUI<Query, QueryUI>(query);
        return new (ui && ui.CQuerySelect || this.CQuerySelect)(this, query, ui, res);
    }
    get queryLinks() {
        return this.entities.queryArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cQuery(v))
        });
    }
    
    cBook(book:Book):CBook {
        let {ui, res} = this.getUI<Book, BookUI>(book);
        return new (ui && ui.CBook || this.CBook)(this, book, ui, res);
    }
    get bookLinks() { 
        return this.entities.bookArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cBook(v))
        });
    }
    
    cHistory(history:History):CHistory {
        let {ui, res} = this.getUI<History, HistoryUI>(history);
        return new (ui && ui.CHistory || this.CHistory)(this, history, ui, res);
    }
    get historyLinks() { 
        return this.entities.historyArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cHistory(v))
        });
    }
    
    cPending(pending:Pending):CPending {
        let {ui, res} = this.getUI<Pending, PendingUI>(pending);
        return new (ui && ui.CPending || this.CPending)(this, pending, ui, res);
    }
    get pendingLinks() { 
        return this.entities.pendingArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cPending(v))
        });
    }
    
    cMap(map:Map):CMap {
        let {ui, res} = this.getUI<Map, MapUI>(map);
        return new (ui && ui.CMap || this.CMap)(this, map, ui, res);
    }
    get mapLinks() { 
        return this.entities.mapArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cMap(v));
        });
    }

    getTuidContent(tuid:Tuid): React.StatelessComponent<any> {
        let {owner} = tuid;
        if (owner === undefined) {
            let {ui} = this.getUI<Tuid, TuidUI>(tuid);
            return (ui && ui.content) || PureJSONContent;
        }
        else {
            let {ui} = this.getUI<Tuid, TuidUI>(owner);
            return (ui && ui.divs && ui.divs[tuid.name].content) || PureJSONContent;
        }
    }

    async showTuid(tuid:Tuid, id:number):Promise<void> {
        let {owner} = tuid;
        let c = this.cTuidInfo(owner || (tuid as TuidMain));
        await c.start(id);
    }

    protected get VUq():typeof VUq {return VUq}

    render() {
        let v = new (this.VUq)(this);
        return v.render();
    }
}

