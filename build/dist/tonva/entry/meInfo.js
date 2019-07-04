var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observable } from 'mobx';
import { Page, Edit, nav } from '../ui';
import { userApi } from './userApi';
export class EditMeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.schema = [
            { name: 'nick', type: 'string' },
            { name: 'icon', type: 'image' }
        ];
        this.uiSchema = {
            items: {
                nick: { widget: 'text', label: '别名', placeholder: '好的别名更方便记忆' },
                icon: { widget: 'image', label: '头像' },
            }
        };
        this.onItemChanged = (itemSchema, newValue, preValue) => __awaiter(this, void 0, void 0, function* () {
            let { name } = itemSchema;
            yield userApi.userSetProp(name, newValue);
            this.data[name] = newValue;
            nav.user[name] = newValue;
            nav.saveLocalUser();
        });
        let { nick, icon } = nav.user;
        this.data = {
            nick: nick,
            icon: icon,
        };
    }
    render() {
        return React.createElement(Page, { header: "\u4E2A\u4EBA\u4FE1\u606F" },
            React.createElement(Edit, { schema: this.schema, uiSchema: this.uiSchema, data: this.data, onItemChanged: this.onItemChanged }));
    }
}
__decorate([
    observable
], EditMeInfo.prototype, "data", void 0);
//# sourceMappingURL=meInfo.js.map