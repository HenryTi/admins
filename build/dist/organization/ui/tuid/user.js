var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CTuidSelect, QueryPagedItems } from "tonva-react-usql";
class CUserSelect extends CTuidSelect {
    buildPagedItems() {
        let query = this.cUsq.cFromName('query', 'SearchUser');
        return new QueryPagedItems(query.entity);
    }
    idFromItem(item) { return item.id; }
    searchMain(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pagedItems === undefined) {
                this.pagedItems = this.buildPagedItems();
            }
            if (key !== undefined)
                yield this.pagedItems.first({ key: key });
        });
    }
}
const ui = {
    CTuidSelect: CUserSelect,
};
export default ui;
//# sourceMappingURL=user.js.map