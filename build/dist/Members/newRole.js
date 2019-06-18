var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, Page, Form } from 'tonva-tools';
import { store } from '../store';
export class NewRole extends React.Component {
    constructor() {
        super(...arguments);
        /*
        private form:TonvaForm;
        private formRows:FormRow[] = [
            {
                label: '名称',
                field: {name: 'name', type: 'string', maxLength: 50, required: true},
            },
            {
                label: '描述',
                field: {name: 'discription', type: 'string', maxLength: 250},
                face: {type: 'textarea'}
            },
        ];*/
        this.schema = [
            { name: 'name', type: 'string', maxLength: 5, required: true },
            { name: 'discription', type: 'string', maxLength: 250 },
            { name: 'submit', type: 'button' },
        ];
        this.uiSchema = {
            items: {
                name: { widget: 'text', label: '名称' },
                discription: { widget: 'textarea', label: '描述' },
                submit: { widget: 'button', label: '提交' }
            }
        };
        this.onSubmit = (buttonName, context) => __awaiter(this, void 0, void 0, function* () {
            //let {name, discription} = values;
            let { name, discription } = this.context.formData;
            let id = yield store.unitAddRole(name, discription);
            if (id <= 0) {
                this.context.setError('name', '角色名 ' + name + ' 已经存在');
                return;
            }
            nav.pop();
            return;
        });
        /*
        <TonvaForm className="m-3" ref={tf => this.form = tf}
        formRows={this.formRows}
        onSubmit={this.onSubmit} />
        */
    }
    render() {
        return React.createElement(Page, { header: "\u65B0\u5EFA\u89D2\u8272" },
            React.createElement(Form, { className: "m-3", schema: this.schema, uiSchema: this.uiSchema, formData: {}, onButtonClick: this.onSubmit }));
    }
}
//# sourceMappingURL=newRole.js.map