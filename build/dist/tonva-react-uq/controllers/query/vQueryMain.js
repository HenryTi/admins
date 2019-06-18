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
import { List, FA } from 'tonva-react-form';
import { Page } from 'tonva-tools';
import { VEntity } from '../CVEntity';
import { DefaultRow } from './defaultRow';
export class VQueryMain extends VEntity {
    constructor() {
        super(...arguments);
        this.onSubmit = () => __awaiter(this, void 0, void 0, function* () {
            let params = this.vForm.getValues();
            if (this.entity.isPaged === true) {
                yield this.entity.resetPage(30, params);
                yield this.entity.loadPage();
                this.replacePage(this.pageResult);
            }
            else {
                let data = yield this.entity.query(params);
                this.replacePage(this.queryResult, data);
            }
        });
        this.again = () => {
            this.vForm.reset();
            this.replacePage(this.view);
        };
        this.renderRow = (item, index) => React.createElement(this.row, Object.assign({}, item));
        this.view = () => React.createElement(Page, { header: this.label },
            this.vForm.render('mx-3 my-2'),
            this.renderExtra());
        this.pageResult = () => {
            let { name, list } = this.entity;
            let rightClose = React.createElement("button", { className: "btn btn-outline-success", onClick: this.again },
                React.createElement(FA, { name: "search" }),
                " \u518D\u67E5\u8BE2");
            return React.createElement(Page, { header: this.label, right: rightClose },
                React.createElement(List, { items: list, item: { render: this.renderRow } }));
        };
        this.queryResult = observer((result) => {
            let rightClose = React.createElement("button", { className: "btn btn-outline-success", onClick: this.again },
                React.createElement(FA, { name: "search" }),
                " \u518D\u67E5\u8BE2");
            return React.createElement(Page, { header: this.label, right: rightClose },
                React.createElement("pre", null, JSON.stringify(result, undefined, '\t')));
        });
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.vForm = this.createForm(this.onSubmit, param);
            let { row, queryRow } = this.ui;
            this.row = queryRow || row || DefaultRow;
            this.openPage(this.view);
        });
    }
    renderExtra() {
        return;
    }
}
//# sourceMappingURL=vQueryMain.js.map