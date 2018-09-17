import * as React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';
import {List, LMR, FA, TonvaForm, SubmitResult, FormRow} from 'tonva-react-form';
import {nav, Page} from 'tonva-tools';
import {Role} from '../model';
import {store} from '../store';

export class NewRole extends React.Component {
    private form:TonvaForm;
    private formRows:FormRow[] = [
        {
            label: '名称', 
            field: {name: 'name', type: 'string', maxLength: 50, required: true},
        },
        {
            label: '描述',
            field: {name: 'discription', type: 'string', maxLength: 250},
            face: {type: 'textarea'}
        },
    ];
    private async onSubmit(values:any):Promise<SubmitResult> {
        let {name, discription} = values;
        let id = await store.unitAddRole(name, discription);
        if (id <= 0) {
            this.form.formView.setError('name', '角色名 ' + name + ' 已经存在');
            return;
        }
        nav.pop();
        return;
    }
    render() {
        return <Page header="新建角色">
            <TonvaForm className="m-3" ref={tf => this.form = tf} 
                formRows={this.formRows} 
                onSubmit={this.onSubmit} />
        </Page>;
    }
}
