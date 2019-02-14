export type FieldUIType = 'tuid' | 'query' | 'string' | 'int' | 'dec' | 'text' | 'check' | 'select' | 'radio';
//export type FormItemType = 'arr' | 'group' | 'compute' | undefined;
/*
export interface Compute {
    [field:string]: ()=>number;
}
*/
/*
export interface FormItem {
    //type: FormItemType;
}
*/

/*
export interface FieldCompute {
    //type: 'compute';
    compute: ()=>number;
};*/
export interface FieldUI {
    //type: undefined;
    editable?: boolean;     // false则不可编辑修改，edit界面上，不可更改。readonly界面上，也不可更改。
    required?: boolean;
}
export interface FieldInputUI extends FieldUI {
}
export interface FieldStringUI extends FieldInputUI {
    length?: number;
}
export interface FieldNumberUI extends FieldInputUI {
    min?: number;
    max?: number;
}
export interface FieldTuidUI extends FieldInputUI {
    autoList?: boolean;      // 点击选择之后，自动显示待选内容
}
export interface FieldGroup /*extends FormItem*/ {
    //type: 'group';
    edits: FieldUI[];
}
export interface FormArr extends /*FormItem,*/ FormUIBase {
    //type: 'arr';
    //className?: string;
    //items: {[name:string]: FieldCompute|FieldEdit|FieldGroup};
    rowContent?: React.StatelessComponent<any>;     // arr 行的显示方式
    //layout?: string[];          // band按name排序
}
export type FormItem = FieldUI|FieldGroup|FormArr|((values:any)=>number);
export type FormItems = {[name:string]: FormItem;}
export interface FormUIBase {
    className?: string;
    items?: FormItems;
    /*
    compute?: Compute;
    fields?: {[fieldName:string]: FieldEdit};
    groups?: {[groupName:string]: FieldGroup};
    */
    //bandUIs?: BandUI[];
    layout?: string[];          // band按name排序
}

export interface FormUI extends FormUIBase {
    //arrs?: {[arr:string]: ArrUI},
    //className?: string;
    //items?: {[name:string]: FieldCompute|FieldEdit|FieldGroup|FormArr};
    //layout?: string[];          // band按name排序
}

/*
export interface BandUI {
    band: 'arr' | 'fields' | 'submit' | undefined; // undefined表示FieldUI
    label: string;
}

export interface FieldBandUI extends BandUI, FieldUI {
    band: undefined;
}

export interface FieldsBandUI extends BandUI {
    band: 'fields';
    fieldUIs: FieldUI[];            // 对应的多个field ui
}

export interface ArrUI extends FormUIBase {
    rowContent?: React.StatelessComponent<any>;     // arr 行的显示方式
}

export interface ArrBandUI extends BandUI {
    name: string;
    band: 'arr';
}

export interface SubmitBandUI extends BandUI {
    band: 'submit';                         // label显示在按钮上的文本
}

export interface FieldUI {
    name: string;                           // field name 对应
    type: FieldUIType;
    //readOnly?: boolean;
    required?: boolean;
}

export interface TuidUI extends FieldUI {
    type: 'tuid';
}
export interface TuidBandUI extends BandUI, TuidUI {
}

export interface QueryUI extends FieldUI {
    type: 'query';
    query: (param?:any) => Promise<any>;
}
export interface QueryBandUI extends BandUI, QueryUI {
}

export interface InputUI extends FieldUI {
    //placeHolder: string;
}

export interface StringUI extends InputUI {
    type: 'string';
    length?: number;
}
export interface StringBandUI extends BandUI, StringUI {
}

export interface NumberUI extends InputUI {
    min?: number;
    max?: number;
}

export interface IntUI extends NumberUI {
    type: 'int';
}
export interface IntBandUI extends BandUI, IntUI {
}

export interface DecUI extends NumberUI {
    type: 'dec';
}
export interface DecBandUI extends BandUI, DecUI {
}

export interface TextUI extends InputUI {
    type: 'text';
}
export interface TextBandUI extends BandUI, TextUI {
}

export interface CheckUI extends FieldUI {
    type: 'check';
}
export interface CheckBandUI extends BandUI, CheckUI {
}

export interface OptionItem {
    label: string;
    value: any;
}
export interface OptionsUI extends FieldUI {
    options: OptionItem[];
}
export interface SelectUI extends OptionsUI {
    type: 'select';
}
export interface SelectBandUI extends BandUI, SelectUI {
}

export interface RadioUI extends OptionsUI {
    type: 'radio';
}
export interface RadioBandUI extends BandUI, RadioUI {
}
*/