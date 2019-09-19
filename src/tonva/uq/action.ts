import { Entity } from './entity';
import { ActionCaller } from './caller';

export class Action extends Entity {
    get typeName(): string { return 'action';}
    async submit(data:object) {
        //await this.loadSchema();
        //let text = this.pack(data);
        //return await this.uqApi.action(this.name, {data:text});
        return await new ActionSubmitCaller(this, data).request();
    }
    async submitReturns(data:object):Promise<{[ret:string]:any[]}> {
        /*
        await this.loadSchema();
        let text = this.pack(data);
        let result = await this.uqApi.actionReturns(this.name, {data:text});
        */
       return await new SubmitReturnsCaller(this, data).request();
    }
}

export class ActionSubmitCaller extends ActionCaller {
    get path():string {return 'action/' + this.entity.name;}
    buildParams():any {return {data: this.entity.pack(this.params)}}
}

class SubmitReturnsCaller extends ActionSubmitCaller {
    get path():string {return 'action/' + this.entity.name + '/returns';}
    xresult(res:any):any {
        let {returns} = this.entity;
        let len = returns.length;
        let ret:{[r:string]:any[]} = {};
        for (let i=0; i<len; i++) {
            let retSchema = returns[i];
            ret[retSchema.name] = res[i];
        }
        return ret;
    }
}
