import { Widget } from './widget';
import { UiSelectBase } from '../../schema';

export abstract class SelectBaseWidget extends Widget {
    protected ui: UiSelectBase;
}
