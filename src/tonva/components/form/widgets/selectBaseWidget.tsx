import { Widget } from './widget';
import { UiSelectBase } from '../../schema';

export abstract class SelectBaseWidget extends Widget {
    protected get ui(): UiSelectBase {return this._ui as UiSelectBase};
}
