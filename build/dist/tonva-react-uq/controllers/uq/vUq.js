import React from "react";
import { View } from "tonva-tools";
import { List, Muted } from "tonva-react-form";
import { CLink } from "../link";
export class VUq extends View {
    constructor(cUq) {
        super(cUq);
        this.isSysVisible = false;
        this.view = () => {
            let { res, uq, error } = this.controller;
            let linkItem = {
                render: (cLink, index) => cLink.render(),
                onClick: undefined,
            };
            let lists = [
                {
                    header: res.tuid || 'TUID',
                    items: this.tuidLinks,
                },
                {
                    cn: 'my-2',
                    header: res.map || 'MAP',
                    items: this.mapLinks,
                },
                {
                    cn: 'my-2',
                    header: res.sheet || 'SHEET',
                    items: this.sheetLinks
                },
                {
                    cn: 'my-2',
                    header: res.action || 'ACTION',
                    items: this.actionLinks
                },
                {
                    cn: 'my-2',
                    header: res.query || 'QUERY',
                    items: this.queryLinks
                },
                {
                    cn: 'mt-2 mb-4',
                    header: res.book || 'BOOK',
                    items: this.bookLinks
                },
                {
                    cn: 'mt-2 mb-4',
                    header: res.history || 'HISTORY',
                    items: this.historyLinks
                },
                {
                    cn: 'mt-2 mb-4',
                    header: res.pending || 'PENDING',
                    items: this.pendingLinks
                }
            ];
            let content;
            if (error !== undefined) {
                content = React.createElement("div", { className: "p-3 text-danger" },
                    "\u8FDE\u63A5\u9519\u8BEF: ",
                    error);
            }
            else {
                content = lists.map(({ cn, header, items }, index) => items.length > 0 && React.createElement(List, { key: index, className: cn, header: React.createElement("div", { className: "px-3 py-1 bg-light" },
                        React.createElement(Muted, null, header)), items: items, item: linkItem }));
            }
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "px-3 py-1 small" }, res.uq || uq),
                content);
        };
        let { tuidArr, mapArr, sheetArr, actionArr, queryArr, bookArr, historyArr, pendingArr } = cUq.entities;
        this.tuidLinks = tuidArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cTuidMain(v)));
        this.mapLinks = mapArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cMap(v)));
        this.sheetLinks = sheetArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cSheet(v)));
        this.actionLinks = actionArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cAction(v)));
        this.queryLinks = queryArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cQuery(v)));
        this.bookLinks = bookArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cBook(v)));
        this.historyLinks = historyArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cHistory(v)));
        this.pendingLinks = pendingArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cPending(v)));
    }
    isVisible(entity) {
        return entity.sys !== true || this.isSysVisible;
    }
    render(param) {
        if (this.view === undefined)
            return React.createElement("div", null, "??? viewModel \u5FC5\u987B\u5B9A\u4E49 view ???");
        return React.createElement(this.view);
    }
}
//# sourceMappingURL=vUq.js.map