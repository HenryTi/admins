export * from './control';
export * from './buttonsControl';
export * from './stringControl';
export * from './numberControl';

import {Field} from '../field';
import {Face} from '../face';
import {Control, ControlBase} from './control';
import {ButtonsControl} from './buttonsControl';
import {CheckControl} from './checkControl';
import {RadioControl} from './radioControl';
import {TextAreaControl} from './textAreaControl';
import {SelectControl} from './selectControl';
import {UnknownControl, EmptyControl} from './unknownControl';
import {StringControl, PasswordControl} from './stringControl';
import {NumberControl} from './numberControl';

import {FormView, FormRow, GroupRow, FieldRow, LabelFormRow} from '../formView';
import { PickIdControl } from './pickIdControl';
import { PickTuidControl } from './pickTuidControl';
import { PickControl } from './pickControl';

export type CreateControl = (form:FormView, row: FormRow) => ControlBase

export const createControl:CreateControl = (form:FormView, row: LabelFormRow):ControlBase => {
    let label = row.label;
    if ((<GroupRow>row).group !== undefined)
        return createGroupControl(form, label, row as GroupRow);
    if ((<FieldRow>row).field !== undefined)
        return createFieldControl(form, label, row as FieldRow);
    return new EmptyControl(form, row.help);
}

const controls:{[type:string]: new (formView:FormView, field:Field, face:Face) => Control} = {
    "string": StringControl,
    "password": PasswordControl,
    "number": NumberControl,
    "checkbox": CheckControl,
    "radiobox": RadioControl,
    "select": SelectControl,
    "pick-id": PickIdControl,
    "pick-tuid": PickTuidControl,
    "textarea": TextAreaControl,
    "pick": PickControl,
};
const defaultFaces:{[type:string]: Face} = {
    "string": {type:'string'},
    "number": {type:'number'},
    "int": {type:'number'},
    "dec": {type:'number'},
    "bool": {type:'checkbox'},
}
function createFieldControl(form:FormView, label:string, fieldRow: FieldRow):Control {
    let {field, face} = fieldRow;
    switch (typeof field) {
        case 'string':
            field = {
                name: (field as any) as string,
                type: 'string',
            }
            break;
        case 'object':
            break;
        default:
            return new UnknownControl(form, field, face);
    }
    let fieldType = field.type || 'string';
    if (face === undefined) {
        face = defaultFaces[fieldType];
        if (face === undefined) return new UnknownControl(form, field, face);
    }
    else if (face.type === undefined) {
        let f = defaultFaces[fieldType];
        face.type = f===undefined? 'string' : f.type;
    }
    let control = controls[face.type || fieldType] || UnknownControl;
    return new control(form, field, face);
}

function createGroupControl(form:FormView, label:string, groupRow: GroupRow):Control {
    return new UnknownControl(form, groupRow as any, undefined);
}
