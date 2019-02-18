import { IObservableArray, observable } from "mobx";
import { TypeVPage, VPage, PageItems, postWsToTop } from 'tonva-tools';
import { Sheet, StateCount } from "../../entities";
import { CEntity, EntityUI, VEntity } from "../CVEntity";
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

export interface SheetActionUI {
    label: string;
}

export interface StateUI {
    label: string;
    actions: {[name:string]: SheetActionUI}
}

export interface SheetUI extends EntityUI {
    CSheet?: typeof CSheet;
    states?: {[name:string]: StateUI};
    main?: TypeVPage<CSheet>;
    sheetNew?: TypeVPage<CSheet>;
    sheetSaved?: TypeVPage<CSheet>;
    sheetEdit?: TypeVPage<CSheet>;
    sheetAction?: TypeVPage<CSheet>;
    listRow?: (row:any) => JSX.Element;
    sheetTitle?: (sheetValues:any, x:any) => string;      // 返回单据的描述
}

export interface SheetData {
    brief: any;
    data: any;
    flows: any[];
}

export class CSheet extends CEntity<Sheet, SheetUI> {
    statesCount:IObservableArray<StateCount> = observable.array<StateCount>([], {deep:true});
    curState:string;
    pageStateItems: PageItems<any>;

    protected async internalStart() {
        await this.loadStateSheetCount();
        this.pageStateItems = this.entity.createPageStateItems();
        await this.openVPage(this.VSheetMain);
    }

    protected async onMessage(msg: any):Promise<void> {
        let {type, body, from, to, push} = msg;
        if (type === 'sheet') this.onSheet(from, to, body);
    }
    private onSheet(from:number, to:number[], sheetData:any) {
        let me = this.user.id;
        let {id, preState, state} = sheetData;
        console.log({$:'onMessage sheet', from:from, to:to.join(','), id:id, preState:preState, state:state, me:me, sheetData:sheetData})
        if (from === me) {
            this.sheetActPreState(id, preState);
        }
        if (to.find(v=>v===me) !== undefined) {
            this.sheetActState(id, state, sheetData);
        }
    }
    private sheetActPreState(id:number, preState:string) {
        this.changeStateCount(preState, -1);
        if (this.curState === undefined || this.curState !== preState) return;
        /*
        let index = this.stateSheets.findIndex(v => v.id === id);
        if (index>=0) {
            this.stateSheets.splice(index, 1);
        }*/
        let index = this.pageStateItems.items.findIndex(v => v.id === id);
        if (index>=0) {
            this.pageStateItems.items.splice(index, 1);
        }
    }

    private sheetActState(id:number, state:string, msg:any) {
        this.changeStateCount(state, 1);
        if (this.curState === undefined || this.curState !== state) return;
        /*
        if (this.stateSheets.findIndex(v => v.id === id) < 0) {
            this.stateSheets.push(msg);
        }
        */
        if (this.pageStateItems.items.findIndex(v => v.id === id) < 0) {
            this.pageStateItems.items.push(msg);
        }
    }

    private changeStateCount(state:string, delta:number) {
        if (state === undefined) return;
        let index = this.statesCount.findIndex(v => v.state === state);
        console.log({$:'changeState', state: state, delta: delta, index: index});
        if (index < 0) return;
        let stateCount = this.statesCount[index];
        stateCount.count += delta;
        if (stateCount.count < 0) stateCount.count = 0;
    }

