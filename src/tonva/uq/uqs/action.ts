import {Entity} from './entity';

export class Action extends Entity {
    get typeName(): string { return 'action';}
    async submit(data:object) {
        await this.loadSchema();
        let text = this.pack(data);
        return await this.uqApi.action(this.name, {data:text});
    }
    async submitReturns(data:object):Promise<{[ret:string]:any[]}> {
        await this.loadSchema();
        let text = this.pack(data);
        let result = await this.uqApi.actionReturns(this.name, {data:text});
        let len = this.returns.length;
        let ret:{[r:string]:any[]} = {};
        for (let i=0; i<len; i++) {
            let retSchema = this.returns[i];
            ret[retSchema.name] = result[i];
        }
        return ret;
    }
}
