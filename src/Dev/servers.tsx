import * as React from 'react';
import {Prop, PropGrid, LMR, Muted, FA} from 'tonva-react-form';
import {UnitSpan, IdDates} from '../tools';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjViewProps';

class Info extends React.Component<DevModel.Server> {
    render() {
        let {discription, cloud, ip, unit, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;        
        //<Media icon={appIcon} main={discription} discription={ip} />},
        let rows:Prop[] = [
            '',
            {type: 'component', component: <LMR className="py-2"
                left={<FA name="server" className="text-primary fa-2x mr-3" />}>
                <div><b>{ip}</b></div>
                {disp}
            </LMR>},
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
        let {discription, cloud} = item;
        //return <Row main={item.discription} vice={<>{item.cloud}  {item.ip}</>} />;
        return <LMR className="py-2 px-3 align-items-center"
            left={<FA name="server" className="text-primary fa-lg" />}>
            <div className="px-3">
                <div><b>{discription}</b></div>
                <div><Muted>{cloud}</Muted></div>
            </div>
        </LMR>;
    },
    items: ()=>store.dev.servers,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};

export default serversProps;
