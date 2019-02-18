import { CEntity, EntityUI } from "../CVEntity";
import { History } from "../../entities";
import { VHistoryMain } from "./vHistoryMain";

export interface HistoryUI extends EntityUI {
    CHistory?: typeof CHistory;
    main: typeof VHistoryMain,
}

export class CHistory extends CEntity<History, HistoryUI> {
    protected async internalStart() {
        await this.openVPage(this.VHistoryMain);
    }

    protected get VHistoryMain():typeof VHistoryMain {return VHistoryMain}
}
