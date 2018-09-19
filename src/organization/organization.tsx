import * as React from 'react';
import { Page, VmPage } from 'tonva-tools';
import { List, FA } from 'tonva-react-form';
import { CrUsq, Link, CrLink } from "tonva-react-usql";
import ui from './ui';
import { CrOpBinding } from './op';

export class CrOrganization extends CrUsq {
    constructor() {
        super('$$$/$unitx', 0, 0, undefined, ui);
    }

    label = '岗位权限';
    icon = 'sitemap';
    links: (Link|string)[];

    protected clearPrevPages() {
        // 保留回退按钮，所以，去掉下面这行
        //nav.clear();
    }

    protected async internalStart() {
        await this.loadSchema();
        this.links= [
            '',
            new CrLink(new CrOpBinding(this)),
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
        this.showVm(VmOrganization);
    }
    
}

class VmOrganization extends VmPage<CrOrganization> {
    //protected coordinator: CrOrganization;

    async showEntry() {
        this.openPage(this.appPage);
    }

    private renderRow = (link: Link, index:number) => {
        return link.render('bg-white');
    }

    protected appPage = () => {
        let {links, label} = this.coordinator;
        return <Page header={label} logout={()=>{}}>
            <List items={links} item={{render: this.renderRow}} />
        </Page>;
    };
}
