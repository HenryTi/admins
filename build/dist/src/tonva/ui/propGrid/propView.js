import { PropBorder, PropGap, StringPropRow, NumberPropRow, ListPropRow, ComponentPropRow } from './row';
export class PropView {
    constructor(gridProps, props) {
        this.gridProps = gridProps;
        this.props = props;
        //this.values = values;
        this.buildRows();
    }
    buildRows() {
        this.rows = [];
        let isGap = true;
        for (let prop of this.props) {
            if (typeof prop === 'string') {
                this.rows.push(new PropGap(prop));
                isGap = true;
            }
            else {
                if (!isGap)
                    this.rows.push(new PropBorder());
                let row;
                switch (prop.type) {
                    default: continue;
                    case 'string':
                        row = new StringPropRow(this.gridProps, prop);
                        break;
                    case 'number':
                        row = new NumberPropRow(this.gridProps, prop);
                        break;
                    case 'list':
                        row = new ListPropRow(this.gridProps, prop);
                        break;
                    case 'component':
                        row = new ComponentPropRow(this.gridProps, prop);
                        break;
                }
                this.rows.push(row);
                isGap = false;
            }
        }
    }
    setValues(values) {
        for (let r of this.rows)
            r.setValues(values);
    }
    render() {
        return this.rows.map((row, index) => row.render(String(index)));
    }
}
//# sourceMappingURL=propView.js.map