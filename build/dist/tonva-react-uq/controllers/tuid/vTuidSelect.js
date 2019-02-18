var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Page } from 'tonva-tools';
import { VEntity } from '../CVEntity';
import { SearchBox, List } from 'tonva-react-form';
import React from 'react';
import { RowContent } from '../form/viewModel';
import { observer } from 'mobx-react';
export class VTuidSelect extends VEntity {
    constructor() {
        super(...arguments);
        this.mainView = observer(() => {
            let header = React.createElement(SearchBox, { className: "mx-1 w-100", initKey: '', onSearch: this.onSearchMain, placeholder: '搜索' + this.label });
            return React.createElement(Page, { header: header, back: "close" },
                React.createElement(List, { items: this.controller.PageItems.items, item: { render: this.renderMainRow, onClick: this.clickMainRow }, before: '搜索' + this.label + '资料' }));
        });
        this.onSearchMain = (key) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller.searchMain(key);
            //await this.PageItems.first(key);
        });
        this.renderMainRow = (item, index) => React.createElement(this.mainRowContent, Object.assign({}, item));
        this.clickMainRow = (item) => __awaiter(this, void 0, void 0, function* () {
            this.ceasePage();
            if (this.controller.entity.owner === undefined) {
                this.returnCall(item);
                return;
            }
            yield this.showDiv(this.entity.getIdFromObj(item));
        });
        this.divView = (param) => {
            return React.createElement(Page, { header: "\u9009\u62E9Div" },
                React.createElement(List, { items: param.items, item: { render: this.renderDivRow, onClick: this.clickDivRow } }));
        };
        this.renderDivRow = (item, index) => React.createElement(this.divRowContent, Object.assign({}, item));
        this.clickDivRow = (item) => {
            this.ceasePage();
            this.returnCall(item);
        };
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            if (param === undefined)
                yield this.showMain(param);
            else
                yield this.showDiv(param);
        });
    }
    showMain(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.mainRowContent = this.ui.rowContent || RowContent;
            yield this.controller.searchMain(param);
            this.openPage(this.mainView);
        });
    }
    showDiv(ownerValue) {
        return __awaiter(this, void 0, void 0, function* () {
            let { divs } = this.ui;
            if (divs !== undefined) {
                this.divRowContent = divs[this.entity.name].rowContent;
            }
            if (this.divRowContent === undefined) {
                this.divRowContent = RowContent;
            }
            let divItems = yield this.controller.getDivItems(ownerValue);
            this.openPage(this.divView, { items: divItems });
        });
    }
}
//# sourceMappingURL=vTuidSelect.js.map