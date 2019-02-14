import { PageItems } from 'tonva-tools';
import { Tuid } from "../../entities";

export class TuidPageItems<T> extends PageItems<T> {
    private tuid: Tuid;
    constructor(tuid: Tuid) {
        super(true);
        this.tuid = tuid;
    }
    protected async load(param:any, pageStart:any, pageSize:number):Promise<any[]> {
        let ret = await this.tuid.search(param, pageStart, pageSize);
        return ret;
    }
    protected setPageStart(item:any) {
        this.pageStart = item === undefined? 0 : item.id;
    }
}
