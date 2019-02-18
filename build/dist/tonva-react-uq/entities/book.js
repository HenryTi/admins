import { Query } from './query';
export class Book extends Query {
    constructor() {
        super(...arguments);
        this.queryApiName = 'book';
    }
    get typeName() { return 'book'; }
}
//# sourceMappingURL=book.js.map