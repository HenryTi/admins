/*
import * as React from 'react';
import {EasyDate, Media, Prop, PropGrid, LMR, FA, PickFace, FormProps, List, Muted} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {UnitSpan, IdDates, UqSpan} from '../tools';
import {Row} from './row';
import {appIcon, appItemIcon} from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjViewProps';
import {UqUpload} from './uqUpload';
import { observer } from 'mobx-react';


class Info extends React.Component<DevModel.Uqdb> {
    onUq() {
        alert('moved to uq');
        //nav.push(<UqUpload {...this.props} />);
    }
    render() {
        let {dbname, discription, uq, cloud, connection, unit, date_init, date_update} = this.props;
        //api = 55;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let rows:Prop[] = [
            '',
            {type: 'component', component: <Media icon={appIcon} main={dbname} discription={discription} />},
            '',
            {type: 'component', label: '开发号', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {type: 'component', label: 'UQ', component: <div className="py-2">
                <UqSpan id={uq} isLink={true} />
            </div>},
            {type: 'string', label: '云服务', name: 'cloud'},
            {type: 'component', label: 'uq代码', component:
                <LMR onClick={()=>this.onUq()} className="w-100 py-2 cursor-pointer"
                    left="上传编译uq代码" right={
                        <FA className="align-self-center" name="chevron-right" />
                } />
            },
        ];
        return <div>
            <PropGrid rows={rows} values={this.props} />
        </div>;
    }
}

const uqdbsProps:ObjViewProps<DevModel.Uqdb> = {
    title: 'uqDB',
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
            label: 'UQ',
            field: {name: 'uq', type: 'number', required: true},
            face: {
                type: 'pick',
                content: ({id}:{id:number})=><UqSpan id={id} isLink={false} />,
                fromPicked: (item:any) => {return {id:item.id, caption: 'API'} },
                pick: async (face:PickFace, formProps:FormProps, formValues:any):Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        nav.push(<SearchApis resolve={resolve} />);
                    });
                }
            }
        },
        {
            label: 'Connection',
            field: {name: 'connection', type: 'string', maxLength: 200},
            face: {type: 'textarea', rows: 6}
        },
    ],
    row: (item: DevModel.Uqdb):JSX.Element => {
        let {dbname, discription, cloud} = item;
        return <Row icon={appItemIcon} main={discription} vice={<>{dbname + '@' + cloud}</>} />;
    },
    items: ()=>store.dev.uqdbs,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};

export default uqdbsProps;

interface SearchApisProps {
    resolve: (api:any)=>void;
}
@observer
class SearchApis extends React.Component<SearchApisProps> {
    async componentWillMount() {
        await store.dev.uqs.load();
    }
    row = (api: DevModel.UQ) => {
        let {name, discription} = api;
        return <div className="d-flex justify-content-start py-2 px-3">
            <div className="align-self-center">{name} <Muted>{discription && ' -  ' + discription}</Muted></div>
        </div>
    }
    onSelect = (api: DevModel.UQ) => {
        nav.pop();
        this.props.resolve(api);
    }
    render() {
        return <Page back="close" header="选择API">
            <List items={store.dev.uqs.items} item={{render: this.row, onClick: this.onSelect}} loading={null} />
        </Page>;
    }
}
*/ 
//# sourceMappingURL=uqdbs.js.map