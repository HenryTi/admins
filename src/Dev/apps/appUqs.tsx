import * as React from 'react';
import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { List, LMR, SearchBox } from 'tonva-react-form';
import { DevModel } from 'model';
import { UnitSpan } from 'tools';
import { store } from 'store';
import { nav, Page, VPage } from 'tonva-tools';
import { AppController } from '.';

export class SearchUqPage extends VPage<AppController> {
    @observable private uqs: DevModel.UQ[];

    async showEntry() {
        this.uqs = await this.controller.getMyUqs();
        this.openPage(this.page);
    }

    private onSearch = async (key:string) => {
        let pageStart = 0;
        let pageSize = 100;
        this.uqs = await this.controller.searchUq(key, pageStart, pageSize);
    }

    private page = observer(() => {
        let header = <SearchBox className="w-100 mx-1" 
            onSearch={this.onSearch}
            placeholder="搜索UQ名字" 
            maxLength={100} />;
        return <Page back="close" header={header}>
            <List items={this.uqs} item={{render: this.row, onClick: this.controller.onUq}} />
        </Page>;
    });

    private row = (uq: DevModel.UQ) => {
        let {owner, name, discription} = uq;
        return <LMR className="py-2 px-3" right={discription}>
            <div>{owner} / {name}</div>
        </LMR>;
    };
}

@observer
export class AppUqs extends React.Component {
    @observable anySelected: boolean = false;
    private list:List;
    private onSelect = (item: DevModel.UQ, isSelected:boolean, anySelected:boolean) => {
        this.anySelected = anySelected;
    }
    private row = (item: DevModel.UQ) => {
        let {name, unit, discription} = item;
        return <LMR className="p-2" right={<small className="text-muted">{discription}</small>}>
            <UnitSpan id={unit} />/{name}
        </LMR>;
    }
    private removeBind = () => {
        if (this.list === null) return;
        let {selectedItems} = this.list;
        if (selectedItems === undefined) return;
        if (selectedItems.length === 0) return;
        store.dev.apps.appBindUq(
            selectedItems.map(v => {
                return {id:v.id, access:['*']}
            }), 
            false);
    }
    render() {
        let btnProps = this.anySelected?
            {color:'danger', onClick:this.removeBind, icon:'trash', text:'取消'}:
            {color:'primary', onClick:()=>nav.push(<Uqs/>), icon:'plus', text:'新增'};
        let btn = (p)=><button 
            className={classNames('btn', 'btn-outline-'+p.color, 'btn-sm')} 
            onClick={p.onClick}>
            <i className={"fa fa-" + p.icon} /> {p.text}关联
        </button>;
        let listHeader = <div className="va-row py-1 justify-content-center">{btn(btnProps)}</div>;
        return <Page header="关联UQ">
            <List ref={list=>this.list=list} header={listHeader}
                items={store.dev.apps.uqs}
                item={{render: this.row, onSelect: this.onSelect}} />
        </Page>;
    }
}

@observer
class Uqs extends React.Component {
    onSearch = async (key:string) => {
        await store.dev.apps.searchUq(key);
    }
    onBind(uq: DevModel.UQ, bind: boolean) {
        store.dev.apps.appBindUq([{id:uq.id, access:['*']}], bind);
    }
    row = (uq: DevModel.UQ) => {
        let isConnected = store.dev.apps.uqs.find(a => a.id === uq.id) !== undefined;
        let cn = ['btn', 'btn-sm'];
        let btnContent:any, onClick:any;
        if (isConnected) {
            cn.push('btn-success');
            onClick = ()=>this.onBind(uq, false);
            btnContent = "已关联";
        }
        else {
            cn.push('btn-primary');
            onClick = ()=>this.onBind(uq, true);
            btnContent = <span><i className="fa fa-check"/> 关联</span>;
        }
        return <div className="d-flex justify-content-start py-1 px-3">
            <div className="align-self-center">{uq.name + ' - ' + uq.discription}</div>
            <footer className="ml-auto"><button className={classNames(cn)} onClick={onClick}>{btnContent}</button></footer>
        </div>
    }
    render() {
        let header = <SearchBox className="w-100 mx-1" 
            onSearch={this.onSearch} 
            placeholder="搜索UQ名字" 
            maxLength={100} />;
        return <Page back="close" header={header}>
            <List items={store.dev.apps.searchedUqs} item={{render: this.row}} loading={null} />
        </Page>;
    }
}
