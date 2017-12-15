import * as React from 'react';
import {observer} from 'mobx-react';
import {Card, CardHeader, CardBody, CardText, CardTitle, Button} from 'reactstrap';
import {nav, Page, ListView, ListItem, rowIcon} from 'tonva-tools';
import consts from '../consts';
import {UnitApps, UnitAdmin, DevModel} from '../model';
import {store} from '../store';
import {List} from '../store/dev';
import ObjView, {ObjViewProps} from './ObjView';
import appsProps from './apps';
import apisProps from './apis';
import serversProps from './servers';
import servicesProps from './services';

const iconColor = 'green';

function rowItem<T extends DevModel.ObjBase>(title:string, count:number, 
    icon:string, 
    items: List<T>,
    props:ObjViewProps<T>):ListItem 
{
    props.items = items;
    return {
        main: title,
        right: count>0? String(count):'',
        icon: rowIcon(icon, iconColor),
        onClick: () => nav.push(<ObjView {...props} />),
    };
}

@observer
export default class AdministorsPage extends React.Component {
    async componentDidMount() {
        await store.dev.loadCounts();
    }

    converter(admin: UnitAdmin):ListItem {
        return {
            key: admin.id,
            date: undefined,
            main: admin.name,
            vice: admin.nick,
            icon : admin.icon || consts.appItemIcon,
            //right: <aside>ddd</aside>
            //unread: 0,
        };
    }
    onNewFellow() {
        //nav.push(<NewFellow />);
    }
    onItemClick(ua:UnitAdmin) {
        store.admins.cur = ua;
        //nav.push(<EditAdmin />);
    }
    render() {
        let {unit, dev} = store;
        let {counts} = dev;
        if (counts === undefined) return null;

        let items:ListItem[] = [
            rowItem<DevModel.App>('APP', counts.app, 'tablet', store.dev.apps, appsProps),
            rowItem<DevModel.Api>('API', counts.api, 'cogs', store.dev.apis, apisProps),
            rowItem<DevModel.Server>('Server', counts.server, 'server', store.dev.servers, serversProps),
            rowItem<DevModel.Service>('Service', counts.service, 'microchip', store.dev.services, servicesProps),
        ];

        return <Page header={"应用开发"}>
            <ListView items={items} />
        </Page>;
    }
}
