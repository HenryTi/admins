import * as React from 'react';
import { VPage, Page, EasyDate, EasyTime, DropdownActions, DropdownAction } from 'tonva';
import { UQController } from './uqController';
import { List, LMR, Badge, Muted, FA } from 'tonva';
import { DevModel } from 'model';
import { NewPage } from './editPage';
import { store } from 'store';

export class ListPage extends VPage<UQController> {
    async open(param:any) {
        this.openPage(this.page);
    }
    private newItem = () => {
        this.controller.uq = undefined;
        this.openVPage(NewPage);
    }
    private batchCompile = () => {
        this.openPage(this.batchCompilePage);
    }
    private page = ():JSX.Element => {
        let {uqList: list, listRowClick} = this.controller;
        let {isOwner} = store.unit;
        let actions:DropdownAction[] = [
            {icon:'plus', caption:'新增UQ', action: this.newItem},
            {icon:'plus', caption:'批量编译', action: this.batchCompile},
        ];
        let right = isOwner>0 && 
            <DropdownActions icon="bars" actions={actions}>
                <button className='btn btn-secondary btn-sm' onClick={()=>this.newItem()}><FA name="plus" /></button>
            </DropdownActions>
        return <Page header="UQ" right={right}>
            <List items={list} item={{render: this.listRow, onClick: listRowClick}} />
        </Page>
    }
    private listRow = (item:DevModel.UQ):JSX.Element => {
        let {name, discription, service_count, date_init, date_update} = item;
        return <LMR className="py-1 px-3 align-items-center"
            left={<FA name="database" className="text-primary fa-lg" />}
            right={<div className="text-right">
                <div><small className="text-muted">服务数:</small> {service_count}</div>
                <div className="small text-muted"><EasyTime date={date_update} /></div>
            </div>}>
            <div className="py-2 px-3">
                <div><b>{name}</b></div>
                <div><Muted>{discription}</Muted></div>
            </div>
        </LMR>;
    }

    private onSelect = (item:DevModel.UQ, isSelected:boolean, anySelected:boolean) => {
        //alert('ok');
    }

    private listCompileRow = (item:DevModel.UQ):JSX.Element => {
        let {name, discription, service_count, date_init, date_update} = item;
        return <LMR className="py-1 px-3 align-items-center"
            left={<FA name="database" className="text-info fa-lg" />}
            right={<div className="text-right">
                <div className="small text-muted"><EasyTime date={date_update} /></div>
            </div>}>
            <div className="py-2 px-3">
                <div><b>{name}</b></div>
                <div><Muted>{discription}</Muted></div>
            </div>
        </LMR>;
    }

    private list:List;
    private selectAll = () => {
        this.list.selectAll();
    }
    private unselectAll = () => {
        this.list.unselectAll();
    }
    private test = () => {
        this.compile(true, false);
    }
    private testThoroughly = () => {
        this.compile(true, true);
    }
    private deploy = () => {
        this.compile(false, false);
    }
    private deployThoroughly = () => {
        this.compile(false, true);
    }
    private compile(isTest:boolean, thoroughly: boolean) {
        let selectItems = this.list.selectedItems;
        alert('代码没有完成，先挨个操作吧 :-(\n' + JSON.stringify(selectItems));
    }

    private batchCompilePage = ():JSX.Element => {
        let {uqList: list, listRowClick} = this.controller;
        let right = <span>
            <button className="btn btn-sm btn-link" onClick={this.selectAll}>全选</button> 
            <button className="btn btn-sm btn-link" onClick={this.unselectAll}>全清</button>
        </span>;
        let cnBtn = 'btn btn-sm btn-outline-primary mr-3';
        return <Page header="批量编译">
            <LMR className="px-3 py-1" right={right}>
                <button className={cnBtn} onClick={this.test}>测试</button>
                <button className={cnBtn} onClick={this.deploy}>发布</button>
                <button className={cnBtn} onClick={this.testThoroughly}>彻底测试</button>
                <button className={cnBtn} onClick={this.deployThoroughly}>彻底发布</button>
            </LMR>
            <List ref={list=>this.list = list} items={list} item={{render: this.listCompileRow, onSelect: this.onSelect}} />
        </Page>
    }
}

