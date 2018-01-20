import * as React from 'react';
import {observer} from 'mobx-react';
import {Card, CardHeader, CardBody, CardText, CardTitle, Button} from 'reactstrap';
import {nav, Page} from 'tonva-tools';
import {List, LMR, FA} from 'tonva-react-form';
import consts from '../consts';
import {UnitApps, UnitAdmin, DevModel} from '../model';
import {store} from '../store';
import {ObjItems} from '../store/dev';
import ObjView, {ObjViewProps} from './ObjView';
import appsProps from './apps';
import apisProps from './apis';
import serversProps from './servers';
import servicesProps from './services';

interface Item<T extends DevModel.ObjBase> {
    title: string;
    count: number;
    icon: string;
    //items: ObjItems<T>;
    //page: JSX.Element;
    objProps: ObjViewProps<T>
}

@observer
export default class AdministorsPage extends React.Component {
    async componentDidMount() {
        await store.dev.loadCounts();
    }

    onNewFellow() {
        //nav.push(<NewFellow />);
    }
    onItemClick(ua:UnitAdmin) {
        store.admins.cur = ua;
        //nav.push(<EditAdmin />);
    }
    row(item: Item<DevModel.ObjBase>, index: number):JSX.Element {
        let {icon, title, count} = item;
        return <LMR className="px-3 py-2 align-items-center"
            left={<FA className="text-primary" name={icon} fixWidth={true} size="lg" />}
            right={count && <small className="text-muted">{count}</small>}>
            <b>{title}</b>
        </LMR>;
    }
    onClick(item:Item<DevModel.ObjBase>) {
        //items={item.items}
        return nav.push(<ObjView {...item.objProps} />)
    }
    render() {
        let {unit, dev} = store;
        let {counts} = dev;
        if (counts === undefined) return null;

        let items:Item<DevModel.ObjBase>[] = [
            {
                title: 'APP', 
                count: counts.app, 
                icon: 'tablet', 
                //items: store.dev.apps,
                //page: <ObjView {...appsProps} items={store.dev.apps} />
                objProps: appsProps
            },
            {
                title: 'API', 
                count: counts.api, 
                icon: 'cogs', 
                //items: store.dev.apis, 
                objProps: apisProps,
                //page: <ObjView {...apisProps} items={store.dev.apis} />
            },
            {
                title: 'Server', 
                count: counts.server, 
                icon: 'server', 
                //items: store.dev.servers, 
                //page: <ObjView {...serversProps} items={store.dev.servers} />
                objProps: serversProps,
            },
            {
                title: 'Service', 
                count: counts.service, 
                icon: 'microchip', 
                //items: store.dev.services, 
                //page: <ObjView {...servicesProps} items={store.dev.services} />
                objProps: servicesProps,
            },
        ];
        /*
        function rowClick(item: Item<DevModel.ObjBase>) {
            nav.push(<ObjView {...item.objProps} items={item.items} />);
        }*/   
        return <Page header={"应用开发"}>
            <List items={items} item={{render: this.row, onClick: this.onClick}} />
        </Page>;
    }
}