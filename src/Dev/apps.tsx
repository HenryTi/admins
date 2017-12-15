import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';

const appsProps:ObjViewProps<DevModel.App> = {
    title: 'APP',
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
