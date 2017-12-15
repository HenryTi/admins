import consts from '../consts';
import {DevModel} from '../model';
import {store} from '../store';
import {ObjViewProps} from './ObjView';

const serversProps:ObjViewProps<DevModel.Server> = {
    title: 'Server',
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
    ],
    converter: (item)=> {
        return {
            icon: consts.appItemIcon,
            main: item.discription,
            vice: item.cloud + ' ' + item.ip,
        };
    },
    items: undefined, //store.dev.apps,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};

export default serversProps;
