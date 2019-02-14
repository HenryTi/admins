import * as React from 'react';
import { NumberWidget } from './numberWidget';

export class UpdownWidget extends NumberWidget {
    protected inputType = 'number';

    protected isValidKey(key:number):boolean {
        return key===46 || key===8 || key===37 || key===39
            || key>=48 && key<=57
            || key>=96 && key<=105
            || key===109 || key===189;
    }
    
    protected onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
        let key = evt.keyCode;
        event.returnValue = this.isValidKey(key);
    }
}
