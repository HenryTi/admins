import * as React from 'react';
import {EasyDate, Media, Prop, PropGrid, LMR, FA, PickFace, FormProps, List, Muted} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {UnitSpan, IdDates, ApiSpan} from '../tools';
import {Row} from './row';
import {appIcon, appItemIcon} from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';
import {UsqlUpload} from './usqlUpload';
import { observer } from 'mobx-react';

class Info extends React.Component<DevModel.Usqldb> {
    onUsql() {
        nav.push(<UsqlUpload {...this.props} />);
    }
    render() {
        let {dbname, discription, usq, cloud, connection, unit, date_init, date_update} = this.props;
        //api = 55;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let rows:Prop[] = [
            '',
            {type: 'component', component: <Media icon={appIcon} main={dbname} discription={discription} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            {type: 'component', label: 'API', component: <div className="py-2">
                <ApiSpan id={usq} isLink={true} />
            </div>},
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
            label: 'API', 
            field: {name: 'api', type: 'number', required: true},
            face: {
                type: 'pick', 
                content: ({id}:{id:number})=><ApiSpan id={id} isLink={false} />,
                fromPicked: (item:any) => {return {id:item.id, caption: 'API'} },
                pick: async (face:PickFace, formProps:FormProps, formValues:any):Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        nav.push(<SearchApis resolve={resolve} />);
                        /*
                            <button onClick={()=>{
                                resolve({id:18});
                                nav.pop();
                            }}>完成</button>
                        </Page>);*/
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
    row: (item: DevModel.Usqldb):JSX.Element => {
        let {dbname, discription, cloud} = item;
        return <Row icon={appItemIcon} main={discription} vice={<>{dbname + '@' + cloud}</>} />;
    },
    items: ()=>store.dev.usqldbs,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};

export default usqldbsProps;

interface SearchApisProps {
    resolve: (api:any)=>void;
}
@observer
class SearchApis extends React.Component<SearchApisProps> {
    async componentWillMount() {
        await store.dev.usqs.load();
    }
    /*
    onSearch = async (key:string) => {
        await store.dev.apis.items.apps.searchApi(key);
    }
    onBind(api: DevModel.Api, bind: boolean) {
        store.dev.apps.appBindApi([{id:api.id, access:['*']}]);
    }
    */
    row = (api: DevModel.Usq) => {
        let {name, discription} = api;
        return <div className="d-flex justify-content-start py-2 px-3">
            <div className="align-self-center">{name} <Muted>{discription && ' -  ' + discription}</Muted></div>
        </div>
    }
    onSelect = (api: DevModel.Usq) => {
        nav.pop();
        this.props.resolve(api);
    }
    render() {
        /*
        let header = <SearchBox className="w-100 mx-1" 
            onSearch={this.onSearch} 
            placeholder="搜索API名字" 
            maxLength={100} />;*/
        return <Page back="close" header="选择API">
            <List items={store.dev.usqs.items} item={{render: this.row, onClick: this.onSelect}} loading={null} />
        </Page>;
    }
}
