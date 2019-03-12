import * as React from 'react';
import { SearchBox, List, Muted, LMR } from 'tonva-react-form';
import { TuidMain, Entity } from '../../entities';
import { Page } from 'tonva-tools';
import { CLink } from '../link';
import { VEntity } from '../CVEntity';
import { CTuidMain, TuidUI } from './cTuid';

export class VTuidMain extends VEntity<TuidMain, TuidUI, CTuidMain> {
    protected controller: CTuidMain;
    onNew = () => this.event('new');
    onList = () => this.event('list');
    onSearch = async (key:string) => this.event('list', key);

    async open(param?:any):Promise<void> {
        this.openPage(this.view);
    }

    protected entityRender(link: CLink, index: number): JSX.Element {
        return link.render();
    }

    protected async entityClick(link: CLink) {
        await link.onClick();
    }

    protected get view() {
        let {label, proxyLinks, isFrom} = this.controller;
        let newButton:any;
        if (isFrom === false) newButton = <button className="btn btn-outline-success ml-2" onClick={this.onNew}>新增</button>;
        let content:any;
        if (proxyLinks === undefined) {
            let right = <>
                {newButton}
                <button className="btn btn-outline-info ml-2" onClick={this.onList}>全部</button>
            </>;
            content = <LMR className='m-3' right={right}>
                <SearchBox className="w-100" size="md"
                    onSearch={this.onSearch} 
                    placeholder={'搜索'+label} />
            </LMR>;
        }
        else {
            content = <List className="my-2"
                header={<Muted>{label} 代理下列Tuid</Muted>}
                items={proxyLinks}
                item={{render: this.entityRender, onClick:this.entityClick}} />
        }
        return () => <Page header={label}>
            {content}
        </Page>;
    }
}
