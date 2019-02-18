var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { SearchBox, List } from 'tonva-react-form';
import { Page } from 'tonva-tools';
import { jsonStringify } from '../../tools';
import { VEntity } from '../CVEntity';
import { RowContent } from '../form/viewModel';
export class VTuidMainListBase extends VEntity {
    constructor() {
        super(...arguments);
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller.searchMain(key);
            //await this.PageItems.first(key);
        });
        this.renderRow = (item, index) => React.createElement(this.rowContent, Object.assign({}, item));
        this.clickRow = (item) => {
            this.callOnSelected(item);
        };
        this.rowKey = (item) => {
            let { id } = item;
            return id;
        };
        this.view = observer(() => {
            let header = React.createElement(SearchBox, { className: "mx-1 w-100", initKey: '', onSearch: this.onSearch, placeholder: '搜索' + this.label });
            let { owner } = this.entity;
            let ownerTop;
            if (owner !== undefined) {
                let ownerObj = owner.valueFromId(this.ownerId);
                ownerTop = React.createElement("div", null,
                    "owner: ",
                    jsonStringify(ownerObj));
            }
            return React.createElement(Page, { header: header },
                ownerTop,
                React.createElement(List, { items: this.controller.PageItems.items, item: { render: this.renderRow, onClick: this.clickRow, key: this.rowKey }, before: '搜索' + this.label + '资料' }));
        });
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.rowContent = this.ui.rowContent || RowContent;
            if (this.entity.owner !== undefined)
                this.ownerId = Number(param);
            // 初始查询, key是空的
            //await this.onSearch('');
            yield this.controller.searchMain('');
            this.openPage(this.view);
        });
    }
    callOnSelected(item) {
        if (this.onSelected === undefined) {
            alert('onSelect is undefined');
            return;
        }
        this.onSelected(item);
    }
}
export class VTuidMainList extends VTuidMainListBase {
    onSelected(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.controller.isFrom === false)
                this.event('edit', item.id);
            else
                this.event('info', item.id);
        });
    }
}
export class VTuidDivListBase extends VEntity {
    constructor() {
        super(...arguments);
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller.searchMain(key);
            //await this.PageItems.first(key);
        });
        this.renderRow = (item, index) => {
            return React.createElement("div", { className: "px-3 py-2" }, jsonStringify(item));
        };
        this.clickRow = (item) => {
            this.callOnSelected(item);
        };
        this.view = observer(() => {
            let header = React.createElement(SearchBox, { className: "mx-1 w-100", initKey: '', onSearch: this.onSearch, placeholder: '搜索' + this.label });
            let { owner } = this.entity;
            let ownerTop;
            if (owner !== undefined) {
                let ownerObj = owner.valueFromId(this.ownerId);
                ownerTop = React.createElement("div", null,
                    "owner: ",
                    jsonStringify(ownerObj));
            }
            return React.createElement(Page, { header: header },
                ownerTop,
                React.createElement(List, { items: this.controller.PageItems.items, item: { render: this.renderRow, onClick: this.clickRow }, before: '搜索' + this.label + '资料' }));
        });
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            //this.PageItems = new TuidPageItems(this.entity);
            if (this.entity.owner !== undefined)
                this.ownerId = Number(param);
            // 初始查询, key是空的
            //await this.onSearch('');
            yield this.controller.searchMain('');
            this.openPage(this.view);
        });
    }
    callOnSelected(item) {
        if (this.onSelected === undefined) {
            alert('onSelect is undefined');
            return;
        }
        this.onSelected(item);
    }
}
export class VTuidDivList extends VTuidDivListBase {
    onSelected(item) {
        return __awaiter(this, void 0, void 0, function* () {
            this.event('edit', item.id);
        });
    }
}
//# sourceMappingURL=vTuidList.js.map