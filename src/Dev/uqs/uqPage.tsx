import * as React from 'react';
import { VPage, Page, nav, EasyTime } from 'tonva';
import { UQController } from './uqController';
import { IdDates, UnitSpan, ServerSpan } from 'tools';
import { Prop, Media, LMR, FA, PropGrid, Muted, List, EasyDate, DropdownActions } from 'tonva';
import { DevModel } from 'model';
import { EditPage } from './editPage';
import { store } from 'store';
import { observer } from 'mobx-react';

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

    private page = observer(():JSX.Element => {
        let {onUqUpload, onUqTest, onUqDeploy, serviceClick, uq, services} = this.controller;
        let {isOwner} = store.unit;
        let {id, name, discription, access, unit, date_init, date_update} = uq;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let menuItems = [
            {caption:'修改UQ', action:this.editItem, icon:'edit' },
            {caption:'删除', action:this.deleteItem, icon:'trash-o' }
        ];
        let right = isOwner>0 && <DropdownActions actions={menuItems} />;
        let rows:Prop[] = [
            '',
            {
                type: 'component', 
                component: <LMR className="py-2"
                    left={<FA name="database" className="text-primary fa-2x mr-3" />}>
                    <div><b>{name}</b></div>
                    {disp}
                </LMR>
            },
            {
                type: 'component', 
                label: '开发号', 
                component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> 
            },
            '',
            {
                type: 'component',
                label: '上传UQ', 
                component: <LMR onClick={onUqUpload} className="w-100 py-2 cursor-pointer" 
                    left="上传提交UQ代码" right={<FA className="align-self-center" name="angle-right" />} />
            },
            {
                type: 'component', 
                label: '测试UQ', 
                component: <LMR onClick={onUqTest} className="w-100 py-2 cursor-pointer" 
                    left="升级UQ测试数据库" right={<FA className="align-self-center" name="angle-right" />} />
            },
            {
                type: 'component', 
                label: '发布UQ', 
                component: <LMR onClick={onUqDeploy} className="w-100 py-2 cursor-pointer" 
                    left="升级UQ生产数据库" right={<FA className="align-self-center" name="angle-right" />} />
            },
        ];

        let adminDev:any;
        let btnAddService:any;
        if (isOwner > 0) {
            btnAddService = <button
                className="btn btn-outline-primary btn-sm"
                onClick={()=>this.controller.showNewServicePage()}>
                增加
            </button>;
            let devList = this.controller.uqDevs.filter(v => v.isOwner===0);
            adminDev = <>
                <div className="d-flex mx-3 mt-3 mb-1 align-items-end">
                    <Muted style={{display:'block', flex:1}}>开发者</Muted>
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={()=>this.controller.uqDevsAdmin()}>
                        管理
                    </button>
                </div>
                <div className="p-2 d-flex flex-wrap bg-white">
                    {
                        devList.length === 0?
                        <span className="text-muted">无</span>
                        :
                        devList.map((v:any) => {
                            return <div key={v.id} className="m-2 ">{v.nick || v.name}</div>
                        })}
                </div>
            </>;
        }

        let onServiceClick:any;
        if (isOwner>0) onServiceClick = serviceClick;

        return <Page header={'UQ - ' + name} right={right}>
            <PropGrid rows={rows} values={uq} />
            {adminDev}
            <div className="d-flex mx-3 mt-3 mb-1 align-items-end">
                <Muted style={{display:'block', flex:1}}>Service</Muted>
                {btnAddService}
            </div>
            <List items={services} item={{
                render:(service:DevModel.Service, index:number)=><this.renderService service={service} index={index} />, 
                onClick:onServiceClick
            }} />
        </Page>;
    });
    private renderService = observer((props: {service:DevModel.Service; index:number}):JSX.Element => {
        let {service, index} = props;
        let {url, server, db, compile_time, deploy_time} = service;
        let compile = !compile_time?
            <Muted>未测试</Muted> 
            :
            <><Muted>测试: </Muted><EasyTime date={compile_time}/></>;
        let deploy = !deploy_time?
            <Muted>未发布</Muted> 
            :
            <><Muted>发布: </Muted><EasyTime date={deploy_time}/></>;

        return <LMR className="d-flex w-100 align-items-center cursor-pointer py-2 px-3"
            right={<small>{compile}<br/>{deploy}</small>}
            >
            <div>
                <div>{url}</div>
                <Muted><ServerSpan id={server} /></Muted>
            </div>
        </LMR>;
    })
}
