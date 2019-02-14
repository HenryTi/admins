import {FormProps} from './formView';
import { StatelessComponent } from 'react';

export interface FieldFaceBase {
    notes?: string;
}

export interface Placeholder {
    placeholder?: string;
}

export interface StringFace extends FieldFaceBase, Placeholder {
    type: 'string';
}

export interface NumberFace extends FieldFaceBase, Placeholder {
    type: 'number';
}

export interface CheckBoxFace extends FieldFaceBase {
    type: 'checkbox';
    label?: string;
}

export type Option = string | number | {text:string, value:string | number};

export interface SelectFace extends FieldFaceBase {
    type: 'select';
    list: Option[];
    default?: string|number;  // 默认值
}

export interface RadioFace extends FieldFaceBase {
    type: 'radiobox';
    list: Option[];
}

export interface TextAreaFace extends FieldFaceBase, Placeholder {
    type: 'textarea';
    maxLength?: number;
    rows?: number;
}

//export type TuidPick = (face: TuidPickFace, formProps:FormProps, params:any) => Promise<any>;
export interface TuidInputProps {
    id: number;
    //readOnly?: boolean;
    ui: any;
    //input: any;
    //entitiesUI: any;
    //params: any;
    onFormValues?: () => any;
    //onPicked: (value:any) => void;
    onIdChanged?: (id:any) => void; // if no onIdChanged, then readOnly
}
export type TuidInputComponent = new (props:TuidInputProps) => React.Component<TuidInputProps>;

export interface TuidPickFace extends FieldFaceBase {
    type: 'pick-tuid';
    //input: TuidInputComponent;
    ui: any;
    //tuid: string;
    input: {
        component: TuidInputComponent;
    }
    //inputProps: any;
    //initCaption: string|JSX.Element;
    //pick: TuidPick;
    //fromPicked: FromPicked;
    //itemFromId?: ItemFromId;
}

export type FromPicked = (item:any)=>{id:number, caption?:string|JSX.Element};
export type ItemFromId = (id:number)=>any;
export type IdPick = (face: IdPickFace, formProps:FormProps, params:any) => Promise<any>;
export interface IdPickFace extends FieldFaceBase {
    type: 'pick-id';
    tuid: string;
    input: {
        component: TuidInputComponent;
    }
    inputProps: any;
    initCaption: string|JSX.Element;
    pick: IdPick;
    fromPicked: FromPicked;
    itemFromId?: ItemFromId;
}

export interface PickFace extends FieldFaceBase {
    type: 'pick';
    content: StatelessComponent<any>;
    pick: (face: PickFace, formProps:FormProps, params:any) => Promise<any>;
    fromPicked: (item:any)=>{id:number, caption?:string|JSX.Element};
}

export interface IdFace extends FieldFaceBase {
    type: 'id';
}

export type Face = StringFace | NumberFace | CheckBoxFace | SelectFace | RadioFace | TextAreaFace | TuidPickFace | IdPickFace | PickFace;
