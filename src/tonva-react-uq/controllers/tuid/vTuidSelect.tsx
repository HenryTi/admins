import { nav, Page } from 'tonva-tools';
import { VTuidMainListBase, VTuidDivListBase } from './vTuidList';
import { VEntity } from '../CVEntity';
import { Tuid } from '../../entities';
import { CTuid, TuidUI } from './cTuid';
import { SearchBox, List } from 'tonva-react-form';
import React from 'react';
import { RowContent } from '../form/viewModel';
import { observer } from 'mobx-react';

export class VTuidSelect extends VEntity<Tuid, TuidUI, CTuid<Tuid>> {
    protected mainRowContent: (row:any) => JSX.Element;
    protected divRowContent: (row:any) => JSX.Element;

    async showEntry(param?:any): Promise<void> {
        if (param === undefined)
            await this.showMain(param);
        else
            await this.showDiv(param);
    }

    private async showMain(param) {
        this.mainRowContent = this.ui.rowContent || RowContent;
        await this.controller.searchMain(param);
        this.openPage(this.mainView);
    }

    private async showDiv(ownerValue: any) {
        let {divs} = this.ui;
        if (divs !== undefined) {
            this.divRowContent = divs[this.entity.name].rowContent;
        }
        if (this.divRowContent === undefined) {
            this.divRowContent = RowContent;
        }
        let divItems = await this.controller.getDivItems(ownerValue);
        this.openPage(this.divView, {items: divItems});
    }

    protected mainView = observer(() => {
        let header = <SearchBox className="mx-1 w-100"
            initKey={''}
            onSearch={this.onSearchMain} placeholder={'搜索'+this.label} />;
        return <Page header={header} back="close">
            <List
                items={this.controller.PageItems.items}
                item={{render: this.renderMainRow, onClick: this.clickMainRow}}
                before={'搜索'+this.label+'资料'} />
        </Page>;
    });

    onSearchMain = async (key:string) => {
        await this.controller.searchMain(key);
        //await this.PageItems.first(key);
    }
    renderMainRow = (item:any, index:number):JSX.Element => <this.mainRowContent {...item} />;
    clickMainRow = async (item:any) => {
        this.ceasePage();
        if (this.controller.entity.owner === undefined) {
            this.returnCall(item);
            return;
        }
        await this.showDiv(this.entity.getIdFromObj(item));
    }

    protected divView = (param:any) => {
        return <Page header="选择Div">
            <List
                items={param.items}
                item={{render: this.renderDivRow, onClick: this.clickDivRow}} />
        </Page>;
    }
    renderDivRow = (item:any, index:number):JSX.Element => <this.divRowContent {...item} />;
    clickDivRow = (item:any) => {
        this.ceasePage();
        this.returnCall(item);
    }
}
