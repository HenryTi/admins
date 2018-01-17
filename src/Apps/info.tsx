import * as React from 'react';
import {observer} from 'mobx-react';
import {SearchBox, Media, List, LMR, Badge, Prop, PropGrid, FA} from 'tonva-react-form';
import {nav, Page, PagedItems} from 'tonva-tools';
import consts from '../consts';
import {IdDates, UnitSpan} from '../tools';
import {App} from './model';

export class Info extends React.Component<App> {
    private rows: Prop[];
    constructor(props:any) {
        super(props);
        let {unit, name, discription, icon, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={icon || consts.appIcon} main={name} discription={disp} />},
            '',
            {
                type: 'component', 
                label: '所有者', 
                component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            '',
            '',
            {
                type: 'component', 
                bk: '', 
                component: <button className="btn btn-primary w-100" onClick={this.act}>
                    <FA name="plus" size="lg" /> 添加APP
                </button>
            },
        ];
    }
    async componentDidMount() {
        //await store.dev.apps.loadCurApis();
        //this.apis.list = store.dev.apps.apis;
    }
    private act() {

    }
    render() {
        return <div>
            <PropGrid rows={this.rows} values={this.props} />
        </div>
    }
}
