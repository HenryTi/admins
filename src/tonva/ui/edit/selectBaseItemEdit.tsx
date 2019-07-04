import { UiSelectBase } from '../schema';
import { ItemEdit } from './itemEdit';

export abstract class SelectItemBaseEdit extends ItemEdit {
    protected uiItem: UiSelectBase;
}
