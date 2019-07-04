import * as React from 'react';
import {nav, Page} from 'tonva';

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
    //private input:HTMLInputElement;
    protected value: string;
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
        };
    }
    /*
    private ref = (input:HTMLInputElement) => {
        if (!input) return;
        input.value = this.props.value || '';
        this.input = input;
    }*/
    private onChange = (evt:React.FormEvent<HTMLInputElement>) => {
        let val = this.props.value;
        let org = val && val.trim();
        this.value = evt.currentTarget.value.trim();
        this.setState({
            disabled: org === this.value
        });
        
    }
    protected onSubmit = async () => {
        let val = this.props.value;
        let org = val && val.trim();
        let v = this.value; // this.input.value.trim();
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
    protected renderControl() {
        return <input className="form-control w-100" type="text"
            // ref={this.ref}
            defaultValue={this.props.value}
            onChange={this.onChange} />
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
            <div className="my-4 mx-3">
                {this.renderControl()}
                {errorDiv}
                <small className="d-block mt-2 text-muted">{info}</small>
            </div>
        </Page>;
    }
}

export class TextValueEdit extends StringValueEdit {
    /*
    private textArea:HTMLTextAreaElement;
    private refTextArea = (textArea:HTMLTextAreaElement) => {
        if (!textArea) return;
        textArea.value = this.props.value || '';
        this.textArea = textArea;
    }
    */
    private onTextAreaChange = (evt:React.FormEvent<HTMLTextAreaElement>) => {
        let val = this.props.value;
        let org = val && val.trim();
        this.value = evt.currentTarget.value.trim();
        this.setState({
            disabled: org === this.value
        })
    }
    protected renderControl() {
        return <textarea className="form-control w-100" rows={8}
            // ref={this.refTextArea}
            defaultValue={this.props.value}
            onChange={this.onTextAreaChange} />
    }
}
