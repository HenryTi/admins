var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, Page } from 'tonva-tools';
import { SearchBox, List } from 'tonva-react-form';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
let IdPickPage = class IdPickPage extends React.Component {
    constructor() {
        super(...arguments);
        this.itemClick = (item) => {
            let { resolve, idFromItem } = this.props;
            resolve(idFromItem(item));
            nav.pop();
            return;
        };
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () {
            let { candidateItems, params } = this.props;
            if (typeof candidateItems === 'function') {
                let ret = yield candidateItems(params, key);
                this.items = ret;
            }
            return;
        });
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            let { candidateItems, params } = this.props;
            this.items = Array.isArray(candidateItems) ?
                candidateItems
                : yield candidateItems(params, '');
        });
    }
    render() {
        let { caption, row, searchPlaceHolder } = this.props;
        return React.createElement(Page, { header: caption, back: "close" },
            React.createElement("div", { className: "container" },
                React.createElement(SearchBox, { className: "my-2", onSearch: this.onSearch, placeholder: searchPlaceHolder, maxLength: 100 })),
            React.createElement(List, { items: this.items, item: { onClick: this.itemClick, render: row } }));
    }
};
__decorate([
    observable
], IdPickPage.prototype, "items", void 0);
IdPickPage = __decorate([
    observer
], IdPickPage);
export { IdPickPage };
//# sourceMappingURL=idPickPage.js.map