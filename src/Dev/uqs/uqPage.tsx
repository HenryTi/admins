import * as React from 'react';
import { VPage, Page, nav } from 'tonva-tools';
import { UQController } from '.';
import { IdDates, UnitSpan, ServerSpan } from 'tools';
import { Prop, Media, LMR, FA, PropGrid, Muted, List, EasyDate, DropdownActions } from 'tonva-react-form';
import { appIcon } from 'consts';
import { DevModel } from 'model';
import { EditPage } from './editPage';

export class UQPage extends VPage<UQController> {
    async open() {
        this.openPage(this.page);
    }

    private editItem = async () => {
        await this.openVPage(EditPage);
        //nav.push(<EditAppPage {...this.props} />);
    }

    private deleteItem = async () => {
        if (confirm('真的要删除UQ吗？') === true) {
            await this.controller.deleteUq();
            nav.pop();
        }
    }

    private page = ():JSX.Element => {
        let {onUqUpload, serviceClick, uq, services} = this.controller;
        let {id, name, discription, access, unit, date_init, date_update} = uq;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let menuItems = [
            {caption:'修改UQ', action:this.editItem, icon:'edit' },
            {caption:'删除', action:this.deleteItem, icon:'trash-o' }
        ];
        let right = <DropdownActions actions={menuItems} />;
        let rows:Prop[] = [
            '',
            {
                type: 'component', 
                component: <div className="py-2">
                    <div><b>{name}</b></div>
                    {disp}
                </div>
            },
            {
                type: 'component', 
                label: '开发号', 
                component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> 
            },
           '',
           {
                type: 'component', 
                label: '编译代码', 
                component: <LMR onClick={()=>onUqUpload()} className="w-100 py-2 cursor-pointer" 
                    left="上传编译uq代码" right={<FA className="align-self-center" name="chevron-right" />} />
            },
            /*
            {type: 'component', label: 'ACCESS', component: <div className="py-2">{
                access? 
                    access.split(',').join(', ')
                    : <Muted>(全)</Muted>
            }</div> },
            */
        ];
        return <Page header={'UQ - ' + name} right={right}>
            <PropGrid rows={rows} values={uq} />
            <div className="d-flex mx-3 mt-3 mb-1 align-items-end">
                <Muted style={{display:'block', flex:1}}>Service</Muted>
                <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={()=>this.controller.showNewServicePage()}>
                    增加
                </button>
            </div>
            <List items={services} item={{render:this.renderService, onClick:serviceClick}} />
        </Page>;
    }
    private renderService(service:DevModel.Service, index:number):JSX.Element {
        let {url, server, db, db_type, compile_time} = service;
        let compile = !compile_time?
            <Muted>未编译</Muted> :
            <><Muted>编译: </Muted><EasyDate date={compile_time}/></>;

        return <LMR className="d-flex w-100 align-items-center cursor-pointer py-2 px-3"
            right={<small>{compile}</small>}
            >
            <div>
                <div>{url}</div>
                <div>{db_type} {db}</div>
                <Muted><ServerSpan id={server} /></Muted>
            </div>
        </LMR>;
    }
}
