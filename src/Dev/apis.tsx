import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';

const apisProps:ObjViewProps<DevModel.Api> = {
    title: 'API',
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
    ],
    converter: (item)=> {
        return {
            icon: consts.appItemIcon,
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

export default apisProps;
