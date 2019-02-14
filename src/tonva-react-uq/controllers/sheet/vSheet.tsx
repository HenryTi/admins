import { Sheet } from "../../entities";
import { SheetUI, CSheet } from "./cSheet";
import { VEntity } from "../CVEntity";

export abstract class VSheet extends VEntity<Sheet, SheetUI, CSheet> {
}
