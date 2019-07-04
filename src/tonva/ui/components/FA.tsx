import * as React from 'react';
import * as classNames from 'classnames';

export interface FAProps {
    name: string;
    className?: string;
    size?: 'lg'|'2x'|'3x'|'4x'|'5x';
    spin?: boolean;
    fixWidth?: boolean;
    border?: boolean;
    pull?: 'left'|'right';
    pulse?: boolean;
    rotate?: 90|180|270;
    flip?: 'horizontal'|'vertical';
    inverse?: boolean;
}

export class FA extends React.Component<FAProps> {
    render() {
        let {name, className, size, spin, fixWidth, border, pull, pulse, rotate, flip, inverse} = this.props;
        let cn = classNames(className, 'fa',
            name && ('fa-' + name),
            size && 'fa-'+size,
            fixWidth && 'fa-fw',
            border && 'fa-border',
            pull && 'fa-pull-' + pull,
            spin && 'fa-spin',
            pulse && 'fa-pulse',
            rotate && 'fa-rotate-' + rotate,
            flip && 'fa-flip-' + flip,
            inverse && 'fa-inverse',
        );
        return <i className={cn} />
    }
}

export interface StackedFAProps {
    className?: string;
    size?: 'lg',
}
export class StackedFA extends React.Component<StackedFAProps> {
    render() {
        let {className, size, children} = this.props;
        let cn = classNames(
            'fa-stack',
            className,
            size && 'fa-' + size);
        return <span className={cn}>
            {children}
        </span>;
    }
}
