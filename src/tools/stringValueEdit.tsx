import * as React from 'react';
import {nav, Page} from 'tonva-tools';

interface StringValueEditProps {
    title: string;
    onChanged:(value:any, orgValue:any)=>Promise<string|void>;
    value?: any;
    buttonText?: string;
    info?: string;
}
interface StringValueEditState {
    disabled: boolean;
    error?: string;
}

export class StringValueEdit extends React.Component<StringValueEditProps, StringValueEditState> {
    private input:HTMLInputElement;
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
        };
        this.ref = this.ref.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    private ref(input:HTMLInputElement) {
        if (!input) return;
        input.value = this.props.value || '';
        this.input = input;
    }
    private onChange(evt:React.FormEvent<HTMLInputElement>) {
        let val = this.props.value;
        let org = val && val.trim();
        let v = evt.currentTarget.value.trim();
        this.setState({
            disabled: org === v
        })
    }
    private async onSubmit() {
        let val = this.props.value;
        let org = val && val.trim();
        let v = this.input.value.trim();
        let onChanged = this.props.onChanged;
        if (onChanged !== undefined) {
            let ret = await onChanged(v, org);
            if (typeof ret === 'string') {
                this.setState({error: ret});
                return;
            }
            nav.pop();
        }
    }
    render() {
        let {title, onChanged, buttonText, info, value} = this.props;
        let {disabled, error} = this.state;
        let right = <button
            className="btn btn-success btn-sm"
            disabled={disabled}
            onClick={this.onSubmit}
        >
            {buttonText||'保存'}
        </button>;
        let errorDiv;
        if (error !== undefined) errorDiv = <div className='text-danger'>{error}</div>;
        return <Page header={title} right={right}>
            <div className="m-4">
                <input className="form-control w-100" type="text"
                    ref={this.ref}
                    onChange={this.onChange} />
                {errorDiv}
                <small className="d-block mt-2 text-muted">{info}</small>
            </div>
        </Page>;
    }
}
