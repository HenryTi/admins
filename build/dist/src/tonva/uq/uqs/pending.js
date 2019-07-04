import { Query } from './query';
export class Pending extends Query {
    constructor() {
        super(...arguments);
        this.queryApiName = 'pending';
    }
    get typeName() { return 'pending'; }
}
//# sourceMappingURL=pending.js.map