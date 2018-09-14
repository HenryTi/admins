import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {EasyDate, Media, Prop, PropGrid, Muted, List} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {UnitSpan, IdDates, ServerSpan} from 'tools';
import {Row} from './row';
import {appIcon, appItemIcon} from 'consts';
import {DevModel} from 'model';
import {store} from 'store';
import {ObjViewProps} from './ObjView';
import {NewService, ServiceInfo} from './servicePage';

@observer
class Info extends React.Component<DevModel.Usq> {
    /*
    private rows:Prop[];
    constructor(props:any) {
        super(props);
        let {name, discription, access, unit, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {type: 'component', label: '入口', component: <div className="py-2">{
                access? 
                    access.split(',').join(', ')
                    : <Muted>(全)</Muted>
            }</div> },
        ];
    }*/
    componentWillMount() {
        store.dev.services.items = undefined;
    }
    async componentDidMount() {
        await store.dev.services.loadApiServices(this.props.id);
    }
    private renderService(service:DevModel.Service, index:number):JSX.Element {
        let {url, server} = service;
        return <div className="d-flex w-100 align-items-center cursor-pointer py-2 px-3" style={{flex:1}}>
            <div>
                <div>{url}</div>
                <Muted><ServerSpan id={server} /></Muted>
            </div>
        </div>;
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
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {type: 'component', label: '入口', component: <div className="py-2">{
                access? 
                    access.split(',').join(', ')
                    : <Muted>(全)</Muted>
            }</div> },
        ];
        let services = store.dev.services.items;
        return <div>
            <PropGrid rows={rows} values={this.props} />
            <div className="d-flex mx-3 mt-3 mb-1 align-items-end">
                <Muted style={{display:'block', flex:1}}>Service列表</Muted>
                <Button
                    color="primary"
                    size="sm"
                    outline={true}
                    onClick={()=>nav.push(<NewService type={3} id={this.props.id} />)}>
                    增加Service
                </Button>
            </div>
            <List items={services} item={{render:this.renderService, onClick:this.serviceClick}} />
        </div>;
    }
}

const usqsProps:ObjViewProps<DevModel.Usq> = {
    title: 'USQ',
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
    row: (item:DevModel.Usq):JSX.Element => {
        return <Row icon={appItemIcon} main={item.name} vice={item.discription} />;
    },
    items: ()=>store.dev.usqs,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    }
};

export default usqsProps;
