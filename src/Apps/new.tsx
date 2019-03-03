import * as React from 'react';
import {IObservableArray} from 'mobx';
import {observer} from 'mobx-react';
import {SearchBox, Media, List, LMR, Badge, Prop, PropGrid} from 'tonva-react-form';
import {nav, Page, PageItems, Image} from 'tonva-tools';
import {mainApi} from '../api';
import {store} from '../store';
import {UnitApp} from '../model';
import {Info} from './info';

class PageApps extends PageItems<UnitApp> {
    private unitId:number;
    constructor(unitId:number) {
        super();
        this.unitId = unitId;
    }
    protected async load():Promise<UnitApp[]> {
        return await mainApi.searchApp(this.unitId, this.param, this.pageStart, this.pageSize);
    }
    protected setPageStart(item:UnitApp) {
        if (item === undefined)
            this.pageStart = 0;
        else
            this.pageStart = item.id;
    }
}

@observer
export class NewApp extends React.Component {
    private apps: PageApps;
    constructor(props) {
        super(props);
        this.apps = new PageApps(store.unit.id);
    }
    private onSearch = async (key:string) => {
        await this.apps.first(key);
    }
    private appClick = (app:UnitApp) => {
        nav.push(<Page header="App详细信息">
            <Info app={app} appActed={this.appActed}/>
        </Page>);
    }
    private appActed = (appId:number, inUnit:number) => {
        let apps = this.apps.items as IObservableArray<UnitApp>; //.replace .find(v => v.id === appId);
        let app = apps.find(v => v.id === appId);
        app.inUnit = inUnit;
        apps.replace([app]);
    }
    private renderApp(app:UnitApp):JSX.Element {
        let {name, discription, icon, inUnit} = app;
        let right;
        if (inUnit === 1)
            right = <small>已启用</small>;
        else if (inUnit === 0)
            right = <small>已停用</small>;
        return <LMR className="px-3 py-2"
            left={<Badge><Image src={icon} /></Badge>}
            right={right}>
            <div className="px-3">
                <div>{name}</div>
                <small className="text-muted">{discription}</small>
            </div>
        </LMR>;
    }
    render() {
        let items = this.apps.items;
        let center = <SearchBox onSearch={this.onSearch} 
            className="w-100 mx-1" 
            placeholder="搜索App" 
            maxLength={100} />;
        return <Page header={center}>
            <List
                items={items}
                item={{onClick:this.appClick, render:this.renderApp}}
                before="搜索App名字" />
        </Page>;
    }
}
