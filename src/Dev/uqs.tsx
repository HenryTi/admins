import * as React from 'react';
import {observer} from 'mobx-react';
import {EasyDate, Media, Prop, PropGrid, Muted, List, LMR, Badge, FA} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {UnitSpan, IdDates, ServerSpan} from 'tools';
import {appIcon, appItemIcon} from 'consts';
import {store} from '../store';
import {DevModel} from '../model';
import {ObjViewProps} from './ObjViewProps';
import {NewService, ServiceInfo} from './uq-servicePage';
import { UqUpload, UpUploadProps } from './uqUpload';

@observer
class Info extends React.Component<DevModel.UQ> {
    componentWillMount() {
        store.dev.services.items = undefined;
    }
    async componentDidMount() {
        await store.dev.services.loadUqServices(this.props.id);
    }
    private onUq = async() => {
        nav.push(<UqUpload uq={this.props} services={store.dev.services.items} />);
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
    private serviceClick(service:DevModel.Service) {
        store.dev.services.cur = service;
        nav.push(<ServiceInfo />);
    }
    render() {
        let {name, discription, access, unit, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let rows:Prop[] = [
            '',
            {type: 'component', component: <Media icon={appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '开发号', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {type: 'component', label: '入口', component: <div className="py-2">{
                access? 
                    access.split(',').join(', ')
                    : <Muted>(全)</Muted>
            }</div> },
            {
                type: 'component', 
                label: '编译代码', 
                component: <LMR onClick={()=>this.onUq()} className="w-100 py-2 cursor-pointer" 
                    left="上传编译uq代码" right={<FA className="align-self-center" name="chevron-right" />} />
            },
        ];
        let services = store.dev.services.items;
        return <div>
            <PropGrid rows={rows} values={this.props} />
            <div className="d-flex mx-3 mt-3 mb-1 align-items-end">
                <Muted style={{display:'block', flex:1}}>Service</Muted>
                <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={()=>nav.push(<NewService type={3} id={this.props.id} />)}>
                    增加
                </button>
            </div>
            <List items={services} item={{render:this.renderService, onClick:this.serviceClick}} />
        </div>;
    }
}

const uqsProps:ObjViewProps<DevModel.UQ> = {
    title: 'UQ',
    info: Info,
    formRows: [
        {
            label: '名称', 
            field: {name: 'name', type: 'string', maxLength: 100, required: true},
        },
        {
            label: '描述',
            field: {name: 'discription', type: 'string', maxLength: 250},
            face: {type: 'textarea'}
        },
        {
            label: '入口',
            field: {name: 'access', type: 'string', maxLength: 250},
            face: {type: 'textarea', placeholder: '逗号分隔的入口名'}
        },
    ],
    row: (item:DevModel.UQ):JSX.Element => {
        let {name, discription, service_count} = item;
        let icon = appItemIcon;
        //return <Row icon={appItemIcon} main={item.name} vice={item.discription} />;
        return <LMR className="py-1 px-3 align-items-stretch"
            left={<Badge size="sm" className="pt-1"><img src={icon} /></Badge>}
            right={<>{service_count}</>}>
            <div className="px-3">
                <div><b>{name}</b></div>
                <div><Muted>{discription}</Muted></div>
            </div>
        </LMR>;
    },
    items: ()=>store.dev.uqs,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    }
};

export default uqsProps;
