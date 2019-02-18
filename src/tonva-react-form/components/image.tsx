import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export interface ImageProps {
    src: string;
    className?: string;
    style?: React.CSSProperties;
}

const defaultImage = 'http://101.200.46.56/imgs/Bear-icon.png';

@observer
export class Image extends React.Component<ImageProps> {
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
        this.src = defaultImage;
    }
    render() {
        let {className, style} = this.props;
        return <img src={this.src} className={className} style={style} />;
    }
}
