import * as React from 'react';
import {EasyDate, Media, Prop, PropGrid, LMR, FA} from 'tonva-react-form';
import {nav} from 'tonva-tools';
import {UnitSpan, IdDates} from '../tools';
import {Row} from './row';
import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';
import {UsqlUpload} from './usqlUpload';

class Info extends React.Component<DevModel.Usqldb> {
    onUsql() {
        nav.push(<UsqlUpload {...this.props} />);
    }
    render() {
        let {dbname, discription, cloud, connection, unit, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let rows:Prop[] = [
            '',
            {type: 'component', component: <Media icon={consts.appIcon} main={dbname} discription={discription} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {type: 'string', label: '云服务', name: 'cloud'},
            {type: 'component', label: 'usql代码', component: 
                <LMR onClick={()=>this.onUsql()} className="w-100 py-2 cursor-pointer" 
                    left="上传编译usql代码" right={
                        <FA className="align-self-center" name="chevron-right" />
                } />
            },
        ];
        return <div>
            <PropGrid rows={rows} values={this.props} />
        </div>;
    }
}

const usqldbsProps:ObjViewProps<DevModel.Usqldb> = {
    title: 'UsqlDB',
    info: Info,
    formRows: [
        {
            label: '数据库名', 
            field: {name: 'dbname', type: 'string', maxLength: 50, required: true},
        },
        {
            label: '描述', 
            field: {name: 'discription', type: 'string', maxLength: 50, required: true},
        },
        {
            label: '云服务商', 
            field: {name: 'cloud', type: 'string', maxLength: 20, required: true},
        },
        {
            label: 'Connection', 
            field: {name: 'connection', type: 'string', maxLength: 200},
            face: {type: 'textarea'}
        },
    ],
    row: (item: DevModel.Usqldb):JSX.Element => {
        let {dbname, discription, cloud} = item;
        return <Row icon={consts.appItemIcon} main={discription} vice={<>{dbname + '@' + cloud}</>} />;
    },
    items: ()=>store.dev.usqldbs,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};

export default usqldbsProps;
