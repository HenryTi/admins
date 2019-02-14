import React from "react";
import { View } from "tonva-tools";
import { List, Muted } from "tonva-react-form";
import { Entity } from "../../entities";
import { CLink } from "../link";
import { CUq } from "./cUq";

export class VUq extends View<CUq> {
    protected isSysVisible = false;
    protected tuidLinks: CLink[];
    protected mapLinks: CLink[];
    protected sheetLinks: CLink[];
    protected actionLinks: CLink[];
    protected queryLinks: CLink[];
    protected bookLinks: CLink[];
    protected historyLinks: CLink[];
    protected pendingLinks: CLink[];

    constructor(cUq: CUq) {
        super(cUq);
        let {tuidArr, mapArr, sheetArr, actionArr, queryArr, bookArr, historyArr, pendingArr} = cUq.entities;
        this.tuidLinks = tuidArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cTuidMain(v)));
        this.mapLinks = mapArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cMap(v)));
        this.sheetLinks = sheetArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cSheet(v)));
        this.actionLinks = actionArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cAction(v)));
        this.queryLinks = queryArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cQuery(v)));
        this.bookLinks = bookArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cBook(v)));
        this.historyLinks = historyArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cHistory(v)));
        this.pendingLinks = pendingArr.filter(v => this.isVisible(v)).map(v => new CLink(this.controller.cPending(v)));
    }
    protected isVisible(entity: Entity):boolean {
        return entity.sys !== true || this.isSysVisible;
    }
    render(param?:any) {
        if (this.view === undefined) return <div>??? viewModel 必须定义 view ???</div>
        return React.createElement(this.view);
    }

    protected view = () => {
        let {res, uq, error} = this.controller;
        let linkItem = {
            render: (cLink:CLink, index:number):JSX.Element => cLink.render(), 
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
            content = <div className="p-3 text-danger">连接错误: {error}</div>;
        }
        else {
            content = lists.map(({cn, header, items},index) => items.length > 0 && <List
                key={index}
                className={cn}
                header={<div className="px-3 py-1 bg-light"><Muted>{header}</Muted></div>}
                items={items}
                item={linkItem} />
            );
        }
        return <>
            <div className="px-3 py-1 small">{res.uq || uq}</div>
            {content}
        </>;
    }
}
