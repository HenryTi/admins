import { Entity } from './entity';
import { Action } from './action';
import { Query } from './query';
import { Field } from './entities';

interface MapActions {
    add: Action;
    del: Action;
}
interface MapQueries {
    all: Query;
    page: Query;
    query: Query;
}

export class Map extends Entity {
    get typeName(): string { return 'map';}
    keys: Field[];
    actions: MapActions = {} as any;
    queries: MapQueries = {} as any;
    schemaFrom: {owner:string; uq:string};

    setSchema(schema:any) {
        super.setSchema(schema);
        this.schemaFrom = this.schema.from;
        let {actions, queries, keys} = schema;
        this.entities.buildFieldTuid(this.keys = keys);
        //let t = this.schemaStringify();
        for (let i in actions) {
            let schema = actions[i];
            let {name} = schema;
            let action = this.entities.newAction(name, undefined);
            action.setSchema(schema);
            this.actions[i] = action;
        }
        for (let i in queries) {
            let schema = queries[i];
            let {name} = schema;
            let query = this.entities.newQuery(name, undefined);
            query.setSchema(schema);
            this.queries[i] = query;
        }
    }

    async add(param:any) {
        await this.loadSchema();
        return await this.actions.add.submit(param);
    }

    async del(param:any) {
        await this.loadSchema();
        return await this.actions.del.submit(param);
    }

    async all() {
        await this.loadSchema();
        return await this.queries.all.query({});
    }

    async page(param:any, pageStart:any, pageSize: number) {
        await this.loadSchema();
        return await this.queries.page.page(param, pageStart, pageSize);
    }

    async query(param:any) {
        await this.loadSchema();
        return await this.queries.query.query(param);
    }
    async table(params:any): Promise<any[]> {
        let ret = await this.query(params);
        for (let i in ret) {
            return ret[i];
        }
    }
    async obj(params:any):Promise<any> {
        let ret = await this.table(params);
        if (ret.length > 0) return ret[0];
    }
    async scalar(params:any):Promise<any> {
        let ret = await this.obj(params);
        for (let i in ret) return ret[i];
    }
}
