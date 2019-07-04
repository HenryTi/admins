var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import _ from 'lodash';
import { VPage, nav, Page, Form } from 'tonva';
import { store } from 'store';
import { IdPickPage, ServerSpan } from '../../tools';
import { observer } from 'mobx-react';
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
const schema = [
    { name: 'name', type: 'string', maxLength: 100, required: true },
    { name: 'caption', type: 'string', maxLength: 100 },
    { name: 'discription', type: 'string', maxLength: 250 },
    { name: 'url', type: 'string', maxLength: 200 },
    { name: 'public', type: 'boolean' },
    { name: 'server', type: 'id' },
    { name: 'icon', type: 'image' },
    { name: 'submit', type: 'submit' },
];
export class EditBasePage extends VPage {
    constructor() {
        super(...arguments);
        this.candidateItems = (params, key) => __awaiter(this, void 0, void 0, function* () {
            yield store.dev.searchServer.first(key);
            return store.dev.searchServer.items;
        });
        this.moreCandidates = () => __awaiter(this, void 0, void 0, function* () {
            yield store.dev.searchServer.more();
        });
        this.renderRow = (item, index) => {
            return React.createElement("div", { className: "px-3 py-2" },
                React.createElement(ServerCaption, Object.assign({}, item)));
        };
        this.pickServerId = (context, name, value) => {
            return new Promise((resolve, reject) => {
                nav.push(React.createElement(IdPickPage, { caption: "\u9009\u62E9\u670D\u52A1\u5668", searchPlaceHolder: "\u641C\u7D22\u670D\u52A1\u5668", candidateItems: this.candidateItems, moreCandidates: this.moreCandidates, row: this.renderRow, idFromItem: (item) => item.id, resolve: resolve, params: undefined }), () => {
                    reject();
                });
            });
        };
        this.renderServerInput = (itemId) => {
            return React.createElement(ServerSpan, { id: itemId });
        };
        this.uiSchema = {
            items: {
                name: { widget: 'text', label: '名称' },
                caption: { widget: 'text', label: '标题' },
                discription: { widget: 'textarea', label: '描述', rows: 5 },
                url: { widget: 'text', label: 'URL', placeholder: 'http(s)://APP地址' },
                'public': { widget: 'checkbox', label: '公开', },
                server: { widget: 'id', label: '服务器', pickId: this.pickServerId, Templet: this.renderServerInput },
                icon: { widget: 'image', label: '标志图' },
                submit: { widget: 'button', label: '提交', className: 'btn btn-primary' }
            }
        };
        this.onButtonClick = (name, context) => __awaiter(this, void 0, void 0, function* () {
            let { data } = context;
            let app = _.clone(this.controller.app) || {};
            _.merge(app, data);
            yield this.controller.saveApp(app);
            nav.pop();
        });
        this.form = observer(() => {
            return React.createElement(Form, { fieldLabelSize: 2, className: "m-3", schema: schema, uiSchema: this.uiSchema, formData: this.initValues, onButtonClick: this.onButtonClick });
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
        });
    }
}
export class EditPage extends EditBasePage {
    constructor() {
        super(...arguments);
        this.page = () => {
            let { app } = this.controller;
            let { name } = app;
            return React.createElement(Page, { header: '修改APP - ' + name, back: "close" },
                React.createElement(this.form, null));
        };
    }
    get initValues() { return this.controller.app; }
}
export class NewPage extends EditBasePage {
    constructor() {
        super(...arguments);
        this.page = () => {
            return React.createElement(Page, { header: '新建APP', back: "close" },
                React.createElement(this.form, null));
        };
    }
    get initValues() { return {}; }
}
//# sourceMappingURL=editPage.js.map