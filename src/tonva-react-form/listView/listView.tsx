import * as React from 'react';
import * as classNames from 'classnames';
import {observer} from 'mobx-react';
import {ListItem, ListRow} from './listRow';

export interface ListViewProps {
    className?: string;
    items?: any[];
    renderRow?: (item:any, index:number, ex?:any) => JSX.Element;
    ex?: any;
    header?: string|JSX.Element;
    beforeLoad?: string|JSX.Element;
    none?: string|JSX.Element;
    footer?: string|JSX.Element;
    itemClick?: (item:any)=>void;
    converter?: (item:any)=>ListItem;
}

@observer
export class ListView extends React.Component<ListViewProps, null> {
    render() {
        let {header, items, beforeLoad, none, renderRow, className, footer, itemClick, converter} = this.props;
        let cn = classNames(className, 'va-list');
        let content, elHeader;
        if (items === undefined)
            content = beforeLoad === null? null : <li className='empty'>
                {beforeLoad || '...'}
            </li>;
        else if (items.length === 0) {
            content = (
            <li className='empty'>
                {
                    none || '[none]'
                }
            </li>);
        }
        else if (renderRow !== undefined) {
            content = items.map((item, index) => renderRow(item, index, this.props.ex));
        }
        else {
            content = items.map((item, index) => {
                let onClick = item.onClick;
                if (onClick === undefined && itemClick !== undefined) 
                    onClick = ()=>itemClick(item);
                let listItem:ListItem;
                if (converter !== undefined) {
                    listItem = converter(item);
                    if (listItem === undefined) return null;
                }
                else {
                    listItem = {
                        ...item
                    }
                }
                if (listItem.key === undefined) listItem.key = listItem.main;
                return <ListRow onClick={onClick} {...listItem} />;
            });
        }
        if (header !== undefined) {
            if (typeof header === 'string') {
                elHeader = <div className='va-list-header'>{header}</div>;
            }
            else {
                elHeader = header;
            }
        }

        return (
        <div className={cn}>
            {elHeader}
            <ul>
                {content}
            </ul>
            {footer}
        </div>
        )
    }
}
