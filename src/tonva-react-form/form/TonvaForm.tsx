import * as React from 'react';
import {observer} from 'mobx-react';
import {FormView, FormProps} from './formView';

export function tonvaDebug() {
    let a = 0;
}

export interface TonvaFormProps extends FormProps {
    className?: string;
    initValues?: any;
}

@observer 
export class TonvaForm extends React.Component<TonvaFormProps, {}> {
    formView: FormView;
    constructor(props:TonvaFormProps) {
        super(props);
        this.formView = new FormView(this.props);
    }
    componentWillMount() {
        this.formView.setInitValues(this.props.initValues);
    }
    debug() {
        let s = null;
    }
    render() {
        let {className, children, initValues} = this.props;
        return <div className={className}>
            {
                children === undefined? 
                    this.formView.render() : 
                    <form onSubmit={this.formView.onSubmit}>{children}</form>
            }
        </div>;
    }
}
