import * as React from 'react';
import { UiIdItem } from '../schema';
import { Page } from '../page';
import { observer } from 'mobx-react';
import { ItemEdit } from './itemEdit';

export class IdItemEdit extends ItemEdit {
    protected uiItem: UiIdItem;
    protected async internalStart():Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            //let element = React.createElement(this.page, {resolve:resolve, reject:reject});
            //nav.push(element,reject);

            let {pickId} = this.uiItem;
            if (pickId === undefined) {
                alert('IdItemEdit.pickId = undefined');
                return;
            }
            let boxId = await pickId(undefined, undefined, this.value);
            //if (typeof id === 'object') {
            //    id = (id as any).id;
            //}
            this.onChange(boxId.id);
            resolve(boxId);
            //this.newValue = id;
        });
    }

    protected async internalEnd():Promise<void> {}

    private onChange = (value:any) => {
        this.newValue = value;
        let preValue = this.value;
        this.isChanged = (this.newValue !== preValue);
    }

    private page = observer((props:{resolve:(value:any)=>void, reject: (resean?:any)=>void}):JSX.Element => {
        /*
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
        */
        return <Page header={'更改' + this.label}>
            ddd
        </Page>
    })
}
