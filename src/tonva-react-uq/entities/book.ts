import {Query} from './query';

export class Book extends Query {
    get typeName(): string { return 'book';}
    protected queryApiName = 'book';
}
