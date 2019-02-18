var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { Page } from 'tonva-tools';
import { VSheetView } from './vSheetView';
export class VSheetProcessing extends VSheetView {
    constructor() {
        super(...arguments);
        this.page = () => {
            let { brief } = this.sheetData;
            let { state, no } = brief;
            let stateLabel = this.controller.getStateLabel(state);
            return React.createElement(Page, { header: this.label + ':' + stateLabel + '-' + no },
                React.createElement("div", { className: "mb-2" },
                    React.createElement("div", { className: "d-flex px-3 py-2 border-bottom bg-light" }, "\u6B63\u5728\u5904\u7406\u4E2D..."),
                    React.createElement(this.sheetView, null)));
        };
    }
    open(sheetData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sheetData = sheetData;
            //let {brief, data, flows} = await this.controller.getSheetData(sheetId);
            //this.brief = brief;
            //this.flows = flows;
            //this.data = data;
            //this.state = this.brief.state;
            this.vForm = this.createForm(undefined, sheetData.data);
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=vSheetProcessing.js.map