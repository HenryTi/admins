import * as React from 'react';
import {IObservableArray} from 'mobx';
import {observer} from 'mobx-react';
import {Container, ButtonGroup,
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button, Form, FormGroup, Label, Input, 
    FormText, FormFeedback} from 'reactstrap';
import {SearchBox, Media, List, LMR, Badge, Prop, PropGrid} from 'tonva-react-form';
import {nav, Page, PagedItems} from 'tonva-tools';
import {appIcon, appItemIcon} from '../consts';
import {IdDates, UnitSpan} from '../tools';
import {mainApi} from '../api';
import {store} from '../store';
import {UnitApp} from '../model';
import {Info} from './info';

class PagedApps extends PagedItems<UnitApp> {
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
    private apps: PagedApps;
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.appClick = this.appClick.bind(this);
        this.appActed = this.appActed.bind(this);
        this.apps = new PagedApps(store.unit.id);
    }
    private async onSearch(key:string) {
        await this.apps.first(key);
    }
    private appClick(app:UnitApp) {
        nav.push(<Page header="App详细信息">
            <Info app={app} appActed={this.appActed}/>
        </Page>);
    }
    private appActed(appId:number, inUnit:number) {
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
            left={<Badge><img src={icon || appIcon} /></Badge>}
            right={right}>
            <div className="px-3">
                <div>{name}</div>
                <small className="text-muted">{discription}</small>
            </div>
        </LMR>;
    }
    render() {
        let center = <SearchBox onSearch={this.onSearch} 
            className="w-100 mx-1" 
            placeholder="搜索App" 
            maxLength={100} />;
        return <Page header={center}>
            <List
                items={this.apps.items} 
                item={{onClick:this.appClick, render:this.renderApp}}
                before="搜索App名字" />
        </Page>;
    }
}
