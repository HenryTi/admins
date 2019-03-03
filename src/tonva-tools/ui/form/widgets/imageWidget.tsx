import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
import { UiImageItem } from '../../schema';
import { Image } from '../../image';
import { ImageItemEdit } from '../../edit/imageItemEdit';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

export class ImageWidget extends Widget {
    protected input: HTMLInputElement;
    protected ui: UiImageItem;
    @observable private imageSrc: string;

    protected init() {
        super.init();
        this.imageSrc = this.value;
    }

    protected onClick = async () => {
        let edit = new ImageItemEdit(this.itemSchema, this.ui, this.ui.label, this.value);
        let ret = await edit.start();
        if (ret !== null) {
            this.setValue(ret);
            this.imageSrc = ret;
        }
        await edit.end();
    }

    render() {
        return <this.observerRender />;
    }

    private observerRender = observer(() => {
        let cn = [
            'bg-white p-1 d-flex justify-content-center',
        ];
        let onClick: any;
        if (!this.readOnly && !this.disabled) {
            cn.push('cursor-pointer');
            onClick = this.onClick;
        }
        return <div className={classNames(cn)} onClick={onClick}>
            <Image src={this.imageSrc} className="w-4c h-4c"/>
        </div>;
    });
}
