import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {FormRow, FormView, TonvaForm, Step, MultiStep, DropdownActions, Action, List, FA, SubmitResult} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {store} from '../store';
import { AppSpan } from '../tools/index';
import {NewApp} from './new';

@observer
export default class AppsPage extends React.Component {
    async componentDidMount() {
        await store.loadApps();
    }
    private itemRender(item:{app:number, deleted:boolean}, index:number) {
        return <div>
            <AppSpan id={item.app} />
        </div>;
    }
    private newItem() {
        nav.push(<NewApp {...this.props} />);
    }
    render() {
        let right = <Button color='secondary' size='sm' onClick={()=>this.newItem()}><FA name="plus" /></Button>;
        return <Page header="App设置" right={right}>
            <List items={store.apps} item={{render: this.itemRender}} />
        </Page>;
    }
}
