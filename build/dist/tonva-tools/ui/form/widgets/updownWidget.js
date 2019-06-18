import { NumberWidget } from './numberWidget';
export class UpdownWidget extends NumberWidget {
    constructor() {
        super(...arguments);
        this.inputType = 'number';
    }
    isValidKey(key) {
        return key === 46 || key === 8 || key === 37 || key === 39
            || key >= 48 && key <= 57
            || key >= 96 && key <= 105
            || key === 109 || key === 189;
    }
    internalOnKeyDown(evt) {
        let key = evt.keyCode;
        event.returnValue = this.isValidKey(key);
    }
}
//# sourceMappingURL=updownWidget.js.map