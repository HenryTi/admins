var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VPage, Page, PageItems } from "tonva-tools";
import { SearchBox, List } from 'tonva-react-form';
import { centerApi } from 'tonva-react-uq';
export class VSearchUser extends VPage {
    constructor() {
        super(...arguments);
        this.pageUsers = new PageUsers();
        this.onUserClick = (item) => {
            this.closePage();
            this.returnCall(item);
        };
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
            yield this.pageUsers.first({ key: key, unit: this.unit, role: undefined });
        });
        this.renderSelectUser = (item, index) => {
            return React.createElement("div", { className: "px-3 py-2" }, JSON.stringify(item));
        };
    }
    open(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.unit = unit;
            let search = React.createElement(SearchBox, { className: "w-100", onSearch: this.onSearch, placeholder: "\u9009\u62E9\u7528\u6237" });
            this.openPageElement(React.createElement(Page, { header: search },
                React.createElement(List, { before: "\u641C\u7D22\u7528\u6237\u540D", items: this.pageUsers, item: { render: this.renderSelectUser, onClick: this.onUserClick } })));
        });
    }
}
class PageUsers extends PageItems {
    load(param, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let { unit, role, key } = param;
            let ret = yield centerApi.get('unit/members', { key: key, unit: unit, role: role, pageStart: pageStart, pageSize: pageSize });
            return ret;
        });
    }
    setPageStart(item) {
        if (item === undefined)
            this.pageStart = 0;
        else
            this.pageStart = item.id;
    }
}
//# sourceMappingURL=vSearchUser.js.map