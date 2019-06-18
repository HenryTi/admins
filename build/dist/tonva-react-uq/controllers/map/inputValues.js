var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VEntity } from "../CVEntity";
import { Page } from "tonva-tools";
export class VInputValues extends VEntity {
    constructor() {
        super(...arguments);
        this.onValuesSubmit = () => __awaiter(this, void 0, void 0, function* () {
            this.ceasePage();
            let values = this.vForm.getValues();
            this.returnCall(values);
        });
        this.view = () => {
            return React.createElement(Page, null, this.vForm.render());
        };
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.vForm = this.createForm(this.onValuesSubmit);
            this.openPageElement(React.createElement(this.view, null));
        });
    }
}
//# sourceMappingURL=inputValues.js.map