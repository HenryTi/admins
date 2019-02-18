var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { SearchBox, List, Muted } from 'tonva-react-form';
import { Page } from 'tonva-tools';
import { VEntity } from '../CVEntity';
export class VTuidMain extends VEntity {
    constructor() {
        super(...arguments);
        this.onNew = () => this.event('new');
        this.onList = () => this.event('list');
        this.onSearch = (key) => __awaiter(this, void 0, void 0, function* () { return this.event('list', key); });
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.view);
        });
    }
    entityRender(link, index) {
        return link.render();
    }
    entityClick(link) {
        return __awaiter(this, void 0, void 0, function* () {
            yield link.onClick();
        });
    }
    get view() {
        let { label, proxyLinks, isFrom } = this.controller;
        let newButton;
        if (isFrom === false)
            newButton = React.createElement("button", { className: "btn btn-primary ml-3", onClick: this.onNew }, "\u65B0\u589E");
        return () => React.createElement(Page, { header: label }, proxyLinks === undefined ?
            React.createElement(React.Fragment, null,
                React.createElement(SearchBox, { className: "w-100", onSearch: this.onSearch, placeholder: '搜索' + label }),
                React.createElement("div", { className: 'my-3' },
                    newButton,
                    React.createElement("button", { className: "btn btn-primary ml-3", onClick: this.onList }, "\u5217\u8868"))) :
            React.createElement(List, { className: "my-2", header: React.createElement(Muted, null,
                    label,
                    " \u4EE3\u7406\u4E0B\u5217Tuid"), items: proxyLinks, item: { render: this.entityRender, onClick: this.entityClick } }));
    }
}
//# sourceMappingURL=vTuidMain.js.map