import * as React from 'react';
import * as classNames from 'classnames';
export function span(isLink, className, onClick, content) {
    let tag;
    let props;
    if (isLink === true) {
        tag = 'a';
        props = {
            className: classNames(className, 'cursor-pointer'),
            onClick: onClick,
            href: '#',
        };
    }
    else {
        tag = 'span';
        props = {
            className: className,
        };
    }
    return React.createElement(tag, props, content);
}
//# sourceMappingURL=span.js.map