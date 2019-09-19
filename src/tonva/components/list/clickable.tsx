import * as React from 'react';
import classNames from 'classnames';
import {ListBase} from './base';

export class Clickable extends ListBase {
    render = (item:any, index:number):JSX.Element => {
        let {className, key, onClick} = this.list.props.item;
        return <li key={key===undefined?index:key(item)} className={classNames('va-row-clickable', className)} onClick={()=>onClick && onClick(item)}>
            {this.renderContent(item, index)}
        </li>
    }
}
