var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { SearchBox, List } from 'tonva-react-form';
import { Page, PageItems } from 'tonva-tools';
import { VEntity } from '../CVEntity';
import { DefaultRow } from './defaultRow';
export class VQuerySelect extends VEntity {
    constructor() {
        super(...arguments);
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
            yield this.PageItems.first(key);
        });
        this.renderRow = (item, index) => React.createElement(this.row, Object.assign({}, item));
        this.clickRow = (item) => {
            this.callOnSelected(item);
        };
        this.view = () => {
            let header = React.createElement(SearchBox, { className: "mx-1 w-100", initKey: '', onSearch: this.onSearch, placeholder: '搜索' + this.label });
            return React.createElement(Page, { header: header },
                React.createElement(List, { items: this.PageItems.items, item: { render: this.renderRow, onClick: this.clickRow }, before: '搜索' + this.label + '资料' }));
        };
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let { row, selectRow } = this.ui;
            this.row = selectRow || row || DefaultRow;
            //this.entity = this.controller.entity;
            this.PageItems = new QueryPageItems(this.entity);
            yield this.onSearch(param);
            this.openPage(this.view);
        });
    }
    callOnSelected(item) {
        this.closePage();
        this.returnCall(item);
    }
}
export class QueryPageItems extends PageItems {
    constructor(query) {
        super();
        this.query = query;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query.loadSchema();
            let ret;
            if (this.query.isPaged === true)
                ret = yield this.query.page(this.param, this.pageStart, this.pageSize);
            else {
                let data = yield this.query.query(this.param);
                //let data = await this.query.unpackReturns(res);
                ret = data[this.query.returns[0].name];
            }
            return ret;
        });
    }
    setPageStart(item) {
        if (item === undefined)
            this.pageStart = 0;
    }
}
//# sourceMappingURL=vQuerySelect.js.map