import * as React from 'react';
import {observer} from 'mobx-react';
import * as classNames from 'classnames';
import '../css/va-lmr.css';

export interface LMRProps {
    className?: string | string[];
    left?: string|JSX.Element;
    right?: string|JSX.Element;
    onClick?: ()=>void;
}

@observer
export class LMR extends React.Component<LMRProps> {
    render() {
        let {className, left, children, right, onClick} = this.props;
        let l, r;
        if (left !== undefined) l = <header>{left}</header>;
        if (right !== undefined) r = <footer>{right}</footer>;
        let cursor;
        if (onClick !== undefined) cursor = 'cursor-pointer';
        return <div className={classNames('va-lmr', className, cursor)} onClick={onClick}>
            {l}
            <div>{children}</div>
            {r}
        </div>;
    }
}
