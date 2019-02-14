import * as React from 'react';
import * as className from 'classnames';
import {observer} from 'mobx-react';

export interface MediaProps {
    icon: string|JSX.Element;
    main: string|JSX.Element;
    discription?: string | JSX.Element;
    px?: number;
    py?: number;
}

const imgStyle = {
    width: '4rem', 
    height: '4rem',
};

export class Media extends React.Component<MediaProps> {
    render() {
        let {icon, main, discription, px, py} = this.props;
        let disp;
        if (typeof discription === 'string')
            disp = <div>{discription}</div>;
        else
            disp = discription;
        let img = icon;
        if (typeof icon === 'string')
            img = <img className="d-flex mr-3" src={icon} alt="img" style={imgStyle} />;
        let cn = className(
            'media', 
            px===undefined? 'px-0':'px-'+px, 
            py===undefined? 'py-2':'py-'+py);
        return <div className={cn}>
            {img}
            <div className="media-body">
                <h5 className="mt-0">{main}</h5>
                {disp}
            </div>
        </div>
    }
}
