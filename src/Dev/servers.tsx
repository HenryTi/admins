import * as React from 'react';
import {EasyDate, Media, Prop, PropGrid} from 'tonva-react-form';
import {UnitSpan, IdDates} from '../tools';
import {Row} from './row';
import {appIcon, appItemIcon} from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';

class Info extends React.Component<DevModel.Server> {
    render() {
        let {discription, cloud, ip, unit, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let rows:Prop[] = [
            '',
            {type: 'component', component: <Media icon={appIcon} main={discription} discription={ip} />},
            '',
            {type: 'component', label: '开发号', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {type: 'string', label: '云服务', name: 'cloud'},
        ];
        return <div>
            <PropGrid rows={rows} values={this.props} />
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
        return <Row icon={appItemIcon} main={item.discription} vice={<>{item.cloud}  {item.ip}</>} />;
    },
    items: ()=>store.dev.servers,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};

export default serversProps;
