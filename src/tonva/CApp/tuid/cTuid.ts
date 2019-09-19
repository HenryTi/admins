import _ from 'lodash';
import { CEntity, EntityUI } from '../CVEntity';
import { Tuid } from '../../uq';
import { VTuidMain } from './vTuidMain';
import { VTuidEdit } from './vTuidEdit';
import { VTuidSelect } from './vTuidSelect';
import { CUq } from '../cUq/cUq';
//import { CLink } from '../link';
import { VTuidInfo } from './vTuidInfo';
import { TuidPageItems } from './pageItems';
import { VTuidList } from './vTuidList';
import { PageItems } from '../../tool';
//import { Controller } from 'ui';

export interface TuidUI extends EntityUI {
    CTuidMain?: typeof CTuidMain;
    CTuidEdit?: typeof CTuidEdit;
    CTuidList?: typeof CTuidList;

    CTuidSelect?: typeof CTuidSelect;
    CTuidInfo?: typeof CTuidInfo;
    content?: React.StatelessComponent<any>;
    rowContent?: React.StatelessComponent<any>;
    divs?: {
        [div:string]: {
            CTuidSelect?: typeof CTuidSelect;
            content?: React.StatelessComponent<any>;
            rowContent?: React.StatelessComponent<any>;
        }
    }
}

export abstract class CTuid<T extends Tuid> extends CEntity<T, TuidUI> {
    PageItems:PageItems<any>;

    protected buildPageItems():PageItems<any> {
        return new TuidPageItems(this.entity);
    }

    async searchMain(key:string) {
        if (this.PageItems === undefined) {
            this.PageItems = this.buildPageItems();
        }
        if (key !== undefined) await this.PageItems.first(key);
    }

    async getDivItems(ownerId:number):Promise<any[]> {
        let ret = await this.entity.searchArr(ownerId, undefined, 0, 1000);
        return ret;
    }
}

export abstract class CTuidBase extends CTuid<Tuid> {
    /*
    constructor(cUq: CUq, entity:Tuid, ui: TuidUI, res:any) {
        super(cUq, entity, ui, res);
    }*/
    
    from():CTuidBase {
        let ret = this; // this.entity.cFrom();
        if (ret === undefined) return this;
        return ret;
    }

    cUqFrom():CUq {
        return this.cUq; // this.entity.cUqFrom();
    }
    cEditFrom(): CTuidEdit {
        let cUq = this.cUq; // this.entity.cUqFrom();
        return cUq.cTuidEditFromName(this.entity.name);
    }
    cInfoFrom(): CTuidInfo {
        let cUq = this.cUq; // this.entity.cUqFrom();
        return cUq.cTuidInfoFromName(this.entity.name);
    }
    cSelectFrom(): CTuidSelect {
        let cUq = this.cUq;// this.entity.cUqFrom();
        return cUq.cTuidSelectFromName(this.entity.name);
    }

    getLable(tuid:Tuid):string {
        if (tuid === this.entity) return this.label;
        let {name} = tuid;
        let {arrs} = this.res;
        if (arrs !== undefined) {
            let arr = arrs[name];
            if (arr !== undefined) {
                let label = arr.label;
                if (label !== undefined) return label;
            }
        }
        return name;
    }

    isImport: boolean;

    protected get VTuidMain():typeof VTuidMain {return VTuidMain}
    protected get VTuidEdit():typeof VTuidEdit {return VTuidEdit}
    protected get VTuidList():typeof VTuidList {return VTuidList}

    protected async internalStart(param?:any):Promise<void> {
        this.isImport = this.entity.isImport;
        await this.openVPage(this.VTuidMain);
    }

    protected async onEvent(type:string, value:any) {
        //let v: TypeVPage<CTuidMain>;
        switch (type) {
            default: return;
            case 'new': await this.onNew(); break;
            case 'list': await this.onList(); break;
            case 'edit': await this.onEdit(value); return;
            case 'item-changed': this.itemChanged(value); return;
            case 'info': 
                let cTuidInfo = new CTuidInfo(this.cUq, this.entity, this.ui, this.res);
                await cTuidInfo.start(value);
                return;
        }
        //await this.openVPage(v, value);
    }

    protected async edit(values:any) {
        let cTuidEdit = this.ui && this.ui.CTuidEdit;
        if (cTuidEdit === undefined) {
            await this.openVPage(this.VTuidEdit, values);
        }
        else {
            await (new cTuidEdit(this.cUq, this.entity, this.ui, this.res)).start(values);
        }
    }

    private async onNew() {
        await this.edit(undefined);
    }

    private async onList() {
        let cTuidList = this.ui && this.ui.CTuidList;
        if (cTuidList === undefined) {
            await this.openVPage(this.VTuidList, undefined);
        }
        else {
            await (new cTuidList(this.cUq, this.entity, this.ui, this.res)).start(undefined);
        }
    }

    protected async onEdit(id:number) {
        let values:any = undefined;
        if (id !== undefined) {
            values = await this.entity.load(id);
        }
        this.edit(values);
        //await this.openVPage(this.VTuidEdit, values);
    }

    private itemChanged({id, values}:{id:number, values: any}) {
        if (this.PageItems === undefined) return;
        let items = this.PageItems.items;
        let item = items.find(v => v.id === id);
        if (item !== undefined) {
            _.merge(item, values);
        }
    }
}

export class CTuidMain extends CTuidBase {
    protected async internalStart(param?:any):Promise<void> {
        this.isImport = this.entity.isImport;
        await this.openVPage(this.VTuidMain);
    }

}

export class CTuidEdit extends CTuidBase {
    protected async internalStart(id:number):Promise<void> {
        this.isImport = this.entity.isImport;
        if (typeof(id) === 'number') {
            await this.onEdit(id);
        }
        else {
            await this.edit(id);
        }
    }

    protected async edit(values:any) {
        await this.openVPage(this.VTuidEdit, values);
    }
}

export class CTuidList extends CTuidBase {
    protected async internalStart(id:number):Promise<void> {
        this.isImport = this.entity.isImport;
        await this.openVPage(this.VTuidList);
    }
}

export class CTuidDiv extends CTuid<Tuid> {
    protected async internalStart():Promise<void> {
        alert('tuid div: ??');
    }
}

export class CTuidSelect extends CTuid<Tuid> {
    protected async internalStart(param?: any):Promise<void> {
        await this.openVPage(this.VTuidSelect, param);
    }
    protected async beforeStart():Promise<boolean> {
        //if (await super.beforeStart() === false) return false;
        await this.entity.loadSchema();
        if (this.PageItems !== undefined) this.PageItems.reset();
        return true;
    }
    protected get VTuidSelect():typeof VTuidSelect {return VTuidSelect}
    idFromItem(item:any) {
        return item.id;
    }
}

export class CTuidInfo extends CTuid<Tuid> {
    protected async internalStart(id: any):Promise<void> {
        let data = await this.entity.load(id)
        await this.openVPage(this.VTuidInfo, data);
    }
    protected get VTuidInfo():typeof VTuidInfo {return VTuidInfo}
}
