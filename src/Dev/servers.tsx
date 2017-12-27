import * as React from 'react';
import {EasyDate, Media, Prop, PropGrid} from 'tonva-react-form';
import {UnitLink, IdDates} from '../tools';
import {Row} from './row';
import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';

class Info extends React.Component<DevModel.Server> {
    private rows:Prop[];
    constructor(props:any) {
        super(props);
        let {discription, cloud, ip, unit, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={consts.appIcon} main={discription} discription={ip} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitLink id={unit} /></div> },
            {type: 'string', label: '云服务', name: 'cloud'},
        ];
    }
    render() {
        return <div>
            <PropGrid rows={this.rows} values={this.props} />
        </div>;
    }
}

const serversProps:ObjViewProps<DevModel.Server> = {
    title: 'Server',
    info: Info,
    formRows: [
        {
            label: '描述', 
            field: {name: 'discription', type: 'string', maxLength: 50, required: true},
        },
        {
            label: '云服务商', 
            field: {name: 'cloud', type: 'string', maxLength: 20, required: true},
        },
        {
            label: 'IP地址', 
            field: {name: 'ip', type: 'string', maxLength: 20},
        },
    ],
    row: (item: DevModel.Server):JSX.Element => {
        return <Row icon={consts.appItemIcon} main={item.discription} vice={item.cloud + ' ' + item.ip} />;
    },
    items: undefined, //store.dev.apps,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};

export default serversProps;
