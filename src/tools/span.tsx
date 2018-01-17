import * as React from 'react';
import * as classNames from 'classnames';

export function span(
    isLink:boolean,
    className:string, 
    onClick:(evt:React.MouseEventHandler<HTMLElement>)=>void,
    content:any): JSX.Element
{
    let tag:string;
    let props:any;
    if (isLink === true) {
        tag = 'a';
        props = {
            className: classNames(className, 'cursor-pointer'),
            onClick: onClick,
            href: '#',
        }
    }
    else {
        tag = 'span';
        props = {
            className: className,
        }
    }
    return React.createElement(tag, props, content);
}
