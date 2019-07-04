var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { SearchBox, List, Muted, LMR } from 'tonva';
import { Page } from 'tonva';
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
            newButton = React.createElement("button", { className: "btn btn-outline-success ml-2", onClick: this.onNew }, "\u65B0\u589E");
        let content;
        if (proxyLinks === undefined) {
            let right = React.createElement(React.Fragment, null,
                newButton,
                React.createElement("button", { className: "btn btn-outline-info ml-2", onClick: this.onList }, "\u5168\u90E8"));
            content = React.createElement(LMR, { className: 'm-3', right: right },
                React.createElement(SearchBox, { className: "w-100", size: "md", onSearch: this.onSearch, placeholder: '搜索' + label }));
        }
        else {
            content = React.createElement(List, { className: "my-2", header: React.createElement(Muted, null,
                    label,
                    " \u4EE3\u7406\u4E0B\u5217Tuid"), items: proxyLinks, item: { render: this.entityRender, onClick: this.entityClick } });
        }
        return () => React.createElement(Page, { header: label }, content);
    }
}
//# sourceMappingURL=vTuidMain.js.map