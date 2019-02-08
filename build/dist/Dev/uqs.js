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
import { EasyDate, Media, PropGrid, Muted, List, LMR, Badge, FA } from 'tonva-react-form';
import { nav } from 'tonva-tools';
import { UnitSpan, IdDates, ServerSpan } from 'tools';
import { appIcon, appItemIcon } from 'consts';
import { store } from '../store';
import { NewService, ServiceInfo } from './uq-servicePage';
import { UqUpload } from './uqUpload';
let Info = class Info extends React.Component {
    constructor() {
        super(...arguments);
        this.onUq = () => __awaiter(this, void 0, void 0, function* () {
            nav.push(React.createElement(UqUpload, { uq: this.props, services: store.dev.services.items }));
        });
    }
    componentWillMount() {
        store.dev.services.items = undefined;
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.dev.services.loadUqServices(this.props.id);
        });
    }
    renderService(service, index) {
        let { url, server, db, db_type, compile_time } = service;
        let compile = !compile_time ?
            React.createElement(Muted, null, "\u672A\u7F16\u8BD1") :
            React.createElement(React.Fragment, null,
                React.createElement(Muted, null, "\u7F16\u8BD1: "),
                React.createElement(EasyDate, { date: compile_time }));
        return React.createElement(LMR, { className: "d-flex w-100 align-items-center cursor-pointer py-2 px-3", right: React.createElement("small", null, compile) },
            React.createElement("div", null,
                React.createElement("div", null, url),
                React.createElement("div", null,
                    db_type,
                    " ",
                    db),
                React.createElement(Muted, null,
                    React.createElement(ServerSpan, { id: server }))));
    }
    serviceClick(service) {
        store.dev.services.cur = service;
        nav.push(React.createElement(ServiceInfo, null));
    }
    render() {
        let { name, discription, access, unit, date_init, date_update } = this.props;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        let rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: appIcon, main: name, discription: disp }) },
            '',
            { type: 'component', label: '开发号', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true })) },
            { type: 'component', label: '入口', component: React.createElement("div", { className: "py-2" }, access ?
                    access.split(',').join(', ')
                    : React.createElement(Muted, null, "(\u5168)")) },
            {
                type: 'component',
                label: '编译代码',
                component: React.createElement(LMR, { onClick: () => this.onUq(), className: "w-100 py-2 cursor-pointer", left: "\u4E0A\u4F20\u7F16\u8BD1uq\u4EE3\u7801", right: React.createElement(FA, { className: "align-self-center", name: "chevron-right" }) })
            },
        ];
        let services = store.dev.services.items;
        return React.createElement("div", null,
            React.createElement(PropGrid, { rows: rows, values: this.props }),
            React.createElement("div", { className: "d-flex mx-3 mt-3 mb-1 align-items-end" },
                React.createElement(Muted, { style: { display: 'block', flex: 1 } }, "Service"),
                React.createElement("button", { className: "btn btn-outline-primary btn-sm", onClick: () => nav.push(React.createElement(NewService, { type: 3, id: this.props.id })) }, "\u589E\u52A0")),
            React.createElement(List, { items: services, item: { render: this.renderService, onClick: this.serviceClick } }));
    }
};
Info = __decorate([
    observer
], Info);
const uqsProps = {
    title: 'UQ',
    info: Info,
    formRows: [
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
            label: '入口',
            field: { name: 'access', type: 'string', maxLength: 250 },
            face: { type: 'textarea', placeholder: '逗号分隔的入口名' }
        },
    ],
    row: (item) => {
        let { name, discription, service_count } = item;
        let icon = appItemIcon;
        //return <Row icon={appItemIcon} main={item.name} vice={item.discription} />;
        return React.createElement(LMR, { className: "py-1 px-3 align-items-stretch", left: React.createElement(Badge, { size: "sm", className: "pt-1" },
                React.createElement("img", { src: icon })), right: React.createElement(React.Fragment, null, service_count) },
            React.createElement("div", { className: "px-3" },
                React.createElement("div", null,
                    React.createElement("b", null, name)),
                React.createElement("div", null,
                    React.createElement(Muted, null, discription))));
    },
    items: () => store.dev.uqs,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    }
};
export default uqsProps;
//# sourceMappingURL=uqs.js.map