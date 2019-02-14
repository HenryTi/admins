export type DataType = 'id' | 'integer' | 'number' | 'string' | 'date' | 'boolean' 
    | 'object' | 'arr' | 'button' | 'submit';

export interface ItemSchema {
    name: string;
    required?: boolean;
    type: DataType;
}

export interface ObjectSchema extends ItemSchema {
    type: 'object';
}

export interface IdSchema extends ItemSchema {
    type: 'id';
}

export interface NumBaseSchema extends ItemSchema {
    type: 'integer' | 'number';
    min?: number;
    max?: number;
}

export interface IntSchema extends NumBaseSchema {
    type: 'integer';
}

export interface NumSchema extends NumBaseSchema {
    type: 'number';
}

export interface BoolSchema extends ItemSchema {
    type: 'boolean';
}

export interface StringSchema extends ItemSchema {
    type: 'string';
    maxLength?: number;
}

export interface DateSchema extends ItemSchema {
    type: 'date';
}

export interface ArrSchema extends ItemSchema {
    type: 'arr';
    arr: ItemSchema[];
    itemSchemas: {[name:string]: ItemSchema};
}

export interface ButtonSchema extends ItemSchema {
    type: 'button' | 'submit';
}

export type Schema = ItemSchema[];
