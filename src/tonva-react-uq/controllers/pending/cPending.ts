import { CEntity, EntityUI } from "../CVEntity";
import { Pending } from "../../entities";
import { VPendingMain } from "./vPendingMain";

export interface PendingUI extends EntityUI {
    CPending?: typeof CPending;
    main: typeof VPendingMain,
}

export class CPending extends CEntity<Pending, PendingUI> {
    protected async internalStart() {
        await this.openVPage(this.VPendingMain);
    }

    protected get VPendingMain():typeof VPendingMain {return VPendingMain}
}
