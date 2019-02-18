import * as React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
//import { ArrRow } from '../arrRow';
import { RowContext, ContextContainer } from '../context';
import { Unknown } from './unknown';
import { factory } from './factory';
export const ArrComponent = observer(({ parentContext, arrSchema, children }) => {
    let { name, arr } = arrSchema;
    let data = parentContext.initData[name];
    let { form } = parentContext;
    let arrRowContexts = parentContext.getArrRowContexts(name);
    let ui = parentContext.getUiItem(name);
    let arrLabel = name;
    let Templet;
    let selectable, deletable, restorable;
    let { ArrContainer, RowContainer, RowSeperator, uiSchema } = form;
    if (uiSchema !== undefined) {
        let { selectable: formSelectable, deletable: formDeletable, restorable: formRestorable } = uiSchema;
        if (selectable !== true)
            selectable = formSelectable;
        if (deletable !== true)
            deletable = formDeletable;
        if (restorable !== true)
            restorable = formRestorable;
    }
    if (ui !== undefined) {
        let { widget: widgetType, label, selectable: arrSelectable, deletable: arrDeletable, restorable: arrRestorable, ArrContainer: ac, RowContainer: rc, RowSeperator: rs } = ui;
        if (arrSelectable !== undefined)
            selectable = arrSelectable;
        if (arrDeletable !== undefined)
            deletable = arrDeletable;
        if (arrRestorable !== undefined)
            restorable = arrRestorable;
        if (ac !== undefined)
            ArrContainer = ac;
        if (rc !== undefined)
            RowContainer = rc;
        if (rs !== undefined)
            RowSeperator = rs;
        Templet = ui.Templet;
        if (widgetType !== 'arr')
            return Unknown(arrSchema.type, widgetType, ['arr']);
        arrLabel = label || arrLabel;
    }
    let first = true;
    return ArrContainer(arrLabel, React.createElement(React.Fragment, null, data.map((row, index) => {
        let rowContext;
        let rowContent;
        let sep = undefined;
        if (first === false)
            sep = RowSeperator;
        else
            first = false;
        if (children !== undefined) {
            rowContext = new RowContext(parentContext, arrSchema, row, true);
            rowContent = React.createElement(React.Fragment, null, children);
        }
        else {
            let typeofTemplet = typeof Templet;
            if (typeofTemplet === 'function') {
                rowContext = new RowContext(parentContext, arrSchema, row, true);
                rowContent = React.createElement(observer(Templet), row);
            }
            else if (typeofTemplet === 'object') {
                rowContext = new RowContext(parentContext, arrSchema, row, true);
                rowContent = Templet;
            }
            else {
                rowContext = new RowContext(parentContext, arrSchema, row, false);
                rowContent = React.createElement(React.Fragment, null, arr.map((v, index) => {
                    return React.createElement(React.Fragment, { key: v.name }, factory(rowContext, v, undefined));
                }));
            }
        }
        let { rowKey } = rowContext;
        arrRowContexts[rowKey] = rowContext;
        let selectCheck, deleteIcon;
        if (selectable === true) {
            let onClick = (evt) => {
                let { checked } = evt.target;
                row.$isSelected = checked;
                let { $source } = row;
                if ($source !== undefined)
                    $source.$isSelected = checked;
                rowContext.removeErrors();
            };
            selectCheck = React.createElement("div", { className: "form-row-checkbox" },
                React.createElement("input", { type: "checkbox", onClick: onClick, defaultChecked: row.$isSelected }));
        }
        let isDeleted = !(row.$isDeleted === undefined || row.$isDeleted === false);
        if (deletable === true) {
            let icon = isDeleted ? 'fa-undo' : 'fa-trash';
            let onDelClick = () => {
                if (restorable === true) {
                    row.$isDeleted = !isDeleted;
                    let { $source } = row;
                    if ($source !== undefined)
                        $source.$isDeleted = !isDeleted;
                }
                else {
                    let p = data.indexOf(row);
                    if (p >= 0)
                        data.splice(p, 1);
                }
                rowContext.removeErrors();
            };
            deleteIcon = React.createElement("div", { className: "form-row-edit text-info", onClick: onDelClick },
                React.createElement("i", { className: classNames('fa', icon, 'fa-fw') }));
        }
        let editContainer = selectable === true || deletable === true ?
            (content) => React.createElement("fieldset", { disabled: isDeleted },
                React.createElement("div", { className: classNames('d-flex', { 'deleted': isDeleted, 'row-selected': row.$isSelected }) },
                    selectCheck,
                    React.createElement("div", { className: "flex-grow-1" }, content),
                    deleteIcon))
            :
                (content) => content;
        return React.createElement(ContextContainer.Provider, { key: rowKey, value: rowContext },
            sep,
            RowContainer(editContainer(React.createElement(React.Fragment, null,
                React.createElement(rowContext.renderErrors, null),
                rowContent))));
    })));
});
//# sourceMappingURL=arrComponent.js.map