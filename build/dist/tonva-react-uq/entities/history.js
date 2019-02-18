import { Query } from './query';
export class History extends Query {
    constructor() {
        super(...arguments);
        this.queryApiName = 'history';
    }
    get typeName() { return 'history'; }
}
//# sourceMappingURL=history.js.map