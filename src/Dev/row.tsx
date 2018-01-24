import * as React from 'react';
import {LMR, Badge} from 'tonva-react-form';

export interface RowProps {
    icon: string;
    main: string|JSX.Element;
    vice: string|JSX.Element;
}

export class Row extends React.Component<RowProps> {
    render() {
        let {icon, main, vice} = this.props;
        return <LMR className="py-1 px-2 align-items-stretch"
            left={<Badge size="sm"><img src={icon} /></Badge>}>
            <b>{main}</b>
            <small>{vice}</small>
        </LMR>;
    }
}
