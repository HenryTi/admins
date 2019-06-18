var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { createIdPick } from 'createIdPick';
import { store } from 'store';
import { TonvaForm } from 'tonva-react-form';
import { VPage, nav, Page } from 'tonva-tools';
const ServerCaption = (item) => {
    let { discription, cloud, ip } = item;
    return React.createElement(React.Fragment, null,
        discription,
        " ",
        cloud,
        " ",
        ip);
};
const idPickServerProps = {
    caption: '选择服务器',
    searchPlaceHolder: '搜索服务器',
    candidateItems: (params, key) => __awaiter(this, void 0, void 0, function* () {
        yield store.dev.searchServer.first(key);
        return store.dev.searchServer.items;
    }),
    moreCandidates: () => __awaiter(this, void 0, void 0, function* () {
        yield store.dev.searchServer.more();
    }),
    row: (item, index) => {
        return React.createElement("div", { className: "px-3 py-2" },
            React.createElement(ServerCaption, Object.assign({}, item)));
    },
};
const urlField = { name: 'url', type: 'string', required: true, maxLength: 200 };
const serverField = { name: 'server', type: 'id' };
const dbTypeField = { name: 'db_type', type: 'string', maxLength: 20, defaultValue: 'mysql' };
const dbField = { name: 'db', type: 'string', maxLength: 50, required: true };
const connectionField = { name: 'connection', type: 'string', maxLength: 250 };
const urlRow = {
    label: 'URL',
    field: urlField,
};
const serverRow = {
    label: '服务器',
    field: serverField,
    face: {
        type: 'pick-id',
        initCaption: '请选择服务器',
        pick: createIdPick(idPickServerProps),
        fromPicked: (item) => {
            return {
                id: item.id,
                caption: React.createElement(ServerCaption, Object.assign({}, item)),
            };
        },
        itemFromId: (id) => store.cacheServers.get(id),
    },
};
const dbTypeRow = {
    label: '数据库类型',
    field: dbTypeField,
    face: {
        type: 'string',
        readonly: true,
    }
};
const dbRow = {
    label: '数据库名字',
    field: dbField,
};
const connectionRow = {
    label: '连接字符串',
    field: connectionField,
    face: {
        type: 'textarea',
        maxLength: 250,
        rows: 8,
    },
};
export class NewServicePage extends VPage {
    constructor() {
        super(...arguments);
        this.formRows = [
            urlRow,
            serverRow,
            dbTypeRow,
            dbRow,
            connectionRow
        ];
        this.onSubmit = (values) => __awaiter(this, void 0, void 0, function* () {
            if (values.url.indexOf('/uq/') < 0) {
                this.tonvaForm.formView.setError('url', 'service url 必须包含/uq/');
                return;
            }
            values.type = 2; // uq type, to be removed
            values.bindId = this.controller.uq.id;
            let ret = yield this.controller.saveService(values);
            if (ret === 0) {
                if (this.tonvaForm !== undefined) {
                    this.tonvaForm.formView.setError('url', '已经有Service使用这个url');
                }
                return;
            }
            nav.pop();
            return;
        });
        this.page = () => {
            return React.createElement(Page, { header: "\u65B0\u5EFAService" },
                React.createElement(TonvaForm, { ref: t => this.tonvaForm = t, className: "m-3", formRows: this.formRows, onSubmit: this.onSubmit }));
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
//# sourceMappingURL=newServicePage.js.map