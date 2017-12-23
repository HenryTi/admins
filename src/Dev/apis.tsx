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
    /*
    fields: [
        {
            type: 'string',
            name: 'name',
            label: '名称',
            rules: ['required','maxlength:100'],
        },
        {
            type: 'text',
            name: 'discription',
            label: '描述',
            rules: ['maxlength:250'],
        },
    ],*/
    row: (item:DevModel.Api):JSX.Element => {
        return <Row icon={consts.appItemIcon} main={item.name} vice={item.discription} />;
    },
    items: undefined, //store.dev.apps,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    }
};

export default apisProps;
