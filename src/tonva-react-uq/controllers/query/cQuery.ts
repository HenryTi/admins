import { StatelessComponent } from "react";
import { CEntity, EntityUI } from "../CVEntity";
import { Query } from "../../entities";
import { VQueryMain } from "./vQueryMain";
import { VQuerySelect } from "./vQuerySelect";

export interface QueryUI extends EntityUI {
    CQuery?: typeof CQuery;
    CQuerySelect?: typeof CQuerySelect;
    main?: typeof VQueryMain;
    row?: StatelessComponent;
    queryRow?: StatelessComponent;
    selectRow?: StatelessComponent;
}

export abstract class CQueryBase extends CEntity<Query, QueryUI> {
}

export class CQuery extends CQueryBase {
    protected async internalStart() {
        await this.openVPage(this.VQueryMain);
    }

    protected get VQueryMain():typeof VQueryMain {return this.ui && this.ui.main || VQueryMain}
}

export class CQuerySelect extends CQueryBase {
    protected async internalStart(param?:any) {
        await this.openVPage(this.VQuerySelect, param);
    }

    protected get VQuerySelect():typeof VQuerySelect {return VQuerySelect}
}
