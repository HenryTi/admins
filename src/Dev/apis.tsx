import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {EasyDate, Media, Prop, PropGrid, Muted, List} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {UnitSpan, IdDates, ServerSpan} from '../tools';
import {Row} from './row';
import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';
import {NewService, ServiceInfo} from './servicePage';

@observer
class Info extends React.Component<DevModel.Api> {
    private rows:Prop[];
    constructor(props:any) {
        super(props);
        let {name, discription, unit, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={consts.appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
        ];
    }
    async componentDidMount() {
        await store.dev.services.loadApiServices(this.props.id);
    }
    private renderService(service:DevModel.Service, index:number):JSX.Element {
        let {url, server} = service;
        return <div className="d-flex w-100 align-items-center cursor-pointer" style={{flex:1}}>
            <div>
                <div>{url}</div>
                <ServerSpan id={server} />
            </div>
        </div>;
    }
    render() {
        let services = store.dev.services.items;
        return <div>
            <PropGrid rows={this.rows} values={this.props} />
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
            <List items={services} item={{render:this.renderService}} />
        </div>;
    }
}

const apisProps:ObjViewProps<DevModel.Api> = {
    title: 'API',
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
    ],
    row: (item:DevModel.Api):JSX.Element => {
        return <Row icon={consts.appItemIcon} main={item.name} vice={item.discription} />;
    },
    items: ()=>store.dev.apis,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    }
};

export default apisProps;
