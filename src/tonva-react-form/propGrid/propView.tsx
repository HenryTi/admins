import { PropGridProps } from './PropGrid';
import {
    PropRow, PropBorder, PropGap, 
    StringPropRow, NumberPropRow, ListPropRow, ComponentPropRow
} from './row';

export interface Format {

}

export interface PropBase {
    onClick?: () => void;
}

export interface LabeledProp extends PropBase {
    label?: string;
    bk?: string;
    vAlign?: 'top' | 'bottom' | 'center' | 'stretch';
}

export interface StringProp extends LabeledProp {
    type: 'string';
    name: string;
}

export interface NumberProp extends LabeledProp {
    type: 'number';
    name: string;
}

export interface FormatProp extends LabeledProp {
    type: 'format';
    format: Format;
}

export interface ListProp extends LabeledProp {
    type: 'list';
    list: string | any[];  // string 表示名字，否则就是值
    row: new (props: any) => React.Component;
}

export interface ComponentProp extends LabeledProp {
    type: 'component';
    full?: boolean;
    component: any; //JSX.Element;
}

export type Prop = StringProp | NumberProp | FormatProp | ListProp | ComponentProp | string;

export class PropView {
    private gridProps: PropGridProps
    private props: Prop[];
    //private values:any;
    private rows: PropRow[];

    constructor(gridProps: PropGridProps, props: Prop[]) {
        this.gridProps = gridProps;
        this.props = props;
        //this.values = values;
        this.buildRows();
    }

    private buildRows() {
        this.rows = [];
        let isGap: boolean = true;
        for (let prop of this.props) {
            if (typeof prop === 'string') {
                this.rows.push(new PropGap(prop));
                isGap = true;
            }
            else {
                if (!isGap) this.rows.push(new PropBorder());
                let row;
                switch (prop.type) {
                    default: continue;
                    case 'string': row = new StringPropRow(this.gridProps, prop); break;
                    case 'number': row = new NumberPropRow(this.gridProps, prop); break;
                    case 'list': row = new ListPropRow(this.gridProps, prop); break;
                    case 'component': row = new ComponentPropRow(this.gridProps, prop); break;
                }
                this.rows.push(row);
                isGap = false;
            }
        }
    }

    setValues(values: any) {
        for (let r of this.rows) r.setValues(values);
    }

    render() {
        return this.rows.map((row, index) => row.render(String(index)));
    }
}
