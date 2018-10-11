import { TuidUI, CTuidSelect, CQuery, QueryPagedItems } from "tonva-react-usql";
import { PagedItems } from "tonva-tools";

class CUserSelect extends CTuidSelect {
    protected buildPagedItems():PagedItems<any> {
        let query:CQuery = this.cUsq.cFromName('query', 'SearchUser') as CQuery;
        return new QueryPagedItems(query.entity);
    }
    idFromItem(item:any) {return item.id;}

    async searchMain(key:string) {
        if (this.pagedItems === undefined) {
            this.pagedItems = this.buildPagedItems();
        }
        if (key !== undefined) await this.pagedItems.first({key: key});
    }
}

const ui:TuidUI = {
    CTuidSelect: CUserSelect,
}

export default ui;
