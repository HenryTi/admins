import * as React from 'react';
import * as classNames from 'classnames';
export class FA extends React.Component {
    render() {
        let { name, className, size, spin, fixWidth, border, pull, pulse, rotate, flip, inverse } = this.props;
        let cn = classNames(className, 'fa', name && ('fa-' + name), size && 'fa-' + size, fixWidth && 'fa-fw', border && 'fa-border', pull && 'fa-pull-' + pull, spin && 'fa-spin', pulse && 'fa-pulse', rotate && 'fa-rotate-' + rotate, flip && 'fa-flip-' + flip, inverse && 'fa-inverse');
        return React.createElement("i", { className: cn });
    }
}
export class StackedFA extends React.Component {
    render() {
        let { className, size, children } = this.props;
        let cn = classNames('fa-stack', className, size && 'fa-' + size);
        return React.createElement("span", { className: cn }, children);
    }
}
//# sourceMappingURL=FA.js.map