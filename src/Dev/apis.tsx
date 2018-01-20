import * as React from 'react';
import {EasyDate, Media, Prop, PropGrid} from 'tonva-react-form';
import {UnitSpan, IdDates} from '../tools';
import {Row} from './row';
import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';

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
    render() {
        return <div>
            <PropGrid rows={this.rows} values={this.props} />
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