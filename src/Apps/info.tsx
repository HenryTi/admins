import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import {observer} from 'mobx-react';
import {SearchBox, Media, List, LMR, Badge, Prop, PropGrid, FA} from 'tonva-react-form';
import {nav, Page, PageItems} from 'tonva-tools';
import {appIcon, appItemIcon} from '../consts';
import {IdDates, UnitSpan} from '../tools';
import {UnitApp} from '../model';
import {store} from '../store';

export class Info extends React.Component<{app:UnitApp, appActed?:(appId:number, inUnit:number)=>void}> {
    private rows: Prop[];
    constructor(props:any) {
        super(props);
        this.act = this.act.bind(this);
        let {unit, name, discription, icon, inUnit, date_init, date_update} = this.props.app;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        let faName:string, text:string, color:string;
        if (inUnit === 1) {
            faName = 'ban';
            text = '停用APP';
            color = 'btn-danger';
        }
        else if (inUnit === 0) {
            faName = 'refresh';
            text = '恢复APP';
            color = 'btn-success';
        }
        else {
            faName = 'plus';
            text = '启用APP';
            color = 'btn-primary';
        }
        this.rows = [
            '',
            {
                type: 'component', 
                component: <Media icon={icon || appIcon} main={name} discription={disp} />
            },
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
                component: <button className={classNames('btn', 'w-100', color)} onClick={this.act}>
                    <FA name={faName} size="lg" /> {text}
                </button>
            },
        ];
    }
    async componentDidMount() {
        //await store.dev.apps.loadCurApis();
        //this.apis.list = store.dev.apps.apis;
    }
    private async act() {
        let {app, appActed} = this.props;
        let {id, unit, inUnit} = app;
        let newInUnit:number = 1;
        if (inUnit === 0) {
            let ret = await store.restoreUnitApp(id);
            if (ret <= 0) alert('app 或者 uq 没有定义 service');
        }
        else if (inUnit === 1) {
            await store.stopUnitApp(id);
            newInUnit = 0;
        }
        else {
            let newApp:UnitApp = _.clone(app);
            newApp.id = id;
            newApp.inUnit = 1;
            let ret = await store.addUnitApp(newApp);
            if (ret <= 0) alert('app 或者 uq 没有定义 service');
        }
        if (appActed !== undefined) {
            appActed(id, newInUnit);
        }
        nav.pop();
    }
    render() {
        return <div>
            <PropGrid rows={this.rows} values={this.props} />
        </div>
    }
}
