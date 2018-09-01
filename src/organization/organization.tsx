import * as React from 'react';
import { CrApp } from "tonva-react-usql";
import { Page } from 'tonva-tools';
//import { Page, meInFrame } from "tonva-tools";


export class CrOrganization extends CrApp {
    constructor() {
        super('$$$/$unitx', undefined);
    }

    protected clearPrevPages() {
        // 保留回退按钮，所以，去掉下面这行
        //nav.clear();
    }

    protected appPage = () => {
        let crUsq = this.crUsqCollection['$$$/$unitx'];
        let teamPerson = crUsq.vmLinkFromName('map', 'teamPerson');
        return <Page header={this.caption} logout={()=>{}}>
            <button onClick={this.testClick}>定义组织结构</button>
            {teamPerson.render()}
        </Page>;
    };
    
}
