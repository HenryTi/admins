var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observer } from 'mobx-react';
import className from 'classnames';
import { List, LMR, FA } from 'tonva-react-form';
import { Page } from 'tonva-tools';
import { tv } from '../../tools';
import { VEntity } from '../CVEntity';
import { PureJSONContent } from '../form/viewModel';
export class VMapMain extends VEntity {
    constructor() {
        super(...arguments);
        this.itemRender = (item, index) => {
            return React.createElement(this.ItemRow, { item: item });
        };
        this.ItemRow = observer(({ item }) => {
            let { tuid, box, children, isLeaf, keyIndex, values } = item;
            let keyUI = this.controller.keyUIs[keyIndex];
            let { content: keyContent, valuesContent, none: keyNone } = keyUI;
            let add, remove;
            if (this.isFrom === false) {
                add = React.createElement("button", { className: "btn btn-link btn-sm", onClick: () => this.controller.addClick(item) },
                    React.createElement(FA, { name: "plus" }));
                remove = React.createElement("button", { className: "btn btn-link btn-sm", onClick: () => this.controller.removeClick(item) },
                    React.createElement(FA, { className: "text-info", name: "trash" }));
            }
            let right;
            if (isLeaf === false) {
                if (keyIndex === 0)
                    right = add;
                else
                    right = React.createElement(React.Fragment, null,
                        remove,
                        " \u00A0 ",
                        add);
            }
            else if (keyIndex > 0) {
                right = remove;
            }
            let content, border, valuesView;
            if (isLeaf === true) {
                content = undefined; //<div className="ml-5">leaf</div>;
                if (values) {
                    //valuesView = null; // 现在不显示values content了
                    valuesView = (valuesContent || PureJSONContent)(values, this.x);
                }
            }
            else {
                border = "border-bottom";
                let none = keyNone && keyNone(this.x);
                content = React.createElement(List, { className: "ml-4", items: children, item: { onClick: undefined, render: this.itemRender }, none: none });
            }
            return React.createElement("div", { className: "d-flex flex-column" },
                React.createElement(LMR, { className: className('px-3', 'py-2', border), right: right },
                    React.createElement("div", { className: "py-1" }, tv(box, keyContent, this.x)),
                    React.createElement("div", { className: "py-1 font-weight-bold" }, valuesView)),
                content);
        });
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isFrom = this.controller.isFrom;
            this.openPage(this.view);
        });
    }
    get view() {
        return () => React.createElement(Page, { header: this.label },
            React.createElement(List, { items: this.controller.items, item: { className: 'my-2', onClick: undefined, render: this.itemRender } }));
    }
    ;
}
//# sourceMappingURL=vMain.js.map