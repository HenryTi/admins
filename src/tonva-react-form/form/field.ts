import {Rule} from './rule';

export interface FieldBase {
    type: string;
    name: string;
    required?: boolean;
    rules?: Rule | Rule[];
    defaultValue?: any;
}

export interface IdField extends FieldBase {
    type: 'id';
}

export interface NumBase {
    min?: number;
    max?: number;
}

export interface NumberField extends FieldBase, NumBase {
    type: 'number';
    defaultValue?: number;
}

export interface IntField extends FieldBase, NumBase {
    type: 'int';
    defaultValue?: number;
}

export interface DecField extends FieldBase, NumBase {
    type: 'dec';
    step?: number;
    defaultValue?: number;
}

export interface StringField extends FieldBase {
    type: 'string';
    maxLength?: number;
    defaultValue?: string;
}

export interface DateField extends FieldBase {
    type: 'date';
    min?: Date;
    max?: Date;
    defaultValue?: Date;
}

export interface BoolField extends FieldBase {
    type: 'bool';
    trueValue?: any;
    falseValue?: any;
    defaultValue?: any;
}

export type Field = IdField | NumberField | IntField | DecField | StringField | DateField | BoolField;

export interface Fields {
    [name:string]: Field;
}
