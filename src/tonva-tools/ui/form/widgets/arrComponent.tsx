import * as React from 'react';
import {observer} from 'mobx-react';
import classNames from 'classnames';
//import { ArrRow } from '../arrRow';
import { Context, RowContext, ContextContainer } from '../context';
import { ArrSchema } from '../../schema';
import { UiArr, TempletType } from '../../schema';
import { Unknown } from './unknown';
import { factory } from './factory';

export const ArrComponent = observer((
    {parentContext, arrSchema, children}:{parentContext: Context, arrSchema: ArrSchema, children: React.ReactNode}) => 
{
    let {name, arr} = arrSchema;
    let data = parentContext.initData[name] as any[];
    let {form} = parentContext;
    let arrRowContexts = parentContext.getArrRowContexts(name);
    let ui = parentContext.getUiItem(name) as UiArr;
    let arrLabel = name;
    let Templet:TempletType;
    let selectable:boolean, deletable:boolean, restorable:boolean;
    let {ArrContainer, RowContainer, RowSeperator, uiSchema} = form;
    if (uiSchema !== undefined) {
        let {selectable:formSelectable, deletable:formDeletable, restorable:formRestorable} = uiSchema;
        if (selectable !== true) selectable = formSelectable;
        if (deletable !== true) deletable = formDeletable;
        if (restorable !== true) restorable = formRestorable;
    }
    if (ui !== undefined) {
        let {widget:widgetType, label, 
            selectable:arrSelectable, deletable:arrDeletable, restorable:arrRestorable,
            ArrContainer:ac, RowContainer:rc, RowSeperator:rs
        } = ui;
        if (arrSelectable !== undefined) selectable = arrSelectable;
        if (arrDeletable !== undefined) deletable = arrDeletable;
        if (arrRestorable !== undefined) restorable = arrRestorable;
        if (ac !== undefined) ArrContainer = ac;
        if (rc !== undefined) RowContainer = rc;
        if (rs !== undefined) RowSeperator = rs;
        Templet = ui.Templet;
        if (widgetType !== 'arr') return Unknown(arrSchema.type, widgetType, ['arr']);
        arrLabel = label || arrLabel;
    }
    let first = true;
    return ArrContainer(arrLabel, <>
        {data.map((row:any, index) => {
            let rowContext: RowContext;
            let rowContent: JSX.Element;
            let sep = undefined;
            if (first === false) sep = RowSeperator;
            else first = false;
            if (children !== undefined) {
                rowContext = new RowContext(parentContext, arrSchema, row, true);
                rowContent = <>{children}</>;
            }
            else {
                let typeofTemplet = typeof Templet;
                if (typeofTemplet === 'function') {
                    rowContext = new RowContext(parentContext, arrSchema, row, true);
                    rowContent = React.createElement(observer(Templet as React.StatelessComponent), row);
                }
                else if (typeofTemplet === 'object') {
                    rowContext = new RowContext(parentContext, arrSchema, row, true);
                    rowContent = Templet as JSX.Element;
                }
                else {
                    rowContext = new RowContext(parentContext, arrSchema, row, false);
                    rowContent = <>{
                        arr.map((v, index) => {
                            return <React.Fragment key={v.name}>
                                {factory(rowContext, v, undefined)}
                            </React.Fragment>
                        })}
                    </>;
                }
            }
            let {rowKey} = rowContext;
            arrRowContexts[rowKey] = rowContext;

            let selectCheck:JSX.Element, deleteIcon:JSX.Element;
            if (selectable === true) {
                let onClick = (evt: React.MouseEvent<HTMLInputElement>)=>{
                    let {checked} = (evt.target as HTMLInputElement);
                    row.$isSelected = checked;
                    let {$source} = row;
                    if ($source !== undefined) $source.$isSelected = checked;
                    rowContext.clearErrors();
                }
                selectCheck = <div className="form-row-checkbox">
                    <input type="checkbox" onClick={onClick} defaultChecked={row.$isSelected} />
                </div>;
            }
            let isDeleted = !(row.$isDeleted===undefined || row.$isDeleted===false);
            if (deletable === true) {
                let icon = isDeleted? 'fa-undo' : 'fa-trash';
                let onDelClick = () => {
                    if (restorable === true) {
                        row.$isDeleted = !isDeleted;
                        let {$source} = row;
                        if ($source !== undefined) $source.$isDeleted = !isDeleted;
                    }
                    else {
                        let p = data.indexOf(row);
                        if (p>=0) data.splice(p, 1);
                    }
                    rowContext.clearErrors();
                }
                deleteIcon = <div className="form-row-edit text-info" onClick={onDelClick}>
                    <i className={classNames('fa', icon, 'fa-fw')} />
                </div>;
            }
            let editContainer = selectable===true || deletable===true?
                (content:any) => <fieldset disabled={isDeleted}><div className={classNames('d-flex', {'deleted':isDeleted, 'row-selected':row.$isSelected})}>
                    {selectCheck}
                    <div className={selectable===true && deletable===true? "form-row-content":"form-row-content-1"}>{content}</div>
                    {deleteIcon}
                </div></fieldset>
                :
                (content:any) => content;

            return <ContextContainer.Provider key={rowKey} value={rowContext}>
                {sep}
                {RowContainer(editContainer(<><rowContext.renderErrors />{rowContent}</>))}
            </ContextContainer.Provider>;
        })}
    </>);
});
