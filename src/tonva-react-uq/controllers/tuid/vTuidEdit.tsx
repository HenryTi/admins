import * as React from 'react';
import { FA } from 'tonva-react-form';
import { Page } from 'tonva-tools';
import { VForm } from '../form';
import { VEntity } from '../CVEntity';
import { CTuidMain, TuidUI } from './cTuid';
import { TuidMain, Tuid } from '../../entities';

export type TypeVTuidEdit = typeof VTuidEdit;

export class VTuidEdit extends VEntity<Tuid, TuidUI, CTuidMain> {
    private vForm: VForm;
    private id: number;

    async open(param?:any):Promise<void> {
        this.vForm = this.createForm(this.onSubmit, param);
        if (param !== undefined) {
            this.id = param.id;
        }
        this.openPage(this.editView);
    }

    protected get editView() {
        return () => <Page header={(this.id===undefined? '新增':'编辑') + ' - ' + this.label}>
            {this.vForm.render('py-3')}
        </Page>;
    }

    protected next = async () => {
        this.vForm.reset();
        this.closePage();
    }

    protected finish = () => {
        this.closePage(2);
        this.event('edit-end');
    }

    protected resetForm() {
        this.vForm.reset();
    }

    protected onSubmit = async () => {
        let values = this.vForm.getValues();
        let ret = await this.controller.entity.save(this.id, values);
        let {id} = ret;
        if (id < 0) {
            let {unique} = this.controller.entity;
            if (unique !== undefined) {
                for (let u of unique) {
                    this.vForm.setError(u, '不能重复');
                }
            }
            return;
        }
        if (this.controller.isCalling) {
            this.returnCall(id);
            this.closePage();
            return;
        }
        this.openPageElement(<Page header={this.label + '提交成功'} back="none">
            <div className='m-3'>
                <span className="text-success">
                    <FA name='check-circle' size='lg' /> 成功提交！
                </span>
                <div className='mt-5'>
                    <button className="btn btn-primary mr-3" onClick={this.next}>继续录入</button>
                    <button className="btn btn-outline-primary" onClick={this.finish}>不继续</button>
                </div>
            </div>
        </Page>);

        this.event('item-changed', {id: this.id, values: values});
        return;
    }

    //protected view = TuidNewPage;
}
/*
const TuidNewPage = observer(({vm}:{vm:VmTuidEdit}) => {
    let {label, id, vmForm} = vm;
    return <Page header={(id===undefined? '新增':'编辑') + ' - ' + label}>
        {vmForm.render('mx-3 my-2')}
    </Page>;
});
*/