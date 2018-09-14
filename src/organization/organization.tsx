import * as React from 'react';
import { Page } from 'tonva-tools';
import { List } from 'tonva-react-form';
import { CrUsq, VmPage, VmEntityLink } from "tonva-react-usql";
import ui from './ui';

export class CrOrganization extends CrUsq {
    vmLinks: VmEntityLink[];

    constructor() {
        super('$$$/$unitx', 0, 0, undefined, ui);
    }

    protected clearPrevPages() {
        // 保留回退按钮，所以，去掉下面这行
        //nav.clear();
    }

    protected async internalStart() {
        await this.loadSchema();
        this.vmLinks= [
            this.vmLinkFromName('map', 'teamPerson'),
            this.vmLinkFromName('map', 'teamPerson'),
            this.vmLinkFromName('map', 'teamPerson'),
        ];
        this.showVm(VmOrganization);
    }
    
}

class VmOrganization extends VmPage {
    protected coordinator: CrOrganization;

    async showEntry() {
        this.openPage(this.appPage);
    }

    private renderRow = (vmLink: VmEntityLink, index:number) => {
        return vmLink.render('bg-white');
    }

    protected appPage = () => {
        let {vmLinks} = this.coordinator;
        return <Page header="组织结构" logout={()=>{}}>
            <List items={vmLinks} item={{render: this.renderRow}} />
        </Page>;
    };
}
