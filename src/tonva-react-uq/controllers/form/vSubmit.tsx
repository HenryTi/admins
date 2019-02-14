import * as React from 'react';
import classNames from 'classnames'
import { ViewModel } from "./viewModel";
import { VForm } from './vForm';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

export class VSubmit extends ViewModel {
    private vForm: VForm;
    constructor(vForm: VForm) {
        super();
        this.vForm = vForm;
        this.caption = this.vForm.submitCaption;
        this.className = 'btn btn-primary w-25';
    }
    @observable caption: string;
    @observable className: string;

    private onClickSubmit = async () => {
        this.vForm.submit();
    }

    protected view = observer(() => {
        let {isOk} = this.vForm;
        return <button type="button" 
            onClick={this.onClickSubmit}
            className={this.className}
            disabled={isOk === false}>
            {this.caption}
        </button>;
    });
}