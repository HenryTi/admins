var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { PropGrid, Media } from 'tonva-react-form';
import { UnitSpan, IdDates, ServerSpan, UsqSpan, AppSpan } from '../tools';
import { Row } from './row';
import { appIcon, appItemIcon } from '../consts';
import { store } from '../store';
import { createIdPick } from '../createIdPick';
class Info extends React.Component {
    render() {
        let { url, type, discription, server, app, usq, unit, date_init, date_update } = this.props;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        let obj;
        if (app !== undefined)
            obj = { type: 'component', label: 'APP', component: React.createElement("div", { className: "py-2" },
                    React.createElement(AppSpan, { id: app, isLink: true })) };
        else
            obj = { type: 'component', label: 'USQ', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UsqSpan, { id: usq, isLink: true })) };
        let rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: appIcon, main: discription, discription: url }) },
            '',
            { type: 'component', label: '所有者', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true })) },
            { type: 'component', label: '服务器', component: React.createElement("div", { className: "py-2" },
                    React.createElement(ServerSpan, { id: server, isLink: true })) },
            obj,
        ];
        return React.createElement("div", null,
            React.createElement(PropGrid, { rows: rows, values: this.props }));
    }
}
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
        return React.createElement("div", { className: "px-3 py-2" }, item.discription + ' ' + item.cloud + ' ' + item.ip);
    },
};
const idPickAppProps = {
    caption: '选择APP',
    searchPlaceHolder: '搜索APP',
    candidateItems: (params, key) => __awaiter(this, void 0, void 0, function* () {
        yield store.dev.searchApp.first(key);
        return store.dev.searchApp.items;
    }),
    moreCandidates: () => __awaiter(this, void 0, void 0, function* () {
        yield store.dev.searchApp.more();
    }),
    row: (item, index) => {
        return React.createElement("div", null, item.name + ' ' + item.discription);
    },
};
const idPickApiProps = {
    caption: '选择API',
    searchPlaceHolder: '搜索API',
    candidateItems: (params, key) => __awaiter(this, void 0, void 0, function* () {
        yield store.dev.searchUsq.first(key);
        return store.dev.searchUsq.items;
    }),
    moreCandidates: () => __awaiter(this, void 0, void 0, function* () {
        yield store.dev.searchUsq.more();
    }),
    row: (item, index) => {
        return React.createElement("div", null, item.name + ' ' + item.discription);
    },
};
const serviceTypeNames = ['中心', '交换', 'APP', 'API'];
const urlField = { name: 'url', type: 'string', required: true, maxLength: 200 };
const discriptionField = { name: 'discription', type: 'string', maxLength: 100 };
const serverField = { name: 'server', type: 'id' };
const bindTypeField = { name: 'type', type: 'number' };
const bindIdField = { name: 'bindId', type: 'number' };
const authField = { name: 'auth', type: 'string', maxLength: 200 };
const urlRow = {
    label: 'URL',
    field: urlField,
};
const discriptionRow = {
    label: '描述',
    field: discriptionField,
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
                caption: item.discription + ' ' + item.ip,
            };
        },
        itemFromId: (id) => store.cacheServers.get(id),
    },
};
const servicesProps = {
    title: 'Service',
    info: Info,
    formRows: [
        urlRow,
        discriptionRow,
        serverRow,
    ],
    steps: {
        step1: {
            formRows: [
                {
                    label: '服务类型',
                    field: bindTypeField,
                    face: {
                        type: 'select',
                        list: [
                            { text: 'APP', value: 2 },
                            { text: 'API', value: 3 }
                        ]
                    }
                },
            ],
            next: (values) => {
                switch (values['type']) {
                    case 2: return 'appStep';
                    case 3: return 'apiStep';
                }
            },
            ex: '服务类型',
        },
        appStep: {
            formRows: [
                urlRow,
                discriptionRow,
                serverRow,
                {
                    label: 'APP',
                    field: bindIdField,
                    face: {
                        type: 'pick-id',
                        initCaption: '请选择APP',
                        pick: createIdPick(idPickAppProps),
                        fromPickedItem: (item) => {
                            return { id: item.id, caption: item.name + ' ' + item.discription };
                        },
                    },
                },
            ],
            next: undefined,
            ex: '绑定APP'
        },
        apiStep: {
            formRows: [
                urlRow,
                discriptionRow,
                serverRow,
                {
                    label: 'API',
                    field: bindIdField,
                    face: {
                        type: 'pick-id',
                        initCaption: '请选择API',
                        pick: createIdPick(idPickApiProps),
                        fromPickedItem: (item) => {
                            return { id: item.id, caption: item.name + ' ' + item.discription };
                        },
                    },
                },
                { label: 'Auth', field: authField },
            ],
            next: undefined,
            ex: '绑定API',
        },
    },
    stepHeader: (step, num) => {
        return React.createElement("div", { className: "d-flex justify-content-center align-items-center" },
            React.createElement("h4", null,
                React.createElement("small", { className: "text-muted" },
                    "\u7B2C",
                    num,
                    "\u6B65"),
                " ",
                step.ex));
    },
    row: (item) => {
        return React.createElement(Row, { icon: appItemIcon, main: item.url, vice: serviceTypeNames[item.type] + ': ' + item.discription });
    },
    items: () => store.dev.services,
    repeated: {
        name: 'url',
        err: 'url重复',
    }
};
export default servicesProps;
//# sourceMappingURL=services.js.map