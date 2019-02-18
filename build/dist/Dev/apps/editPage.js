var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VPage, nav, Page } from 'tonva-tools';
import { TonvaForm } from 'tonva-react-form';
import { createIdPick } from 'createIdPick';
import { store } from 'store';
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
    {
        label: '图标',
        field: { name: 'icon', type: 'string', maxLength: 250 },
    },
    {
        label: 'URL',
        field: { name: 'url', type: 'string', maxLength: 200 },
    },
    {
        label: '服务器',
        field: { name: 'server', type: 'id' },
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
    },
    {
        label: '公开',
        field: { name: 'public', type: 'bool', defaultValue: 1 }
    },
];
export class EditBasePage extends VPage {
    constructor() {
        super(...arguments);
        this.onSubmit = (values) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller.saveApp(values);
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
            let { app } = this.controller;
            let { name } = app;
            return React.createElement(Page, { header: '修改APP - ' + name, back: "close" }, this.form(app));
        };
    }
}
export class NewPage extends EditBasePage {
    constructor() {
        super(...arguments);
        this.page = () => {
            return React.createElement(Page, { header: '新建APP', back: "close" }, this.form({}));
        };
    }
}
//# sourceMappingURL=editPage.js.map