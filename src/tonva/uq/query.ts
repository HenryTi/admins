//import _ from 'lodash';
import {observable, IObservableArray} from 'mobx';
import { PageItems } from '../tool';
import {Field, ArrFields} from './uqMan';
import {Entity} from './entity';
import { QueryQueryCaller, QueryPageCaller } from './caller';

export type QueryPageApi = (name:string, pageStart:any, pageSize:number, params:any) => Promise<string>;

export class QueryPager<T extends any> extends PageItems<T> {
    private query: Query;
    constructor(query: Query, pageSize?: number, firstSize?: number) {
        super();
        this.query = query;
        if (pageSize !== undefined) this.pageSize = pageSize;
        if (firstSize !== undefined) this.firstSize = firstSize;
    }

    protected async onLoad() {
        let {schema} = this.query;
        if (schema === undefined) await this.query.loadSchema();
    }

    protected async load(param:any, pageStart:any, pageSize:number):Promise<T[]> {
        if (pageStart === undefined) pageStart = 0;
        let ret = await this.query.page(param, pageStart, pageSize);
        return ret;
    }
    protected setPageStart(item:T) {
        let {schema} = this.query;
        if (schema === undefined) return;
        let $page = (schema.returns as any[]).find(v => v.name === '$page');
        if ($page === undefined) return;
        let {order} = $page;
        if (order === undefined) return;
        let {field, type, asc} = order;
        let start:any;
        if (item !== undefined) start = item[field];
        if (asc === false) {
            this.appendPosition = 'head';
            switch (type) {
                default:
                case 'tinyint':
                case 'smallint':
                case 'int':
                case 'bigint':
                case 'dec': start = 999999999999; break;
                case 'date':
                case 'datetime': start = undefined; break;          // 会自动使用现在
                case 'char': start = ''; break;
            }
        }
        else {
            this.appendPosition = 'tail';
            switch (type) {
                default:
                case 'tinyint':
                case 'smallint':
                case 'int':
                case 'bigint':
                case 'dec': start = 0; break;
                case 'date':
                case 'datetime': start = '1970-1-1'; break;
                case 'char': start = ''; break;
            }
        }
        this.pageStart = start;
    }
}

export class Query extends Entity {
    get typeName(): string { return 'query';}
    private pageStart: any;
    private pageSize:number;
    private params:any;
    private more: boolean;
    private startField: Field;
    @observable list:IObservableArray; // = observable.array([], {deep: false});
    returns: ArrFields[];
    isPaged: boolean;

    setSchema(schema:any) {
        super.setSchema(schema);
        let {returns} = schema;
        //this.returns = returns;
        this.isPaged = returns && (returns as any[]).find(v => v.name === '$page') !== undefined;
    }

    resetPage(size:number, params:any) {
        this.pageStart = undefined;
        this.pageSize = size;
        this.params = params;
        this.more = false;
        this.list = undefined;
    }
    get hasMore() {return this.more;}
    async loadPage():Promise<void> {
        if (this.pageSize === undefined) {
            throw new Error('call resetPage(size:number, params:any) first');
        }
        let pageStart:any;
        if (this.pageStart !== undefined) {
            switch (this.startField.type) {
                default: pageStart = this.pageStart; break;
                case 'date':
                case 'time':
                case 'datetime': pageStart = (this.pageStart as Date).getTime(); break;
            }
        }
        let page = await this.page(this.params, pageStart, this.pageSize+1);
        /*
        await this.loadSchema();
        let res = await this.tvApi.page(this.name, pageStart, this.pageSize+1, this.params);
        let data = await this.unpackReturns(res);
        let page = data['$page'] as any[];
        */
        this.list = observable.array([], {deep: false});
        if (page !== undefined) {
            if (page.length > this.pageSize) {
                this.more = true;
                page.pop();
                let ret = this.returns.find(r => r.name === '$page');
                this.startField = ret.fields[0];
                this.pageStart = page[page.length-1][this.startField.name];
            }
            else {
                this.more = false;
            }
            this.list.push(...page);
        }
        //this.loaded = true;
    }

    protected pageCaller(params: any): QueryPageCaller {
        return new QueryPageCaller(this, params);
    }

    async page(params:any, pageStart:any, pageSize:number):Promise<any[]> {
        /*
        await this.loadSchema();
        let res = await this.uqApi.page(this.name, pageStart, pageSize+1, this.buildParams(params));
        */
        let p = {pageStart:pageStart, pageSize:pageSize+1, params:params};
        let res = await this.pageCaller(p).request();
        //let data = this.unpackReturns(res);
        //return data.$page;// as any[];
        return res;
    }
    protected queryCaller(params: any): QueryQueryCaller {
        return new QueryQueryCaller(this, params);
    }
    async query(params:any):Promise<any> {
        /*
        await this.loadSchema();
        let res = await this.uqApi.query(this.name, this.buildParams(params));
        */
        let res = await this.queryCaller(params).request();
        //let data = this.unpackReturns(res);
        //return data;
        return res;
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
