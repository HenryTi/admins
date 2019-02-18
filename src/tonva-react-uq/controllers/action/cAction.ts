import { CEntity, EntityUI } from "../CVEntity";
import { Action } from "../../entities";
import { VActionMain } from "./vActionMain";

export interface ActionUI extends EntityUI {
    CAction?: typeof CAction;
    //main: typeof VActionMain,
}

export class CAction extends CEntity<Action, ActionUI> {
    protected async internalStart() {
        await this.openVPage(this.VActionMain);
    }

    protected get VActionMain():typeof VActionMain {return VActionMain}

    async submit(values:any) {
        return this.entity.submit(values);
    }
}
