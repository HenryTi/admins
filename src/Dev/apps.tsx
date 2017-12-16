import {FormRow} from 'tonva-react-form';
import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';

const appsProps:ObjViewProps<DevModel.App> = {
    title: 'APP',
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
            label: '图标',
            field: {name: 'icon', type: 'string', maxLength: 250},
        },
        {
            label: '公开',
            field: {name: 'public', type: 'bool', defaultValue: 0}
        },
    ],
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
        {
            type: 'string',
            name: 'icon',
            label: '图标',
            rules: ['maxlength:250'],
        },
        {
            type: 'checkbox',
            name: 'public',
            label: '公开',
            defaultValue: 0,
        },
    ],
    converter: (item)=> {
        return {
            icon: item.icon || consts.appItemIcon,
            main: item.name,
            vice: item.discription,
        };
    },
    items: undefined, //store.dev.apps,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    }
};

export default appsProps;
