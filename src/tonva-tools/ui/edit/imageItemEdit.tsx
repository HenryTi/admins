import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Schema, UiSchema, ItemSchema, UiItem, UiTextItem } from '../schema';
import { ResUploader } from '../resUploader';
import { Image } from '../image';
import { nav } from '../nav';
import { Page } from '../page';
import { ItemEdit } from './itemEdit';

export class ImageItemEdit extends ItemEdit {
    protected uiItem: UiTextItem;
    private resUploader: ResUploader;
    @observable private resId:string;

    protected async internalStart():Promise<any> {
        this.resId = this.value;
        return new Promise<any>((resolve, reject) => {
            nav.push(React.createElement(this.page, {resolve:resolve, reject:reject}), ()=>reject());
        });
    }

    /*
    private onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.newValue = evt.target.value;
        let preValue = this.value;
        this.isChanged = (this.newValue != preValue);
    }
    */

    private upload = async () => {
        if (!this.resUploader) return;
        this.resId = await this.resUploader.upload();
        this.isChanged = (this.resId != this.value);
    }

    private page = observer((props:{resolve:(value:any)=>void, reject: (resean?:any)=>void}):JSX.Element => {
        let {resolve, reject} = props;
        let right = <button
            className="btn btn-sm btn-success"
            disabled={!this.isChanged}
            onClick={()=>resolve(this.resId)}>保存</button>;
        return <Page header={'更改' + this.label} right={right}>
            <div className="my-3 px-3 py-3 bg-white">
                <div>上传图片：
                    <ResUploader ref={v=>this.resUploader=v} />
                    <button className="btn btn-primary" onClick={this.upload}>上传</button>
                </div>
                <div className="small muted my-4">支持JPG、GIF、PNG格式图片，不超过2M。</div>
                <div className="d-flex">
                    <div className="mr-5" style={{border: '1px dotted gray', padding: '8px'}}>
                        <Image className="w-12c h-12c" src={this.resId} />
                    </div>
                    <div className="ml-5">
                        <div className="small">图片预览</div>
                        <Image className="w-4c h-4c mt-3" src={this.resId} />
                    </div>
                </div>
            </div>
        </Page>;
    })
}
