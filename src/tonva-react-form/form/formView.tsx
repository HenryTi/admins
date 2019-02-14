import * as React from 'react';
import {FormEvent} from 'react';
import {computed} from 'mobx';
import {uid} from '../uid';
import {Rule} from './rule';
import {Field} from './field';
import {Face} from './face';
import {CreateControl, ButtonsControl} from './control';
import {RowContainer, CreateRow, bootstrapCreateRow, elementCreateRow} from './rowContainer';

export interface FieldView {
    field: Field;
    face?: Face;
}

export interface LabeledRow {
    label?: string;
    createRow?: CreateRow;
    createControl?: CreateControl;
    help?: JSX.Element;
}

export interface FieldRow extends LabeledRow, FieldView {
}

export interface GroupRow extends LabeledRow {
    group: FieldView[];
}

export type LabelFormRow = FieldRow|GroupRow|LabeledRow;
export type FormRow = LabelFormRow|JSX.Element;

export interface SubmitResult {
    success: boolean;
    message?: string
    result?: any;
}

export interface FormProps {
    formRows: FormRow[];
    //context?: any;              // form context，比如，可以是EntitiesUI
    rules?: Rule | Rule[];
    onSubmit: (values:any) => Promise<SubmitResult|undefined>;
    submitButton?: string|JSX.Element;
    otherButton?: string|JSX.Element;
    onOther?: (values:any) => void;
    createRow?: CreateRow;
    createControl?: CreateControl;
    readOnly?: boolean;
}

export class FormView {
    uid:string;
    private rows: RowContainer[] = [];
    private buttonsRow: RowContainer;
    props: FormProps;
    createControl?: CreateControl;
    constructor(props:FormProps) {
        this.uid = uid();
        this.props = props;
        this.buildRows(props);
        this.createControl = props.createControl;
        this.onSubmit = this.onSubmit.bind(this);
    }

    @computed get hasError():boolean {
        let ret = this.rows.map((v, index) => index + ': ' + v.hasError + '\n');
        console.log(ret);
        return this.rows.some(row => row.hasError);
    }
    @computed get nothing():boolean {
        let ret = this.rows.every(row => !row.filled);
        return ret;
    }

    readValues():any {
        let values = {} as any;
        for (let row of this.rows) {
            row.readValues(values);
        }
        return values;
    }

    clear() {
        for (let row of this.rows) {
            row.clear();
        }
    }

    clearErrors() {
        for (let row of this.rows) {
            row.clearErrors();
        }
    }

    setError(fieldName:string, error:string) {
        for (let row of this.rows) {
            row.setError(fieldName, error);
        }
    }

    setInitValues(initValues:any) {
        if (initValues === undefined) return;
        for (let row of this.rows) {
            row.setInitValues(initValues);
        }
    }

    private buildRows(props:FormProps) {
        let {formRows, createRow} = props;
        if (formRows !== undefined) {
            for (let row of formRows) {
                this.rows.push(this.buildRow(row, createRow));
            }
            if (this.props.readOnly !== true) {
                this.buttonsRow = this.buildRow({createControl:this.createButtons.bind(this)}, undefined);
            }
        }
        else {
            this.rows.push(elementCreateRow(this, <div className="text-warning">TonvaForm need formRows defined</div>));
        }
    }

    private buildRow(formRow: FormRow, formRowCreator: CreateRow):RowContainer {
        let createRow:CreateRow;
        let type = (formRow as JSX.Element).type;
        if (type !== undefined) {
            createRow = elementCreateRow;
        }
        else {
            createRow = (formRow as (FieldRow | GroupRow | LabeledRow)).createRow;
            if (createRow === undefined) {
                createRow = formRowCreator;
                if (createRow === undefined) createRow = bootstrapCreateRow;
            }
        }
        let row = createRow(this, formRow);
        return row;
    }

    private createButtons(form:FormView, row: FormRow) {
        return new ButtonsControl(form);
    }

    private isOk():boolean {
        let isOk = true;
        for (let row of this.rows) {
            if (!row.isOk()) isOk = false;
        }
        return isOk;
    }

    render():JSX.Element {
        return <form onSubmit={this.onSubmit}>
            {this.rows.map((row,index) => row.render(this.uid + index))}
            {this.buttons()}
        </form>;
    }

    buttons():JSX.Element {
        if (this.buttonsRow === undefined) return;
        return this.buttonsRow.render(this.uid + this.rows.length);
    }
    
    async onSubmit(event:FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!this.isOk()) return;
        let values = this.readValues();
        await this.props.onSubmit(values);
    }
}
