import * as React from 'react';
import { observer } from 'mobx-react';
import className from 'classnames';
import { List, LMR, FA } from 'tonva-react-form';
import { Page, nav } from 'tonva-tools';
import { tv } from '../../tools';
import { Map } from '../../entities';
import { VEntity } from '../CVEntity';
import { CMap, MapItem, MapKey, MapUI } from './cMap';
import { PureJSONContent } from '../form/viewModel';

export class VMapMain extends VEntity<Map, MapUI, CMap> {
    private isFrom: boolean;

    async open(param?:any) {
        this.isFrom = this.controller.isFrom;
        this.openPage(this.view);
    }

    itemRender = (item:MapItem, index:number) => {
        return <this.ItemRow item={item} />;
    }

    private ItemRow = observer(({item}: {item:MapItem}) => {
        let {tuid, box, children, isLeaf, keyIndex, values} = item;
        let keyUI = this.controller.keyUIs[keyIndex];
        let {content:keyContent, valuesContent, none:keyNone} = keyUI;
        let add, remove;
        if (this.isFrom === false) {
            add = <button className="btn btn-link btn-sm" onClick={()=>this.controller.addClick(item)}>
                <FA name="plus" />
            </button>;
            remove = <button className="btn btn-link btn-sm" onClick={()=>this.controller.removeClick(item)}>
                <FA className="text-info" name="trash" />
            </button>;
        }
        let right;
        if (isLeaf === false) {
            if (keyIndex === 0)
                right = add;
            else
                right = <>{remove} &nbsp; {add}</>;
        }
        else if (keyIndex > 0) {
            right = remove;
        }
        let content, border, valuesView;
        if (isLeaf === true) {
            content = undefined; //<div className="ml-5">leaf</div>;
            if (values) {
                //valuesView = null; // 现在不显示values content了
                valuesView = (valuesContent || PureJSONContent)(values, this.x);
            }
        }
        else {
            border = "border-bottom";
            let none = keyNone && keyNone(this.x);
            content = <List 
                className="ml-4" 
                items={children} 
                item={{onClick:undefined, render:this.itemRender}}
                none={none} />
        }
        return <div className="d-flex flex-column">
            <LMR className={className('px-3', 'py-2', border)} 
                right={right}
            >
                <div className="py-1">{tv(box, keyContent, this.x)}</div>
                <div className="py-1 font-weight-bold">{valuesView}</div>
            </LMR>
            {content}
        </div>;
    });

    protected get view() { return () => <Page header={this.label}>
            <List items={this.controller.items} item={{className:'my-2', onClick:undefined, render:this.itemRender}} />
        </Page>
    };
}
