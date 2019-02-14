import {observable, IObservableArray} from 'mobx';
import {Entity} from './entity';
import { PageItems } from 'tonva-tools';

export interface SheetState {
    name: string;
    actions: SheetAction[];
}

export interface SheetAction {
    name: string;
}

export interface StateCount {
    state: string;
    count: number;
}

export class Sheet extends Entity {
    get typeName(): string { return 'sheet';}
    states: SheetState[];

    /*
    setStates(states: SheetState[]) {
        for (let state of states) {
            this.setStateAccess(this.states.find(s=>s.name==state.name), state);
        }
    }*/
    setSchema(schema:any) {
        super.setSchema(schema);
        this.states = schema.states;
    }
    build(obj:any) {
        this.states = [];
        for (let op of obj.ops) {
            this.states.push({name: op, actions:undefined});
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
    private createSheetState(name:string, obj:object):SheetState {
        let ret:SheetState = {name:name, actions:[]};
        let actions = ret.actions;
        for (let p in obj) {
            let action:SheetAction = {name: p};
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
    async save(discription:string, data:any):Promise<any> {
        await this.loadSchema();
        let {appId} = this.entities;
        let text = this.pack(data);

        let ret = await this.tvApi.sheetSave(this.name, {app: appId, discription: discription, data:text});
        return ret;
        /*
        let {id, state} = ret;
        if (id > 0) this.changeStateCount(state, 1);
        return ret;
        */
    }
    async action(id:number, flow:number, state:string, action:string) {
        await this.loadSchema();
        return await this.tvApi.sheetAction(this.name, {id:id, flow:flow, state:state, action:action});
    }
    private async unpack(data:any):Promise<any> {
        //if (this.schema === undefined) await this.loadSchema();
        let ret = data[0];
        let brief = ret[0];
        let sheetData = this.unpackSheet(brief.data);
        let flows = data[1];
        return {
            brief: brief,
            data: sheetData,
            flows: flows,
        }
    }
    async getSheet(id:number):Promise<any> {
        await this.loadSchema();
        let ret = await this.tvApi.getSheet(this.name, id);
        if (ret[0].length === 0) return await this.getArchive(id);
        return await this.unpack(ret);
    }
    async getArchive(id:number):Promise<any> {
        await this.loadSchema();
        let ret = await this.tvApi.sheetArchive(this.name, id)
        return await this.unpack(ret);
    }

    async getArchives(pageStart:number, pageSize:number) {
        await this.loadSchema();
        let ret = await this.tvApi.sheetArchives(this.name, {pageStart:pageStart, pageSize:pageSize});
        return ret;
    }

    async getStateSheets(state:string, pageStart:number, pageSize:number):Promise<any[]> {
        await this.loadSchema();
        let ret = await this.tvApi.stateSheets(this.name, {state:state, pageStart:pageStart, pageSize:pageSize});
        return ret;
    }
    createPageStateItems<T>(): PageStateItems<T> {return new PageStateItems<T>(this);}

    async stateSheetCount():Promise<StateCount[]> {
        await this.loadSchema();
        let ret:StateCount[] = await this.tvApi.stateSheetCount(this.name);
        return this.states.map(s => {
            let n = s.name, count = 0;
            let r = ret.find(v => v.state === n);
            if (r !== undefined) count = r.count;
            return {state: n, count: count} 
        });
    }
}

export class PageStateItems<T> extends PageItems<T> {
    private sheet: Sheet;
    constructor(sheet: Sheet) {
        super(true);
        this.sheet = sheet;
        this.pageSize = 10;
    }
    protected async load(param:any, pageStart:any, pageSize:number):Promise<any[]> {
        let ret = await this.sheet.getStateSheets(param, pageStart, pageSize);
        return ret;
    }
    protected setPageStart(item:any) {
        this.pageStart = item === undefined? 0 : item.id;
    }
}
