var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { nav, Page } from 'tonva-tools';
import { List, LMR, FA } from 'tonva-react-form';
import { store } from '../store';
import ObjView from './ObjView';
import appsProps from './apps';
import apisProps from './apis';
import busesProps from './buses';
import serversProps from './servers';
import servicesProps from './services';
let AdministorsPage = class AdministorsPage extends React.Component {
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.dev.loadCounts();
        });
    }
    onNewFellow() {
        //nav.push(<NewFellow />);
    }
    onItemClick(ua) {
        store.admins.cur = ua;
        //nav.push(<EditAdmin />);
    }
    row(item, index) {
        let { icon, title, count } = item;
        return React.createElement(LMR, { className: "px-3 py-2 align-items-center", left: React.createElement(FA, { className: "text-primary", name: icon, fixWidth: true, size: "lg" }), right: count && React.createElement("small", { className: "text-muted" }, count) },
            React.createElement("b", null, title));
    }
    onClick(item) {
        //items={item.items}
        return nav.push(React.createElement(ObjView, Object.assign({}, item.objProps)));
    }
    render() {
        let { unit, dev } = store;
        let { counts } = dev;
        if (counts === undefined)
            return null;
        let items = [
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
            },
            {
                title: 'BUS',
                count: counts.bus,
                icon: 'cogs',
                objProps: busesProps,
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
        return React.createElement(Page, { header: "应用开发" },
            React.createElement(List, { items: items, item: { render: this.row, onClick: this.onClick } }));
    }
};
AdministorsPage = __decorate([
    observer
], AdministorsPage);
export default AdministorsPage;
//# sourceMappingURL=index.js.map