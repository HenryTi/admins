import * as React from 'react';
import { nav } from './nav';

export interface ImageProps {
    src: string;
    className?: string;
    style?: React.CSSProperties;
}

export function Image(props: ImageProps) {
    let {className, style, src} = props;
    if (!src) {
        return <div className={className} style={style}>
            <div className="d-flex h-100 align-items-center justify-content-center border border-warning rounded">
                <i className="fa fa-camera text-warning" />
            </div>
        </div>;
    }
    if (src.startsWith(':') === true) {
        src = nav.resUrl + src.substr(1);
    }
    return <img src={src} className={className} style={style} />;
}
