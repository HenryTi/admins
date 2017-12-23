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
    /*
    fields: [
        {
            type: 'string',
            name: 'discription',
            label: '描述',
            rules: ['required', 'maxlength:50'],
        },
        {
            type: 'string',
            name: 'cloud',
            label: '云服务商',
            rules: ['required', 'maxlength:20'],
        },
        {
            type: 'string',
            name: 'ip',
            label: 'IP地址',
            rules: ['maxlength:20'],
        },
    ],*/
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
