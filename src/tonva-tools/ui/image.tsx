import * as React from 'react';
import classNames from 'classnames';
import { nav } from './nav';

export interface ImageProps {
    src: string;
    className?: string;
    style?: React.CSSProperties;
}

export function Image(props: ImageProps) {
    let {className, style, src} = props;
    if (!src) {
        return <div className={classNames(className, 'image-none')} style={style}>
            <i className="fa fa-camera" />
        </div>;
    }
    if (src.startsWith(':') === true) {
        src = nav.resUrl + src.substr(1);
    }
    return <img src={src} className={className} style={style} />;
}
