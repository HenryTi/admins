import * as React from 'react';
import classNames from 'classnames';
import { observable } from 'mobx';

export interface SearchBoxProps {
    className?: string;
    label?: string;
    initKey?: string;
    placeholder?: string;
    buttonText?: string;
    maxLength?: number;
    size?: 'sm' | 'md' | 'lg';
    inputClassName?: string;
    onSearch: (key:string)=>Promise<void>;
    onFocus?: ()=>void;
    allowEmptySearch?: boolean;
}

/*
export interface SearchBoxState {
    disabled: boolean;
}*/

export class SearchBox extends React.Component<SearchBoxProps> { //}, SearchBoxState> {
    private input: HTMLInputElement;
    private key: string = null;
    @observable private disabled: boolean;

    private onChange = (evt: React.ChangeEvent<any>) => {
        this.key = evt.target.value;
        if (this.key !== undefined) {
            this.key = this.key.trim();
            if (this.key === '') this.key = undefined;
        }
        if (this.props.allowEmptySearch !== true) {
            this.disabled = !this.key;
        }
    }
    private onSubmit = async (evt: React.FormEvent<any>) => {
        evt.preventDefault();
        if (this.key === null) this.key = this.props.initKey || '';
        if (this.props.allowEmptySearch !== true) {
            if (!this.key) return;
            if (this.input) this.input.disabled = true;
        }
        await this.props.onSearch(this.key);
        if (this.input) this.input.disabled = false;
    }
    clear() {
        if (this.input) this.input.value = '';
    }
    render() {
        let {className, inputClassName, onFocus,
            label, placeholder, buttonText, maxLength, size} = this.props;
        let inputSize:string;
        switch (size) {
            default:
            case 'sm': inputSize = 'input-group-sm'; break;
            case 'md': inputSize = 'input-group-md'; break;
            case 'lg': inputSize = 'input-group-lg'; break;
        }
        let lab:any;
        if (label !== undefined) lab = <label className="input-group-addon">{label}</label>;
        return <form className={className} onSubmit={this.onSubmit} >
            <div className={classNames("input-group", inputSize)}>
                {lab}
                <input ref={v=>this.input=v} onChange={this.onChange}
                    type="text"
                    name="key"
                    onFocus={onFocus}
                    className={classNames('form-control', inputClassName || 'border-primary')}
                    placeholder={placeholder}
                    defaultValue={this.props.initKey}
                    maxLength={maxLength} />
                <div className="input-group-append">
                    <button className="btn btn-primary"
                        type="submit"
                        disabled={this.disabled}>
                        <i className='fa fa-search' />
                        <i className="fa"/>
                        {buttonText}
                    </button>
                </div>
            </div>
        </form>;
    }
}
