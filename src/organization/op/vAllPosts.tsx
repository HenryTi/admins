import * as React from 'react';
import { VPage, Page } from "tonva-tools";
import { COpBinding } from "./cOpBinding";
import { Entity, EntityBlock, Uq } from './model';
import { entityIcons, CAction, CQuery } from 'tonva-react-uq';
import { List, Muted, LMR, FA } from 'tonva-react-form';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

interface Checked {
    def: boolean;
    checked: boolean;
}

export class VAllPosts extends VPage<COpBinding> {
    private uq: Uq;
    private blocks:EntityBlock[];
    private checked:{[entity:string]:Checked} = {};

    @observable private isChanged:boolean = false;
    async showEntry(uq: Uq) {
        this.uq = uq;
        let {name, tuids, actions, maps, books, queries, histories, pendings, sheets} = this.uq;
        this.blocks = [
            {items: tuids, type: 'tuid'},
            {items: sheets, type: 'sheet'},
            {items: actions, type: 'action'},
            {items: maps, type: 'map'},
            {items: books, type: 'book'},
            {items: queries, type: 'query'},
            {items: histories, type: 'history'},
            {items: pendings, type: 'pending'},
        ];
        let getEntityOpForAll = this.controller.cUq.cFromName('query', 'getEntityOpForAll') as CQuery;
        let entityOpForAllResult = await getEntityOpForAll.entity.query({uq: this.uq.id});
        let entityOpForAll:{[entity:string]:boolean} = {};
        for (let eaa of entityOpForAllResult.ret) {
            entityOpForAll[eaa.entity] = true;
        }
        for (let b of this.blocks) {
            let {items} = b;
            if (items === undefined) continue;
            for (let item of items) {
                let {name} = item;
                let checked = (entityOpForAll[name] === true);
                this.checked[name] = {
                    def: checked,
                    checked: checked,
                };
            }
        }
        this.openPage(this.pageRender);
        this.regConfirmClose(async ():Promise<boolean> => {
            if (this.isChanged === false) return true;
            return confirm('未保存\n真的不保存吗？');
        });
    }

    private onCheckChanged = (entity:Entity, checked: boolean) => {
        this.checked[entity.name].checked = checked;
        let isChanged:boolean = false;
        for (let i in this.checked) {
            let {def, checked} = this.checked[i];
            if (def !== checked) {
                isChanged = true;
                break;
            }
        }
        this.isChanged = isChanged;
    }

    private saveChange = async () => {
        let entities:{entity:string}[] = [];
        for (let i in this.checked) {
            if (this.checked[i].checked !== true) continue;
            entities.push({entity: i});
        }
        let saveEntityOpForAll = this.controller.cUq.cFromName('action', 'saveEntityOpForAll') as CAction;
        let ret = await saveEntityOpForAll.entity.submit({
            uq: this.uq.id,
            entities: entities,
        });
        this.ceasePage();
        this.openPageElement(<Page header="所有岗位可操作" back="close">
            <div className="p-3">
                <FA name="check-circle" className="text-success" /> &nbsp;
                已保存
            </div>
        </Page>);
    }

    private entityRender(entity:Entity, icon:any) {
        let {name} = entity;
        let right = <input className="mr-3 align-middle"
            type="checkbox" 
            defaultChecked={this.checked[name].def}
            onChange={(evt)=>this.onCheckChanged(entity, evt.target.checked)}/>

        return <LMR className="px-3 py-2 align-items-center"
            right={right}>
            {icon} &nbsp; {name}
        </LMR>;
    }

    private pageRender = observer(() => {
        /*
        let {name, tuids, actions, maps, books, queries, histories, pendings, sheets} = this.uq;
        let blocks:EntityBlock[] = [
            {items: tuids, type: 'tuid'},
            {items: sheets, type: 'sheet'},
            {items: actions, type: 'action'},
            {items: maps, type: 'map'},
            {items: books, type: 'book'},
            {items: queries, type: 'query'},
            {items: histories, type: 'history'},
            {items: pendings, type: 'pending'},
        ];*/
        let buttonSave = this.isChanged===true? <button className="btn btn-sm btn-success" onClick={this.saveChange}>保存</button> : null;
        return <Page header={'所有岗位可操作'} right={buttonSave}>
            <div className="text-muted p-3 small">
                <div style={{lineHeight:'1.8', fontWeight:'bold'}}>说明</div>
                <ol className="pl-3" style={{listStyleType: '1', lineHeight: '1.8'}}>
                    <li >
                        有些操作，默认允许所有用户可操作，可以在这里设置。
                    </li>
                    <li>
                        比如，用户下订单。任何客户，登录进系统，都可以下单。
                    </li>
                    <li>
                        如果每个用户都需要设置，用户会丢失，管理人员会繁琐。
                    </li>
                </ol>
            </div>
            {this.blocks.map(block => {
                let {items, type} = block;
                let icon = entityIcons[type];
                return items && items.length>0 &&
                    <List key={type}
                        className="mt-3"
                        header={<Muted className="px-3 pt-1 bg-light w-100">{this.res[type]||type}</Muted>} 
                        items={items} 
                        item={{
                            render:(item:any, index:number)=>this.entityRender(item, icon), 
                            onClick: undefined
                        }} />;
            })}
        </Page>;
    });
}
