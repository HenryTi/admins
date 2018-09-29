import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Step, Field, Prop, PropGrid, Media} from 'tonva-react-form';
import {UnitSpan, IdDates, ServerSpan, UsqSpan, AppSpan} from '../tools';
import {Row} from './row';
import {appIcon, appItemIcon} from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';
import {createIdPick, IdPickProps} from '../createIdPick';

class Info extends React.Component<DevModel.Service> {
    render() {
        let {url, type, discription, server, app, usq, unit, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let obj:Prop;
        if (app !== undefined)
            obj = {type: 'component', label: 'APP', component: <div className="py-2"><AppSpan id={app} isLink={true} /></div> };
        else
            obj = {type: 'component', label: 'USQ', component: <div className="py-2"><UsqSpan id={usq} isLink={true} /></div> };

        let rows:Prop[] = [
            '',
            {type: 'component', component: <Media icon={appIcon} main={discription} discription={url} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {type: 'component', label: '服务器', component: <div className="py-2"><ServerSpan id={server} isLink={true} /></div> },
            obj,
        ];
        return <div>
            <PropGrid rows={rows} values={this.props} />
        </div>;
    }
}

const idPickServerProps: IdPickProps = {
    caption: '选择服务器',
    searchPlaceHolder: '搜索服务器',
    candidateItems: async (params:any, key:string) => {
        await store.dev.searchServer.first(key);
        return store.dev.searchServer.items;
    },
    moreCandidates: async () => {
        await store.dev.searchServer.more();
    },
    row: (item:DevModel.Server, index:number) => {
        return <div className="px-3 py-2">{item.discription + ' ' + item.cloud + ' ' + item.ip}</div>;
    },
};

const idPickAppProps: IdPickProps = {
    caption: '选择APP',
    searchPlaceHolder: '搜索APP',
    candidateItems: async (params:any, key:string) => {
        await store.dev.searchApp.first(key);
        return store.dev.searchApp.items;
    },
    moreCandidates: async () => {
        await store.dev.searchApp.more();
    },
    row: (item:DevModel.App, index:number) => {
        return <div>{item.name + ' ' + item.discription}</div>;
    },
};

const idPickApiProps: IdPickProps = {
    caption: '选择API',
    searchPlaceHolder: '搜索API',
    candidateItems: async (params:any, key:string) => {
        await store.dev.searchUsq.first(key);
        return store.dev.searchUsq.items;
    },
    moreCandidates: async () => {
        await store.dev.searchUsq.more();
    },
    row: (item:DevModel.Usq, index:number) => {
        return <div>{item.name + ' ' + item.discription}</div>;
    },
};

const serviceTypeNames = ['中心', '交换', 'APP', 'API'];
const urlField:Field = {name: 'url', type: 'string', required:true, maxLength:200};
const discriptionField:Field = {name: 'discription', type: 'string', maxLength:100};
const serverField:Field = {name: 'server', type: 'id'};
const bindTypeField:Field = {name: 'type', type: 'number'};
const bindIdField:Field = {name: 'bindId', type: 'number'};
const authField:Field = {name: 'auth', type: 'string', maxLength:200};

const urlRow = {
    label: 'URL',
    field: urlField,
};
const discriptionRow = {
    label: '描述',
    field: discriptionField,
};

const serverRow = {
    label: '服务器', 
    field: serverField,
    face: {
        type: 'pick-id', 
        initCaption: '请选择服务器', 
        pick: createIdPick(idPickServerProps), //this.idPick,
        fromPicked: (item:DevModel.Server)=>{
            return {
                id: item.id, 
                caption: item.discription + ' ' + item.ip,
            };
        },
        itemFromId: (id:number)=>store.cacheServers.get(id),
    },
};

const servicesProps:ObjViewProps<DevModel.Service> = {
    title: 'Service',
    info: Info,
    formRows: [
        urlRow,
        discriptionRow,
        serverRow,
    ],
    steps: {
        step1: {
            formRows: [
                {
                    label: '服务类型', 
                    field: bindTypeField,
                    face: {
                        type: 'select', 
                        list: [
                            {text:'APP', value:2}, 
                            {text:'API', value:3}
                        ]
                    }
                },
            ],
            next: (values:any) => {
                switch (values['type']) {
                    case 2: return 'appStep';
                    case 3: return 'apiStep';
                }
            },
            ex: '服务类型',
        },
        appStep: {
            formRows: [
                urlRow,
                discriptionRow,
                serverRow,
                {
                    label: 'APP', 
                    field: bindIdField,
                    face:{
                        type: 'pick-id', 
                        initCaption: '请选择APP', 
                        pick: createIdPick(idPickAppProps), //this.idPick,
                        fromPickedItem: (item:DevModel.App)=>{
                            return {id: item.id, caption: item.name + ' ' + item.discription}
                        },
                    },
                },
            ],
            next: undefined,
            ex: '绑定APP'
        },
        apiStep: {
            formRows: [
                urlRow,
                discriptionRow,
                serverRow,
                {
                    label: 'API', 
                    field: bindIdField,
                    face:{
                        type: 'pick-id', 
                        initCaption: '请选择API', 
                        pick: createIdPick(idPickApiProps), //this.idPick,
                        fromPickedItem: (item:DevModel.Usq)=>{
                            return {id: item.id, caption: item.name + ' ' + item.discription}
                        },
                    },
                },                
                { label: 'Auth', field: authField },
            ],
            next: undefined,
            ex: '绑定API',
        },
    },
    stepHeader: (step:Step, num:number):JSX.Element => {
        return <div className="d-flex justify-content-center align-items-center">
            <h4><small className="text-muted">第{num}步</small> {step.ex}</h4>
        </div>;
    },
    row: (item:DevModel.Service):JSX.Element => {
        return <Row
            icon={appItemIcon}
            main={item.url}
            vice={serviceTypeNames[item.type] + ': ' + item.discription} />;
    },
    items: ()=>store.dev.services,
    repeated: {
        name: 'url',
        err: 'url重复',
    }
};

export default servicesProps;
