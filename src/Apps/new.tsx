import * as React from 'react';
import {observer} from 'mobx-react';
import {Container, ButtonGroup,
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button, Form, FormGroup, Label, Input, 
    FormText, FormFeedback} from 'reactstrap';
import {SearchBox, Media, List, LMR, Badge, Prop, PropGrid} from 'tonva-react-form';
import {nav, Page, PagedItems} from 'tonva-tools';
import consts from '../consts';
import {IdDates, UnitSpan} from '../tools';
import {mainApi} from '../api';
import {store} from '../store';
import {App} from './model';
import {Info} from './info';

class PagedApps extends PagedItems<App> {
    private unitId:number;
    constructor(unitId:number) {
        super();
        this.unitId = unitId;
    }
    protected async load():Promise<App[]> {
        return await mainApi.searchApp(this.unitId, this.param, this.pageStart, this.pageSize);
    }
    protected setPageStart(item:App) {
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
        this.apps = new PagedApps(store.unit.id);
    }
    private onSearch(key:string) {
        this.apps.first(key);
    }
    private appClick(app:App) {
        nav.push(<Page header="App详细信息">
            <Info {...app} />
        </Page>);
    }
    private renderApp(app:App):JSX.Element {
        let {name, discription, icon} = app;
        return <LMR className="px-3 py-2"
            left={<Badge><img src={icon || consts.appIcon} /></Badge>}>
            <div>{name}</div>
            <small className="text-muted">{discription}</small>
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
