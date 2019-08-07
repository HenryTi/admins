import * as React from 'react';
import {observer} from 'mobx-react';
import _ from 'lodash';
import {EasyDate, Media, 
    Prop, ListProp, PropGrid, List, SearchBox, LMR, Badge, Muted, FA} from 'tonva';
import {UnitSpan, IdDates, ServerSpan} from '../tools';
import {appIcon, appItemIcon} from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {Row} from './row';
import {ObjViewProps} from './ObjViewProps';


const busIcon = 'cogs';

@observer
class Info extends React.Component<DevModel.Bus> {
    async componentDidMount() {
        //await store.dev.buses.loadCurApis();
    }
    render() {
        let {unit, owner, name, discription, mine, schema, version, date_init, date_update} = this.props;
        let disp = <small>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </small>;
        let caption:any = owner + ' / ' + name;
        if (mine === 1) {
            caption = <b>{caption}</b>;
        }
        let rows:Prop[] = [
            '',
            {type: 'component', component: <LMR className="py-2"
                left={<FA className="pt-2 pr-1 text-primary" name={busIcon} size="3x" />}>
                <div className="pl-3">
                    <div className="mb-2">{caption}</div>
                    {disp}
                </div>
            </LMR>},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {
                type: 'component', 
                label: '版本号', 
                component: <LMR className="py-2 w-100" right={<small className="text-muted"><EasyDate date={date_update}/></small>} >{version}</LMR> },
            '',
            {
                type: 'component', 
                label: 'Schema',
                vAlign: 'stretch',
                component: <SchemaView />,
            },
        ];
        return <div>
            <PropGrid rows={rows} values={this.props} />
        </div>
    }
}

@observer
export class SchemaView extends React.Component {
    render() {
        let bus = store.dev.buses.cur;
        if (bus === null) return '...';
        let content = bus.schema;
        return <div className="d-flex py-2 w-100 align-items-center" style={{flex:1}}>
            <pre>
                {content}
            </pre>
        </div>;

    }
}

const busesProps:ObjViewProps<DevModel.Bus> = {
    title: 'BUS',
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
            label: 'Schema',
            field: {name: 'schema', type: 'string', maxLength: 2500},
            face: {type: 'textarea', rows: 8}
        },
    ],
    row: (item:DevModel.Bus):JSX.Element => {
        let {owner, name, discription, mine} = item;
        let icon = appIcon;
        let main = owner + ' / ' + name;
        return <LMR className="py-2 px-3 align-items-stretch"
            left={<FA className="pt-2 pr-1 text-primary" name='cogs' size="lg" />}>
            <div className="px-3">
                <div>{mine===1? <b>{main}</b> : main}</div>
                <div><Muted>{discription}</Muted></div>
            </div>
        </LMR>;
    },
    items: ()=>store.dev.buses,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    },
    info: Info,
    canEdit: bus => bus.mine === 1,
};

export default busesProps;
