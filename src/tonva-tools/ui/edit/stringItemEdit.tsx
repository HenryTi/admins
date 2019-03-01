import * as React from 'react';
import { Schema, UiSchema, ItemSchema, UiItem, UiTextItem } from '../schema';
import { nav } from '../nav';
import { Page } from '../page';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { ItemEdit } from './itemEdit';

export class StringItemEdit extends ItemEdit {
    protected uiItem: UiTextItem;
    protected async internalStart():Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let element = React.createElement(this.page, {resolve:resolve, reject:reject});
            nav.push(element,reject);
        });
    }

    private onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.newValue = evt.target.value;
        let preValue = this.value;
        this.isChanged = (this.newValue != preValue);
    }

    private page = observer((props:{resolve:(value:any)=>void, reject: (resean?:any)=>void}):JSX.Element => {
        let {resolve, reject} = props;
        let right = <button
            className="btn btn-sm btn-success"
            disabled={!this.isChanged}
            onClick={()=>resolve(this.newValue)}>保存</button>;
        return <Page header={'更改' + this.label} right={right}>
            <div className="m-3">
                <input type="text" 
                    onChange={this.onChange}
                    className="form-control" 
                    defaultValue={this.value} />
                {
                    this.uiItem && <div className="small muted m-2">{this.uiItem.placeholder}</div>
                }
            </div>
        </Page>;
    })
}
