import * as React from 'react';
import { VPage, Page, nav } from 'tonva';
import { AppController, UqAccess } from '.';
import { IdDates, UnitSpan, ServerSpan, UnitName } from 'tools';
import { Prop, Media, PropGrid, ListProp, DropdownActions, List, LMR } from 'tonva';
import { EditPage } from './editPage';
import { AppUqs, SearchUqPage } from './appUqs';
import { observer } from 'mobx-react';

export class AppPage extends VPage<AppController> {
    async open() {
        //this.uqs.list = this.controller.uqs;
        this.openPage(this.page);
    }

    private editItem = async () => {
        await this.openVPage(EditPage);
        //nav.push(<EditAppPage {...this.props} />);
    }

    private deleteItem = async () => {
        if (confirm('真的要删除吗？系统删除时并不会检查相关引用，请谨慎') === true) {
            await this.controller.deleteApp();
            nav.pop();
        }
    }

    private page = observer(():JSX.Element => {
        let {app} = this.controller;
        let {unit, name, caption, discription, icon, server, date_init, date_update} = app;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let menuItems = [
            // {icon: 'cogs', caption:'设置关联UQ', action: ()=>nav.push(<AppUqs />)},
            {caption:'修改App', action:this.editItem, icon:'edit' },
            {caption:'删除', action:this.deleteItem, icon:'trash-o' }
        ];

        let right = <DropdownActions actions={menuItems} />;
        let spanCaption = caption?
            <>{name}: <b>{caption}</b></> :
            <b>{name}</b>;
        let rows:Prop[] = [
            '',
            {
                type: 'component', 
                component: <Media icon={icon} main={spanCaption} discription={disp} />
            },
            '',
            {
                type: 'component', 
                label: '开发号', 
                component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> 
            },
            /*
            {
                type: 'component', 
                label: 'Service',
                vAlign: 'stretch',
                component: <ServiceRow />,
            },*/
            {
                label: 'URL',
                name: 'url',
                type: 'string',                
            },
            {
                type: 'component',
                label: '服务器',
                component: <ServerSpan id={server} />
            },
            '',
            //this.uqs,
        ];
        let btnAddUq = <button className="btn btn-outline-primary btn-sm" onClick={()=>this.openVPage(SearchUqPage)}>
            增加关联
        </button>;
        return <Page header={'App - ' + name} right={right}>
            <PropGrid rows={rows} values={app} />
            <LMR className="mx-3 mt-3 mb-1" right={btnAddUq}>
                关联UQ
            </LMR>
            <List items={this.controller.uqAccesses} item={{render:this.renderUqRow, onClick:this.uqClick}} />
        </Page>
    })

    private uqClick = (uqAccess:UqAccess) => {
        this.controller.onUq(uqAccess.uq);
    }

    private renderUqRow = (uqAccess:UqAccess, index:number):JSX.Element => {
        let {uq, bind_access: access} = uqAccess;
        let {name, discription, unit} = uq;
        let disp: any;
        let elAccess: any;
        if (access && access.length > 0) {
            elAccess = <> + {access.join(', ')} </>;
        }
        if (discription) disp = <div className="small text-muted"> &nbsp; {discription}</div>;
        return <LMR className="px-3 py-2 align-items-center" right={disp}>
            <UnitName id={unit} /> / {name} {elAccess}
        </LMR>
    }
}
