import {Query} from './query';
import { QueryQueryCaller } from './caller';

export class Book extends Query {
    get typeName(): string { return 'book';}
    protected queryApiName = 'book';

    protected queryCaller(params: any): QueryQueryCaller {
        return new BookQueryCaller(this, params);
    }
}

export class BookQueryCaller extends QueryQueryCaller {
    //protected get entity(): Query {return this._entity as Query};
    get path():string {return `book/${this.entity.name}`;}
    /*
    xresult(res:any) {
        let data = this.entity.unpackReturns(res);
        return data;
    }
    buildParams() {return this.entity.buildParams(this.params);}
    */
}
