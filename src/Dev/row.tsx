import * as React from 'react';
import {LMR, Badge, Muted} from 'tonva';

export interface RowProps {
    icon: string;
    main: string|JSX.Element;
    vice: string|JSX.Element;
}

export class Row extends React.Component<RowProps> {
    render() {
        let {icon, main, vice} = this.props;
        return <LMR className="py-1 px-3 align-items-stretch"
            left={<Badge size="sm" className="pt-1"><img src={icon} /></Badge>}>
            <div className="px-3">
                <div><b>{main}</b></div>
                <div><Muted>{vice}</Muted></div>
            </div>
        </LMR>;
    }
}
