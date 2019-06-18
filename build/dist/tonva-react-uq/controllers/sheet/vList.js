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
import { List, Muted, LMR, EasyDate } from 'tonva-react-form';
import { VEntity } from '../CVEntity';
export class VSheetList extends VEntity {
    constructor() {
        super(...arguments);
        this.rowClick = (brief) => __awaiter(this, void 0, void 0, function* () {
            if (brief.processing === 1) {
                this.event('processing', brief.id);
                return;
            }
            this.event('action', brief.id);
        });
        this.onScrollBottom = () => {
            console.log('onScrollBottom');
            this.controller.pageStateItems.more();
        };
        this.rowContent = (row) => {
            let { id, no, discription, date, processing } = row;
            let left = React.createElement(React.Fragment, null,
                no,
                " \u00A0 ",
                React.createElement(Muted, null, discription),
                " ",
                processing === 1 ? '...' : '');
            let right = React.createElement(Muted, null,
                React.createElement(EasyDate, { date: date }));
            return React.createElement(LMR, { className: "px-3 py-2", left: left, right: right });
        };
        this.renderRow = (row, index) => React.createElement(this.row, Object.assign({}, row));
        this.view = () => {
            //let sheets = this.controller.stateSheets;
            let { pageStateItems } = this.controller;
            return React.createElement(Page, { header: this.label + ' - ' + this.stateLabel, onScrollBottom: this.onScrollBottom },
                React.createElement(List, { items: pageStateItems, item: { render: this.renderRow, onClick: this.rowClick } }));
        };
    }
    open(item) {
        return __awaiter(this, void 0, void 0, function* () {
            this.row = this.ui.listRow || this.rowContent;
            this.stateName = item.state;
            this.stateLabel = this.controller.getStateLabel(this.stateName);
            //await this.controller.getStateSheets(this.stateName, 0, 10);
            yield this.controller.pageStateItems.first(this.stateName);
            this.openPage(this.view);
        });
    }
}
//# sourceMappingURL=vList.js.map