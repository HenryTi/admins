import * as React from 'react';
import * as classNames from 'classnames';
import {observer} from 'mobx-react';
import {FormSchema} from './formSchema';

export interface FormProps {
    className?: string;
    formSchema: FormSchema;
}

@observer 
export class ValidForm1 extends React.Component<FormProps, {}> {
    componentDidMount() {
        this.props.formSchema.setInputValues();
    }
    render() {
        let {className, children, formSchema} = this.props;
        let content:any[];
        if (children === undefined) {
            let sep;
            content = [];
            formSchema.inputs.forEach((v, index) => {
                sep = formSchema.renderSeperator(v);
                if (sep !== null) content.push(sep);
                content.push(formSchema.renderField(v));
            });
            sep = formSchema.renderSeperator();
            if (sep !== null) content.push(sep);
            content.push(formSchema.renderButtons());
            let errors = formSchema.renderFormErrors();
            if (errors !== null) content.push(errors);
        }
        else
            content = children as any;
        return <div className={classNames('container', className)}>
            <form onSubmit={formSchema.onSubmit}>{content}</form>
        </div>;
    }
}
