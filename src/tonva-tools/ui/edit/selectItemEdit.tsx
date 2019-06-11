import * as React from 'react';
import { Schema, UiSchema, ItemSchema, UiItem, UiTextItem, UiSelect } from '../schema';
import { nav } from '../nav';
import { Page } from '../page';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { ItemEdit } from './itemEdit';

export class SelectItemEdit extends ItemEdit {
    protected uiItem: UiSelect;
    protected async internalStart():Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let element = React.createElement(this.page, {resolve:resolve, reject:reject});
            nav.push(element,reject);
        });
    }

    private onChange = (value:any) => {
        this.newValue = value;
        let preValue = this.value;
        this.isChanged = (this.newValue != preValue);
    }

    private page = observer((props:{resolve:(value:any)=>void, reject: (resean?:any)=>void}):JSX.Element => {
        let {resolve, reject} = props;
        let {list} = this.uiItem;
        let content = list?
            list.map((v, index:number) => {
                let {title, value} = v;
                return <div key={index} className="px-3 py-2 cursor-pointer bg-white mb-1" onClick={()=>{this.onChange(value); resolve(this.newValue)}}>
                    {title || value}
                </div>;
            })
            :
            <>no list defined</>;
        return <Page header={'更改' + this.label}>
            <div className="my-3">
                {content}
            </div>
        </Page>;
    })
}
