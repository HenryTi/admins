var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Page } from 'tonva-tools';
import { VSheetView } from './vSheetView';
export class VArchived extends VSheetView {
    constructor() {
        //protected controller: CSheet;
        //brief: any;
        super(...arguments);
        this.view = () => {
            let { brief } = this.sheetData;
            return React.createElement(Page, { header: this.label + ':' + '-' + brief.no },
                React.createElement(this.sheetView, null));
        };
    }
    open(sheetData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sheetData = sheetData;
            /*
            let {brief, data, flows} = await this.controller.getArchived(inBrief.id);
            this.brief = brief;
            this.data = data;
            this.flows = flows;
            */
            this.vForm = this.createForm(undefined, this.sheetData.data);
            this.openPage(this.view);
        });
    }
}
//# sourceMappingURL=vArchived.js.map