    protected get VSheetMain():TypeVPage<CSheet> {return (this.ui&&this.ui.main) || VSheetMain}
    protected get VSheetNew(): TypeVPage<CSheet> {return this.ui.sheetNew || VSheetNew}
    protected get VSheetSaved(): TypeVPage<CSheet> {return this.ui.sheetSaved || VSheetSaved}
    protected get VSheetEdit(): TypeVPage<CSheet> {return this.ui.sheetEdit || VSheetEdit}
    protected get VSheetSchema(): TypeVPage<CSheet> {return VSheetSchema}
    protected get VArchives(): TypeVPage<CSheet> {return VArchives}
    protected get VArchived(): TypeVPage<CSheet> {return VArchived}
    protected get VSheetList(): TypeVPage<CSheet> {return VSheetList}
    protected get VSheetAction(): TypeVPage<CSheet> {return this.ui.sheetAction || VSheetAction}
    protected get VSheetProcessing(): TypeVPage<CSheet> {return VSheetProcessing}
    protected async onEvent(type:string, value:any) {
        let c: TypeVPage<CSheet>;
        switch (type) {
            default: return;
            case 'new': c = this.VSheetNew; break;
            case 'schema': c = this.VSheetSchema; break;
            case 'archives': c = this.VArchives; break;
            case 'state':
                this.curState = value.state;
                c = this.VSheetList;
                break;
            case 'archived':
                await this.showArchived(value); return;
            case 'action':
                await this.showAction(value); return;
            case 'processing':
                await this.showProcessing(value); return;
        }
        await this.openVPage(c, value);
    }

    async startSheet(sheetId:number) {
        if (await this.beforeStart() === false) return;
        await this.onEvent('action', sheetId);
    }

    async showAction(sheetId:number) {
        let sheetData:SheetData = await this.getSheetData(sheetId);
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
        await this.openVPage(this.VSheetAction, sheetData);
    }

    async showProcessing(sheetId:number) {
        let sheetData:SheetData = await this.getSheetData(sheetId);
        await this.openVPage(this.VSheetProcessing, sheetData);
    }

    async editSheet(sheetData:SheetData):Promise<any> {
        //alert('修改单据：程序正在设计中');
        let values = await this.vCall(this.VSheetEdit, sheetData);
        return values;
    }

    async showArchived(inBrief:any) {
        let sheetData = await this.getArchived(inBrief.id);
        await this.openVPage(this.VArchived, sheetData);
    }

    onSave = async (values:any, valuesWithBox:any):Promise<void> => {
        //let values = this.vForm.getValues();
        //let ret = await this.controller.saveSheet(values, this.vForm.values);
        let ret = await this.saveSheet(values, valuesWithBox);
        this.ceasePage();
        //this.openPage(this.finishedPage);
        await this.showSaved(ret);
    }

    async showSaved(sheetData:any) {
        await this.openVPage(this.VSheetSaved, sheetData);
    }

    private getStateUI(stateName:string) {
        let {states} = this.res;
        if (states === undefined) return;
        return states[stateName];
    }
    getStateLabel(stateName:string) {
        let state = this.getStateUI(stateName);
        let ret = (state && state.label) || stateName;
        switch (ret) {
            default: return ret;
            case '$': return '新单';
        }
    }
    getActionLabel(stateName:string, actionName:string) {
        let state = this.getStateUI(stateName);
        if (state === undefined) return actionName;
        let actions = state.actions;
        if (actions === undefined) return actionName;
        let action = actions[actionName];
        return (action && action.label) || actionName;
    }

    private async loadStateSheetCount():Promise<void> {
        this.statesCount.clear();
        let statesCount = await this.entity.stateSheetCount();
        this.statesCount.splice(0, 0, ...statesCount);
    }

    async getSheetData(sheetId:number):Promise<SheetData> {
        return await this.entity.getSheet(sheetId);
    }

    async getArchived(sheetId:number):Promise<SheetData> {
        return await this.entity.getArchive(sheetId);
    }

    async saveSheet(values:any, valuesWithBox:any):Promise<any> {
        let {sheetTitle} = this.ui;
        let disc = sheetTitle === undefined? this.label : sheetTitle(valuesWithBox, this.x);
        let ret = await this.entity.save(disc, values);
        //let {id, state} = ret;
        //if (id > 0) this.changeStateCount(state, 1);
        return ret;
    }

    async action(id:number, flow:number, state:string, actionName:string):Promise<any> {
        return await this.entity.action(id, flow, state, actionName);
    }
}
