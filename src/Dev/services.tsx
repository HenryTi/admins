import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';

const servicesProps:ObjViewProps<DevModel.Service> = {
    title: '',
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
    converter: (item)=> {
        return {
            icon: consts.appItemIcon,
            main: item.url,
            vice: item.discription,
        };
    },
    items: undefined, //store.dev.apps,
    repeated: {
        name: 'url',
        err: 'url重复',
    }
};

export default servicesProps;
