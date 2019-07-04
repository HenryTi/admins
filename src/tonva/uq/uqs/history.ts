import {Query} from './query';

export class History extends Query {
    get typeName(): string { return 'history';}
    protected queryApiName = 'history';
}
