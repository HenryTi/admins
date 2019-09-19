import * as React from 'react';
import {FA} from './FA';

export interface IconTextProps {
    icon: string;
    iconClass?: string;
    text: string;
    textClass?: string;
}

export class IconText extends React.Component<IconTextProps> {
    render() {
        let {icon, iconClass, text, textClass} = this.props;
        return <div className="py-2">
            <FA className={iconClass} name={icon} fixWidth={true} />
            <span className={textClass}>{text}</span>
        </div>;
    }
}
