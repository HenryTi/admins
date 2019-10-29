import * as React from 'react';
import { VPage, Page, LMR, Image, List } from 'tonva';
import { UQController } from './uqController';
import { UnitAdmin } from '../../model';
import { store } from '../../store';

export class UqDevsAdmin extends VPage<UQController> {
    async open() {
        await this.controller.loadAdmins();
        this.openPage(this.page);
    }

    private onSelect = async (admin:any, isSelected:boolean) => {
        await this.controller.devChanged(admin, isSelected);
    }

    private page = ():JSX.Element => {
        let {admins} = store.admins;
        let {uqDevs} = this.controller;
        let selectedItems = admins.filter(v => uqDevs.find(d => d.userId === v.id) !== undefined);
        return <Page header="增减开发者">
            <List
                className='my-4' 
                header="开发者" items={admins} 
                none='[无]'
                selectedItems = {selectedItems}
                item={{onSelect: this.onSelect, render: this.row}}
            />
        </Page>;
    }

    private row = ({icon, name, nick}:UnitAdmin) => {
        let content = nick?
            <><b>{nick}</b> &nbsp; <small className="text-muted">{name}</small></>
            :
            <b>{name}</b>;
        let left = <Image className="w-2-5c h-2-5c" src={icon} />; 
        return <LMR className="py-2 px-3 align-items-stretch" left={left}>
            <div className="px-3">{content}</div>
        </LMR>;
    }

}
