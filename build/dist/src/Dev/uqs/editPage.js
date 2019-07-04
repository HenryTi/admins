var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VPage, nav, Page } from 'tonva';
import { TonvaForm } from 'tonva-react-form";
const formRows = [
    {
        label: '名称',
        field: { name: 'name', type: 'string', maxLength: 100, required: true },
    },
    {
        label: '描述',
        field: { name: 'discription', type: 'string', maxLength: 250 },
        face: { type: 'textarea' }
    },
];
export class EditBasePage extends VPage {
    constructor() {
        super(...arguments);
        this.onSubmit = (values) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller.saveUq(values);
            nav.pop();
            return;
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
    form(initValues) {
        return React.createElement(TonvaForm, { className: "m-3", formRows: formRows, onSubmit: this.onSubmit, initValues: initValues });
    }
}
export class EditPage extends EditBasePage {
    constructor() {
        super(...arguments);
        this.page = () => {
            let { uq } = this.controller;
            let { name } = uq;
            return React.createElement(Page, { header: '修改UQ - ' + name, back: "close" }, this.form(uq));
        };
    }
}
export class NewPage extends EditBasePage {
    constructor() {
        super(...arguments);
        this.page = () => {
            return React.createElement(Page, { header: '新建UQ', back: "close" }, this.form({}));
        };
    }
}
//# sourceMappingURL=editPage.js.map