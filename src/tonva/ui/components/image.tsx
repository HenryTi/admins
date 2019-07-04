import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export interface ImageProps {
    src: string;
    className?: string;
    style?: React.CSSProperties;
}

const defaultImage = 'http://101.200.46.56/imgs/Bear-icon.png';

export function Image(props: ImageProps) {
    /*
    @observable private src: string;
    async componentWillMount() {
        let {src} = this.props;
        if (!src) {
            this.src = defaultImage;
            return;
        }
        if (src.startsWith(':') === false) {
            this.src = src;
            return;
        }
        this.src = 'http://localhost:3015/res/' + src.substr(1);
    }
    render() {
    */
        let {className, style, src} = props;
        if (!src) {
            src = defaultImage;
        }
        else if (src.startsWith(':') === true) {
            src = 'http://localhost:3015/res/' + src.substr(1);
        }
        return <img src={src} className={className} style={style} />;
    //}
}
