import { FormRow, Step } from 'tonva-form';
import { Action } from 'tonva';
import { ObjItems } from 'store/dev';
import {DevModel} from '../model';

export interface ObjViewProps<T extends DevModel.ObjBase> {
    title: string;
    row: (item:T) => JSX.Element;
    items: () => ObjItems<T>;
    repeated: {name:string; err:string};
    info: new (props:any) => React.Component;
    extraMenuActions?: Action[];
    formRows?: FormRow[];
    steps?: {[step:string]: Step};
    stepHeader?: (step:Step, num:number) => JSX.Element;
}
