import * as React from 'react';
import { Page, VPage } from 'tonva-tools';
import { List, FA } from 'tonva-react-form';
import { CUsq, Link, CLink } from "tonva-react-usql";
import ui from './ui';
import { COpBinding } from './op';

export class COrganization extends CUsq {
    constructor() {
        super('$$$/$unitx', 0, 0, undefined, ui);
    }

    label = '岗位权限';
    icon = 'sitemap';
    links: (CLink|string)[];

    protected clearPrevPages() {
        // 保留回退按钮，所以，去掉下面这行
        //nav.clear();
    }

    protected async loadEntites() {
        // 只有赋Entity权限的地方，需要取全部的Entities，其它地方默认取user access，this.entities.loadAccess()
        await this.entities.loadEntities();
    }

    protected async internalStart() {
        await this.loadSchema();
        this.links= [
            '',
            new CLink(new COpBinding(this, this.res)),
            '',
            this.linkFromName('map', 'teamPerson'),
            this.linkFromName('map', 'sectionTeam'),
            this.linkFromName('map', 'teamOrganization'),
            '',
            this.linkFromName('tuid', 'person'),
            this.linkFromName('tuid', 'team'),
            this.linkFromName('tuid', 'section'),
            this.linkFromName('tuid', 'organization'),
        ];
        this.showVPage(VOrganization);
    }
    
}

class VOrganization extends VPage<COrganization> {
    async showEntry() {
        this.openPage(this.appPage);
    }

    private renderRow = (link: Link, index:number) => {
        return link.render('bg-white');
    }

    protected appPage = () => {
        let {links, label} = this.controller;
        return <Page header={label} logout={()=>{}}>
            <List items={links} item={{render: this.renderRow}} />
        </Page>;
    };
}
