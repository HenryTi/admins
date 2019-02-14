import * as React from 'react';
import * as classNames from 'classnames';
import {ListBase} from './base';
import { uid } from '../uid';

export class Static extends ListBase {
    render(item:any, index:number):JSX.Element {
        let {className, key, render} = this.list.props.item;
        if (typeof item === 'string') {
            let cn = classNames('va-list-gap', 'px-3', 'pt-1');
            return <li key={uid()} className={cn}>{item}</li>;
        }
        return <li key={key===undefined?index:key(item)} className={classNames(className)}>
            {this.renderContent(item, index)}
        </li>
    }
}
