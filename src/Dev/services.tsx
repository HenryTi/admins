import * as React from 'react';
import {Row} from './row';
import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';

class Info extends React.Component {
    constructor(props:any) {
        super(props);
    }
    render() {
        return <div>
            Info
        </div>;
    }
}

const serviceTypeNames = ['中心', '交换', 'APP', 'API'];
const servicesProps:ObjViewProps<DevModel.Service> = {
    title: '',
    info: Info,
    formRows: [
        {
            label: 'URL',
            field: {name: 'url', type: 'string', required:true, maxLength:200}
        },
        {
            label: '描述',
            field: {name: 'discription', type: 'string', maxLength:100}
        },
        {
            label: '服务器',
            field: {name: 'server', type: 'id'},
            face:{
                type: 'pick-id', 
                initCaption: '请选择商品', 
                pick: undefined, //this.idPick,
                fromItem: (item:any)=>{return {id: item.id, caption: item.main+' ' + item.vice}},
            }
        },
    ],
    fields: [
        {
            type: 'string',
            name: 'url',
            label: 'URL',
            rules: ['required','maxlength:200'],
        },
        {
            type: 'string',
            name: 'discription',
            label: '描述',
            rules: ['maxlength:100'],
        },
        {
            type: 'string',
            name: 'server',
            label: '服务器',
        },
        {
            type: 'string',
            name: 'type',
            label: '服务类型',
            defaultValue: 0,
        },
    ],
    row: (item:DevModel.Service):JSX.Element => {
        return <Row
            icon={consts.appItemIcon}
            main={item.url}
            vice={serviceTypeNames[item.type] + ': ' + item.discription} />;
    },
    items: undefined, //store.dev.apps,
    repeated: {
        name: 'url',
        err: 'url重复',
    }
};

export default servicesProps;
