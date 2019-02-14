import {Query} from './query';

export class Pending extends Query {
    get typeName(): string { return 'pending';}
    protected queryApiName = 'pending';
}
