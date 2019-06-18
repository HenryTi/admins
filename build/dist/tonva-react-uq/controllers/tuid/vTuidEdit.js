var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { FA } from 'tonva-react-form';
import { Page } from 'tonva-tools';
import { VEntity } from '../CVEntity';
export class VTuidEdit extends VEntity {
    constructor() {
        super(...arguments);
        this.next = () => __awaiter(this, void 0, void 0, function* () {
            this.vForm.reset();
            this.closePage();
        });
        this.finish = () => {
            this.closePage(2);
            this.event('edit-end');
        };
        this.onSubmit = () => __awaiter(this, void 0, void 0, function* () {
            let values = this.vForm.getValues();
            let ret = yield this.controller.entity.save(this.id, values);
            let { id } = ret;
            if (id < 0) {
                let { unique } = this.controller.entity;
                if (unique !== undefined) {
                    for (let u of unique) {
                        this.vForm.setError(u, '不能重复');
                    }
                }
                return;
            }
            if (this.controller.isCalling) {
                this.returnCall(id);
                this.closePage();
                return;
            }
            this.openPageElement(React.createElement(Page, { header: this.label + '提交成功', back: "none" },
                React.createElement("div", { className: 'm-3' },
                    React.createElement("span", { className: "text-success" },
                        React.createElement(FA, { name: 'check-circle', size: 'lg' }),
                        " \u6210\u529F\u63D0\u4EA4\uFF01"),
                    React.createElement("div", { className: 'mt-5' },
                        React.createElement("button", { className: "btn btn-primary mr-3", onClick: this.next }, "\u7EE7\u7EED\u5F55\u5165"),
                        React.createElement("button", { className: "btn btn-outline-primary", onClick: this.finish }, "\u4E0D\u7EE7\u7EED")))));
            this.event('item-changed', { id: this.id, values: values });
            return;
        });
        //protected view = TuidNewPage;
    }
    open(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.vForm = this.createForm(this.onSubmit, param);
            if (param !== undefined) {
                this.id = param.id;
            }
            this.openPage(this.editView);
        });
    }
    get editView() {
        return () => React.createElement(Page, { header: (this.id === undefined ? '新增' : '编辑') + ' - ' + this.label }, this.vForm.render('py-3'));
    }
    resetForm() {
        this.vForm.reset();
    }
}
/*
const TuidNewPage = observer(({vm}:{vm:VmTuidEdit}) => {
    let {label, id, vmForm} = vm;
    return <Page header={(id===undefined? '新增':'编辑') + ' - ' + label}>
        {vmForm.render('mx-3 my-2')}
    </Page>;
});
*/ 
//# sourceMappingURL=vTuidEdit.js.map