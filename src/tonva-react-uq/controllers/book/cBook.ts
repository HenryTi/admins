import { CEntity, EntityUI } from "../CVEntity";
import { Book } from "../../entities";
import { VBookMain } from "./vBookMain";

export interface BookUI extends EntityUI {
    CBook?: typeof CBook;
    main: typeof VBookMain,
}

export class CBook extends CEntity<Book, BookUI> {
    protected async internalStart() {
        await this.openVPage(this.VBookMain);
    }

    protected get VBookMain():typeof VBookMain {return VBookMain}
}
