import * as React from 'react';
import classNames from 'classnames';
import { Image } from 'tonva-tools';

export interface MediaProps {
    icon: string;
    main: string|JSX.Element;
    discription?: string | JSX.Element;
    px?: number;
    py?: number;
}

export class Media extends React.Component<MediaProps> {
    render() {
        let {icon, main, discription, px, py} = this.props;
        let disp:any;
        if (typeof discription === 'string')
            disp = <div>{discription}</div>;
        else
            disp = discription;
        let cn = classNames(
            'media', 
            px===undefined? 'px-0':'px-'+px, 
            py===undefined? 'py-2':'py-'+py);
        return <div className={cn}>
            <Image className="mr-3 w-4c h-4c" src={icon} />
            <div className="media-body">
                <h5 className="mt-0">{main}</h5>
                {disp}
            </div>
        </div>
    }
}
