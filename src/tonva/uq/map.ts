import { Entity } from './entity';
import { Action, ActionSubmitCaller } from './action';
import { Query } from './query';
import { Field } from './uqMan';
import { EntityCaller, QueryPageCaller, QueryQueryCaller } from './caller';

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
        this.uq.buildFieldTuid(this.keys = keys);
        //let t = this.schemaStringify();
        for (let i in actions) {
            let actionSchema = actions[i];
            let {name} = actionSchema;
            let action = this.uq.newAction(name, undefined);
            action.setSchema(actionSchema);
            action.buildFieldsTuid();
            (this.actions as any)[i] = action;
        }
        for (let i in queries) {
            let querySchema = queries[i];
            let {name} = querySchema;
            let query = this.uq.newQuery(name, undefined);
            query.setSchema(querySchema);
            query.buildFieldsTuid();
            (this.queries as any)[i] = query;
        }
    }

    async add(param:any) {
        /*
        await this.loadSchema();
        return await this.actions.add.submit(param);
        */
        let ret = await new AddCaller(this, param).request();
        return ret;
    }

    async del(param:any) {
        /*
        await this.loadSchema();
        return await this.actions.del.submit(param);
        */
        let ret = await new DelCaller(this, param).request();
        return ret;
    }

    async all() {
        /*
        await this.loadSchema();
        return await this.queries.all.query({});
        */
        let ret = await new AllCaller(this, undefined).request();
        return ret;
    }

    async page(param:any, pageStart:any, pageSize: number) {
        /*
        await this.loadSchema();
        return await this.queries.page.page(param, pageStart, pageSize);
        */
        let ret = await new PageCaller(this, {pageStart:pageStart, pageSize:pageSize, param:param}).request();
        return ret;
    }

    async query(param:any) {
        /*
        await this.loadSchema();
        return await this.queries.query.query(param);
        */
       let qc = new QueryCaller(this, param);
       let ret = await qc.request();
       return ret;
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

abstract class MapCaller extends EntityCaller<any> {
    protected get entity(): Map {return this._entity as Map;}
    get path():string {return undefined;}

    protected abstract getCaller(param: any):EntityCaller<any>;

    protected async innerCall(): Promise<any> {
        let caller = this.getCaller(this.params);
        let res = await this.entity.uqApi.xcall(caller);
        let ret = caller.xresult(res.res);
        return {res: ret};
    }

    buildParams() {
        let p = super.buildParams();
        return p;
    }
}

class AddCaller extends MapCaller {
    protected getCaller(param:any):EntityCaller<any> {
        return new MapAddCaller(this.entity, this.entity.actions.add, param);
    }
}

class DelCaller extends MapCaller {
    protected getCaller(param:any):EntityCaller<any> {
        return new MapDelCaller(this.entity, this.entity.actions.add, param);
    }
}

class AllCaller extends MapCaller {
    protected getCaller(param:any):EntityCaller<any> {
        return new MapAllCaller(this.entity, this.entity.queries.all, param);
    }
}

class PageCaller extends MapCaller {
    protected getCaller(param:any):EntityCaller<any> {
        return new MapPageCaller(this.entity, this.entity.queries.page, param);
    }
}

class QueryCaller extends MapCaller {
    protected getCaller(param:any):EntityCaller<any> {
        return new MapQueryCaller(this.entity, this.entity.queries.query, param);
    }
}

class MapAddCaller extends ActionSubmitCaller {
    private map: Map;
    constructor(map:Map, action:Action, params:any) {
        super(action, params);
        this.map = map;
    }

    get path():string {return `map/${this.map.name}/add`}
    get headers(): {[header:string]: string} {return undefined;}
    /*
        let {ver, uq} = this.map;
        let {uqVersion} = uq;
        return {
            uq: `${uqVersion}`,
            en: `${ver}`,
        }
    }*/
}

class MapDelCaller extends ActionSubmitCaller {
    private map: Map;
    constructor(map:Map, action:Action, params:any) {
        super(action, params);
        this.map = map;
    }

    get path():string {return `map/${this.map.name}/del`}
    get headers(): {[header:string]: string} {return undefined}
    /*
        let {ver, uq} = this.map;
        let {uqVersion} = uq;
        return {
            uq: `${uqVersion}`,
            en: `${ver}`,
        }
    }*/
}

class MapAllCaller extends QueryPageCaller {
    private map: Map;
    constructor(map:Map, query:Query, params:any) {
        super(query, params);
        this.map = map;
    }

    get path():string {return `map/${this.map.name}/all`}
    get headers(): {[header:string]: string} {return undefined}
    /*
        let {ver, uq} = this.map;
        let {uqVersion} = uq;
        return {
            uq: `${uqVersion}`,
            en: `${ver}`,
        }
    }*/
}


class MapPageCaller extends QueryPageCaller {
    private map: Map;
    constructor(map:Map, query:Query, params:any) {
        super(query, params);
        this.map = map;
    }

    get path():string {return `map/${this.map.name}/page`}
    get headers(): {[header:string]: string} {return undefined}
    /*
        let {ver, uq} = this.map;
        let {uqVersion} = uq;
        return {
            uq: `${uqVersion}`,
            en: `${ver}`,
        }
    }*/
}

class MapQueryCaller extends QueryQueryCaller {
    private map: Map;
    constructor(map:Map, query:Query, params:any) {
        super(query, params);
        this.map = map;
    }

    get path():string {return `map/${this.map.name}/query`}
    get headers(): {[header:string]: string} {return undefined}
    /*
        let {ver, uq} = this.map;
        let {uqVersion} = uq;
        return {
            uq: `${uqVersion}`,
            en: `${ver}`,
        }
    }*/
}