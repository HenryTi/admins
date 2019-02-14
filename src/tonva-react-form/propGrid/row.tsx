import * as React from 'react';
import {observer} from 'mobx-react';
import * as className from 'classnames';
import {ListView} from '../listView';
import {PropGridProps} from './PropGrid';
import {LabeledProp, StringProp, NumberProp, ListProp, ComponentProp} from './propView';

export abstract class PropRow {
    setValues(values: any) {}
    abstract render(key:string): any;
}

export class PropBorder extends PropRow {
    render(key:string): JSX.Element {
        return <div key={'_b_' + key} className="">
            <div className="col-sm-12">
                <div style={{borderTop: '1px solid #f0f0f0'}} />
            </div>
        </div>;
    }
}

export class PropGap extends PropRow {
    private param: string;
    constructor(param?: string) {
        super();
        this.param = param;
    }
    render(key:string): JSX.Element {
        let w: string;
        switch (this.param) {
            default: w = 'py-2'; break;
            case '=': w = 'py-1'; break;
            case '-': w = 'pb-1'; break;
        }
        let cn = className(w);
        return <div key={'_g_' + key} className={cn} style={{backgroundColor: '#f0f0f0'}} />;
    }
}

const valueAlignStart = 'justify-content-start';
const valueAlignCenter = 'justify-content-center';
const valueAlignEnd = 'justify-content-end';
export abstract class LabeledPropRow extends PropRow {
    protected gridProps: PropGridProps;
    protected prop: LabeledProp;
    protected content: any;
    //protected values: any;
    constructor(gridProps:PropGridProps, prop: LabeledProp) {
        super();
        this.gridProps = gridProps;
        this.prop = prop;
        //this.values = values;
    }
    render(key:string):any {
        let {onClick, bk} = this.prop;
        let cn = className({
            "cursor-pointer": onClick !== undefined,
            "bg-white": bk === undefined, 
            "row": true
        });
        return <div key={key} className={cn} onClick={onClick}>
            {this.renderLabel()}
            {this.renderProp()}
        </div>;
    }
    protected renderLabel():any {
        let {label} = this.prop;
        if (label === undefined) return null;
        return <label className="col-sm-2 col-form-label">
            {label}
        </label>;
    }
    protected renderProp():any {
        let {label, full} = this.prop as any;
        let align, vAlign;
        switch (this.gridProps.alignValue) {
            case 'left': align = valueAlignStart; break;
            case 'center': align = valueAlignCenter; break;
            case 'right': align = valueAlignEnd; break;
        }
        switch (this.prop.vAlign) {
            case 'top': vAlign = 'align-items-start'; break;
            default:
            case 'center': vAlign = 'align-items-center'; break;
            case 'bottom': vAlign = 'align-items-end'; break;
            case 'stretch': vAlign = 'align-items-stretch'; break;
        }
        let col:string;
        if (full !== true)
            col = label===undefined? 'col-sm-12':'col-sm-10';
        else
            col = 'w-100';
        let cn = className(align, vAlign, col, 'd-flex');
        return <div className={cn}>
            {this.renderPropBody()}
        </div>;
    }
    protected renderPropBody():any {
        return <div className="form-control-plaintext">
            {this.renderPropContent()}
        </div>;
    }
    protected renderPropContent():any {
        return this.content;
    }
}

export class StringPropRow extends LabeledPropRow {
    protected prop: StringProp;
    setValues(values:any) {
        if (values === undefined) this.content = undefined;
        else this.content = values[this.prop.name];
    }
}

export class NumberPropRow extends LabeledPropRow {
    protected prop: NumberProp;
    setValues(values:any) {
        if (values === undefined) this.content = undefined;
        else this.content = values[this.prop.name];
    }
}

export class ListPropRow extends LabeledPropRow {
    protected prop: ListProp;
    setValues(values:any) {
        if (values === undefined) this.content = undefined;
        else {
            let list = this.prop.list;
            if (typeof list === 'string') this.content = values[list];
            else this.content = undefined;
        }
    }
    protected renderPropBody() {
        let {list, row} = this.prop;
        let items:any[] = typeof list === 'string'? this.content : list;
        if (items === undefined) return <div/>;
        // new row(item)
        return <div className="w-100">
            {
                items.map((item, index) => <React.Fragment key={index}>
                    {index===0? null: <div style={{width:'100%', borderBottom:'1px solid #f0f0f0'}} />}
                    {React.createElement(row, item)}
                </React.Fragment>)
            }
        </div>;
    }
}

export class ComponentPropRow extends LabeledPropRow {
    protected prop: ComponentProp;
    protected renderPropBody() {
        let {component} = this.prop;
        return component;
    }
}

export class PropContainer extends PropRow {
    render(key:string): JSX.Element {
        return <div className="bg-white">
            <label className="col-sm-2 col-form-label">
                AAABBBCCC
            </label>
            <div className="col-sm-10">
                <div className="form-control-plaintext">
                    dsfasfa sdf asdf a
                </div>
            </div>
        </div>;
    }
}
