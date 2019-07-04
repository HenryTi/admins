import * as React from 'react';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import {Prop, PropView} from './propView';

export interface PropGridProps {
    className?: string;
    rows: Prop[];
    values: any;
    alignValue?: 'left'|'center'|'right';
    labelFixLeft?: boolean;
}

@observer
export class PropGrid extends React.Component<PropGridProps> {
    render() {
        let {className, rows, values} = this.props;
        let propView = new PropView(this.props, rows);
        propView.setValues(values);
        let cn = classNames('container-fluid', className);
        return <div className={cn}>
            {propView.render()}
        </div>;
    }
}
