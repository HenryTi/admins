import * as React from 'react';
import { UiTextItem } from '../schema';
import { nav } from '../nav';
import { Page } from '../page';
import { observer } from 'mobx-react';
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
        this.isChanged = (this.newValue !== preValue);
    }

    private onBlur = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.verifyValue();
    }

    private onFocus = () => {
        this.error = undefined;
    }

    private page = observer((props:{resolve:(value:any)=>void, reject: (resean?:any)=>void}):JSX.Element => {
        let {resolve} = props;
        let right = <button
            className="btn btn-sm btn-success align-self-center"
            disabled={!this.isChanged}
            onClick={()=>{
                this.verifyValue();
                if (this.error === undefined) resolve(this.newValue);
            }}>保存</button>;
        return <Page header={this.label} right={right}>
            <div className="m-3">
                <input type="text" 
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    className="form-control" 
                    defaultValue={this.value} />
                {
                    this.uiItem && <div className="small muted m-2">{this.uiItem.placeholder}</div>
                }
                {this.error && <div className="text-danger">{this.error}</div>}
            </div>
        </Page>;
    })
}
