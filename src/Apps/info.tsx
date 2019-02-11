import * as React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {SearchBox, Media, List, LMR, Badge, Prop, PropGrid, FA} from 'tonva-react-form';
import {nav, Page, PageItems} from 'tonva-tools';
import {appIcon, appItemIcon} from '../consts';
import {IdDates, UnitSpan} from '../tools';
import {UnitApp, DevModel} from '../model';
import {store} from '../store';
import { devApi } from 'api';

@observer
export class Info extends React.Component<{app:UnitApp, appActed?:(appId:number, inUnit:number)=>void}> {
    @observable private uqAccesses: any[];
    async componentWillMount() {
        this.uqAccesses = await devApi.loadAppUqs(this.props.app.id);
    }

    private renderUqRow = (uqAccess:any, index:number):JSX.Element => {
        let {name, owner, unit, discription} = uqAccess;
        return <LMR className="py-2" right={<small className="text-muted">{discription}</small>}>
            {owner} / {name}
        </LMR>;
    }

    private act = async () => {
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
        let rows:Prop[] = [
            '',
            {
                type: 'component', 
                component: <Media icon={icon || appIcon} main={name} discription={disp} />
            },
            '',
            {
                type: 'component', 
                label: '开发号', 
                component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div>
            },
            {
                type: 'component', 
                label: '关联UQ', 
                component: <List className="w-100" items={this.uqAccesses} item={{render: this.renderUqRow}} />
            },
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
        return <div>
            <PropGrid rows={rows} values={this.props} />
        </div>
    }
}
