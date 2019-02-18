/*
import * as React from 'react';
import * as classNames from 'classnames';
import {IObservableValue, IComputedValue} from 'mobx';
import {observer} from 'mobx-react';
import '../css/va-row.css';

export interface ListItem {
    key?: string|number;
    date?: Date;
    icon?: string | JSX.Element;
    main?: string;
    vice?: string;
    middle?: string | JSX.Element;
    midSize?: number;
    right?: string | JSX.Element;
    onClick?: () => void;
    unread?: number|IComputedValue<number>;         // <0 表示red dot
}

export interface ListRowProps extends ListItem {
    //onClick: () => void;
}

export interface ListRowState {
    pressed: boolean;
}

@observer
export class ListRow extends React.Component<ListRowProps, ListRowState> {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
        }
    }
    render() {
        let {date, main, vice, middle, midSize, icon, unread, right, onClick} = this.props;
        let header, isIcon:boolean, noteNum;
        if (unread !== undefined) {
            let uv:number;
            if (typeof unread === 'number') uv = unread;
            else uv = unread.get();
                if (uv > 0)
                noteNum = <b>{uv}</b>;
            else if (uv < 0)
                noteNum = <b className='dot' />;
        }
        switch (typeof icon) {
            case 'object':
                header = <header>{icon}{noteNum}</header>;
                isIcon= false;
                break;
            case 'string':
                header = <header className='icon'><img src={icon as string} />{noteNum}</header>;
                isIcon= true;
                break;
        }
        let mid;
        if (middle !== undefined) {
            switch (typeof middle) {
                case 'string':
                    mid = <div style={{flex:midSize}}>{middle}</div>;
                    break;
                default:
                    mid = middle;
                    break;
            }
        }
        let footer;
        if (right !== undefined) {
            if (typeof right === 'string')
                footer = <footer><small className="text-muted">{right}</small></footer>;
            else
                footer = <footer>{right}</footer>;
        }
        let viceSpan;
        if (vice !== undefined) viceSpan = <span>{vice}</span>;
        let cn = classNames('va-row', {icon:isIcon, pressed: this.state.pressed}, {"va-action": onClick !== undefined});
        return (
        <li className={cn} onClick={onClick}>
            {header}
            <div>
                <div>{main}</div>
                {viceSpan}
            </div>
            {mid}
            {footer}
        </li>
        );
    }
}
*/ 
//# sourceMappingURL=listRow.js.map