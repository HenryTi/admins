import { Entity } from './entity';
import { PageItems } from '../tool/pageItems';
import { EntityCaller } from './caller';

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
        /*
        await this.loadSchema();
        let {id} = this.uq;
        let text = this.pack(data);

        let ret = await this.uqApi.sheetSave(this.name, );
        return ret;
        */
        let {id} = this.uq;
        //let text = this.pack(data);
        let params = {app: id, discription: discription, data:data};
        return await new SaveCaller(this, params).request();
        /*
        let {id, state} = ret;
        if (id > 0) this.changeStateCount(state, 1);
        return ret;
        */
    }
    async action(id:number, flow:number, state:string, action:string) {
        /*
        await this.loadSchema();
        return await this.uqApi.sheetAction(this.name, {id:id, flow:flow, state:state, action:action});
        */
        return await new ActionCaller(this, {id:id, flow:flow, state:state, action:action}).request();
    }
    private unpack(data:any):any {
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
        /*
        await this.loadSchema();
        let ret = await this.uqApi.getSheet(this.name, id);
        */
        let ret = await new GetSheetCaller(this, id).request();
        if (ret[0].length === 0) return await this.getArchive(id);
        return this.unpack(ret);
    }
    async getArchive(id:number):Promise<any> {
        /*
        await this.loadSchema();
        let ret = await this.uqApi.sheetArchive(this.name, id)
        return this.unpack(ret);
        */
        let ret = await new SheetArchiveCaller(this, id).request();
        return this.unpack(ret);
    }

    async getArchives(pageStart:number, pageSize:number) {
        /*
        await this.loadSchema();
        let ret = await this.uqApi.sheetArchives(this.name, {pageStart:pageStart, pageSize:pageSize});
        return ret;
        */
        let params = {pageStart:pageStart, pageSize:pageSize};
        return await new SheetArchivesCaller(this, params).request();
    }

    async getStateSheets(state:string, pageStart:number, pageSize:number):Promise<any[]> {
        /*
        await this.loadSchema();
        let ret = await this.uqApi.stateSheets(this.name, {state:state, pageStart:pageStart, pageSize:pageSize});
        return ret;
        */
        let params = {state:state, pageStart:pageStart, pageSize:pageSize};
        return await new StateSheetsCaller(this, params).request();
    }
    createPageStateItems<T>(): PageStateItems<T> {return new PageStateItems<T>(this);}

    async stateSheetCount():Promise<StateCount[]> {
        /*
        await this.loadSchema();
        let ret:StateCount[] = await this.uqApi.stateSheetCount(this.name);
        return this.states.map(s => {
            let n = s.name, count = 0;
            let r = ret.find(v => v.state === n);
            if (r !== undefined) count = r.count;
            return {state: n, count: count} 
        });
        */
        return await new StateSheetCountCaller(this, undefined).request();
    }

    async mySheets(state:string, pageStart:number, pageSize:number):Promise<any[]> {
        /*
        await this.loadSchema();
        let ret = await this.uqApi.mySheets(this.name, {state:state, pageStart:pageStart, pageSize:pageSize});
        return ret;
        */
        let params = {state:state, pageStart:pageStart, pageSize:pageSize};
        return await new MySheetsCaller(this, params).request();
    }
}


abstract class SheetCaller<T> extends EntityCaller<T> {
    protected get entity(): Sheet {return this._entity as Sheet;}
    protected readonly suffix:string;
    get path():string {return `sheet/${this.entity.name}/${this.suffix}`;}
}

class SaveCaller extends SheetCaller<{app:number; discription:string; data:any}> {
    get path():string {return `sheet/${this.entity.name}`;}
    buildParams() {
        let {app, discription, data} = this.params;
        return {
            app: app,
            discription: discription,
            data: this.entity.pack(data)
        };
    }
}

class ActionCaller extends SheetCaller<{id:number, flow:number, state:string, action:string}> {
    method = 'PUT';
    get path():string {return `sheet/${this.entity.name}`;}
    //buildParams() {return this.entity.buildParams(this.params);}
}

class GetSheetCaller extends SheetCaller<number> {
    //protected readonly params: number;  // id
    method = 'GET';
    //private id:number;
    //protected readonly suffix = 'archive';
    buildParams() {}
    get path():string {return `sheet/${this.entity.name}/get/${this.params}`;}
}

class SheetArchiveCaller extends SheetCaller<number> {
    protected readonly params: number;  // id
    method = 'GET';
    //protected readonly suffix = 'archive';
    buildParams() {}
    get path():string {return `sheet/${this.entity.name}/archive/${this.params}`;}
}

class SheetArchivesCaller extends SheetCaller<{pageStart:number, pageSize:number}> {
    protected readonly suffix = 'archives';
}

class StateSheetsCaller extends SheetCaller<{state:string, pageStart:number, pageSize:number}> {
    protected readonly suffix = 'states';
}

class StateSheetCountCaller extends SheetCaller<undefined> {
    method = 'GET';
    protected readonly suffix = 'statecount';
    xresult(res:any):any {
        let {states} = this.entity;
        return states.map(s => {
            let n = s.name, count = 0;
            let r = (res as any[]).find(v => v.state === n);
            if (r !== undefined) count = r.count;
            return {state: n, count: count} 
        });
    }
}

class MySheetsCaller extends SheetCaller<{state:string, pageStart:number, pageSize:number}> {
    protected readonly suffix = 'my-sheets';
    xresult(res:any):any {
        return res;
        /*
        let {returns} = this.entity;
        let len = returns.length;
        let ret:{[r:string]:any[]} = {};
        for (let i=0; i<len; i++) {
            let retSchema = returns[i];
            ret[retSchema.name] = res[i];
        }
        return ret;
        */
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
