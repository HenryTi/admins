import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {FormRow, FormView, TonvaForm, Step, MultiStep, DropdownActions, 
    Action, List, FA, SubmitResult, LMR, Badge} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import consts from '../consts';
import {store} from '../store';
import { AppSpan } from '../tools/index';
import {NewApp} from './new';
import {UnitApp} from '../model';
import {Info} from './info';

@observer
export default class AppsPage extends React.Component {
    async componentDidMount() {
        await store.loadApps();
    }
    private itemRender(app:UnitApp, index:number) {
        let {name, discription, icon, inUnit} = app;
        let ban;
        if (inUnit === 0)
            ban = <FA className="text-danger" name='ban' />;
        return <LMR className="px-3 py-2"
            left={<Badge><img src={icon || consts.appIcon} /></Badge>}
            right={ban}>
            <div>{name}</div>
            <small className="text-muted">{discription}</small>
        </LMR>;
    }
    private appClick(app:UnitApp) {
        nav.push(<Page header="App详细信息">
            <Info app={app} />
        </Page>);
    }
    private newItem() {
        nav.push(<NewApp {...this.props} />);
    }
    render() {
        let right = <Button color='secondary' size='sm' onClick={()=>this.newItem()}><FA name="plus" /></Button>;
        return <Page header="App设置" right={right}>
            <List items={store.apps} item={{render: this.itemRender, onClick: this.appClick}} />
        </Page>;
    }
}
