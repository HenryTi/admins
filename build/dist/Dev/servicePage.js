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
import { observer } from 'mobx-react';
import { PropGrid, TonvaForm, Muted } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { ServerSpan } from '../tools';
import { store } from '../store';
import { StringValueEdit } from '../tools';
import { createIdPick } from '../createIdPick';
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
let NewService = class NewService extends React.Component {
    constructor(props) {
        super(props);
        this.formRows = [
            urlRow,
            serverRow,
        ];
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            values.type = this.props.type;
            values.bindId = this.props.id;
            let dev = store.dev;
            dev.services.cur = undefined;
            let ret = yield dev.services.saveCur(values);
            if (ret === false) {
                if (this.tonvaForm !== undefined) {
                    this.tonvaForm.formView.setError('url', '已经有Service使用这个url');
                }
                return;
            }
            nav.pop();
            return;
        });
    }
    render() {
        return React.createElement(Page, { header: "\u65B0\u5EFAService" },
            React.createElement(TonvaForm, { ref: t => this.tonvaForm = t, className: "m-3", formRows: this.formRows, onSubmit: this.onSubmit }));
    }
};
NewService = __decorate([
    observer
], NewService);
export { NewService };
let ServiceInfo = class ServiceInfo extends React.Component {
    constructor(props) {
        super(props);
        this.onUrlChanged = this.onUrlChanged.bind(this);
    }
    onUrlChanged(value, orgValue) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield store.dev.services.changeProp('url', value);
            if (ret === 0) {
                return 'URL已经被使用了';
            }
        });
    }
    onDeleteClick() {
        return __awaiter(this, void 0, void 0, function* () {
            if (confirm("真的要删除Service吗？删除了不可恢复，需要重新录入。") !== true)
                return;
            yield store.dev.services.del();
            nav.pop();
        });
    }
    render() {
        let cur = store.dev.services.cur;
        let { type, name, discription, server, url } = cur;
        let rows = [
            '',
            {
                type: 'component',
                component: React.createElement("div", { className: "px-3 py-2" },
                    React.createElement("b", null, name),
                    React.createElement("br", null),
                    React.createElement(Muted, null, discription)),
            },
            '',
            {
                type: 'string',
                name: 'url',
                label: 'URL',
                onClick: () => nav.push(React.createElement(StringValueEdit, { title: "\u4FEE\u6539URL", value: url, onChanged: this.onUrlChanged, info: "\u597D\u7684\u540D\u5B57\u4FBF\u4E8E\u7406\u89E3" }))
            },
            {
                type: 'component',
                label: '服务器',
                component: React.createElement(ServerSpan, { id: server })
            },
        ];
        let typeName;
        switch (type) {
            default:
                typeName = '';
                break;
            case 2:
                typeName = 'APP';
                break;
            case 3:
                typeName = 'API';
                break;
        }
        let right = React.createElement("button", { onClick: this.onDeleteClick, className: "btn btn-success" }, "\u5220\u9664");
        return React.createElement(Page, { header: typeName + ' Service', right: right },
            React.createElement(PropGrid, { rows: rows, values: cur }));
    }
};
ServiceInfo = __decorate([
    observer
], ServiceInfo);
export { ServiceInfo };
//# sourceMappingURL=servicePage.js.map