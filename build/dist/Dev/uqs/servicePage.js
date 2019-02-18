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
import { Page, VPage, nav } from "tonva-tools";
import { PropGrid } from 'tonva-react-form';
import { StringValueEdit, ServerSpan, TextValueEdit } from 'tools';
export class ServicePage extends VPage {
    constructor() {
        super(...arguments);
        this.onUrlChanged = (value, orgValue) => __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.changeProp('url', value);
            if (ret === 0) {
                return 'URL已经被使用了';
            }
            this.service.url = value;
        });
        this.onDbChanged = (value, orgValue) => __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.changeProp('db', value);
            if (ret === 0) {
                return 'Db已经被使用了';
            }
            this.service.db = value;
        });
        this.onDbTypeChanged = (value, orgValue) => __awaiter(this, void 0, void 0, function* () {
            if (value === undefined || value === null)
                return;
            if (value.toLowerCase().trim() !== 'mysql')
                return '目前只支持mysql';
            let ret = yield this.changeProp('db_type', value);
            this.service.db_type = value;
        });
        this.onConnectionChanged = (value, orgValue) => __awaiter(this, void 0, void 0, function* () {
            yield this.changeProp('connection', value);
            this.service.connection = value;
        });
        this.onDeleteClick = () => __awaiter(this, void 0, void 0, function* () {
            if (confirm("真的要删除Service吗？删除了不可恢复，需要重新录入。") !== true)
                return;
            yield this.controller.delService(this.service);
            nav.pop();
        });
        this.page = () => {
            let { uq } = this.controller;
            let { type, name, discription, server, url, db, db_type, connection } = this.service;
            let rows = [
                '',
                /*
                {
                    type: 'component',
                    component: <div className="px-3 py-2">
                        <b>{name}</b><br/><Muted>{discription}</Muted>
                    </div>,
                },
                '',*/
                {
                    type: 'string',
                    name: 'url',
                    label: 'URL',
                    onClick: () => nav.push(React.createElement(StringValueEdit, { title: "\u4FEE\u6539URL", value: url, onChanged: this.onUrlChanged }))
                },
                {
                    type: 'component',
                    label: '服务器',
                    component: React.createElement(ServerSpan, { id: server })
                },
                {
                    type: 'string',
                    name: 'db_type',
                    label: '数据库类型',
                    onClick: () => nav.push(React.createElement(StringValueEdit, { title: "\u6570\u636E\u5E93\u7C7B\u578B", value: db_type, onChanged: this.onDbTypeChanged }))
                },
                {
                    type: 'string',
                    name: 'db',
                    label: '数据库名',
                    onClick: () => nav.push(React.createElement(StringValueEdit, { title: "\u6570\u636E\u5E93\u540D\u5B57", value: db, onChanged: this.onDbChanged }))
                },
                {
                    type: 'string',
                    name: 'connection',
                    label: '连接字符串',
                    onClick: () => nav.push(React.createElement(TextValueEdit, { title: "\u8FDE\u63A5\u5B57\u7B26\u4E32", value: connection, onChanged: this.onConnectionChanged }))
                },
            ];
            let right = React.createElement("button", { onClick: this.onDeleteClick, className: "btn btn-success" }, "\u5220\u9664");
            return React.createElement(Page, { header: 'UQ - ' + uq.name, right: right },
                React.createElement(PropGrid, { rows: rows, values: this.service }));
        };
    }
    open(service) {
        return __awaiter(this, void 0, void 0, function* () {
            this.service = service;
            this.openPage(this.page);
        });
    }
    changeProp(prop, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.controller.changeServiceProp(this.service, prop, value);
        });
    }
}
__decorate([
    observable
], ServicePage.prototype, "service", void 0);
//# sourceMappingURL=servicePage.js.map