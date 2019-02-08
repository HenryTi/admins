import * as React from 'react';
import { TuidUI, CTuidSelect, CQuery, QueryPageItems } from "tonva-react-uq";
import { PageItems } from "tonva-tools";

class CUserSelect extends CTuidSelect {
    protected buildPageItems():PageItems<any> {
        let query:CQuery = this.cUq.cFromName('query', 'SearchUser') as CQuery;
        return new QueryPageItems(query.entity);
    }
    idFromItem(item:any) {return item.id;}

    async searchMain(key:string) {
        if (this.PageItems === undefined) {
            this.PageItems = this.buildPageItems();
        }
        if (key !== undefined) await this.PageItems.first({key: key});
    }
}

const ui:TuidUI = {
    CTuidSelect: CUserSelect,
    content: (item:any) => {return <>{item.name}</>},
}

export default ui;
