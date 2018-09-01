import * as React from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';
import * as _ from 'lodash';
import {Button} from 'reactstrap';
import {nav, Page} from 'tonva-tools';
import {FormRow, EasyDate, Media, 
    Prop, ListProp, PropGrid, List, SearchBox, LMR, Badge, Muted} from 'tonva-react-form';
import {UnitSpan, IdDates, ServerSpan} from '../tools';
import {appIcon, appItemIcon} from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {Row} from './row';
import {ObjViewProps} from './ObjView';

@observer
class Info extends React.Component<DevModel.Bus> {
    /*
    private rows: Prop[];
    constructor(props:any) {
        super(props);
        let {unit, name, discription, schema, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            '',
            {
                type: 'component', 
                label: 'Schema',
                vAlign: 'stretch',
                component: <SchemaView />,
            },
        ];
    }*/
    async componentDidMount() {
        //await store.dev.buses.loadCurApis();
    }
    render() {
        let {unit, name, discription, schema, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let rows:Prop[] = [
            '',
            {type: 'component', component: <Media icon={appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
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
        return <Row icon={appItemIcon} main={item.name} vice={item.discription} />;
    },
    items: ()=>store.dev.buses,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    },
    info: Info,
};

export default busesProps;
