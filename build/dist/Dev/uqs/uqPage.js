var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { VPage, Page, nav } from 'tonva-tools';
import { IdDates, UnitSpan, ServerSpan } from 'tools';
import { Media, LMR, FA, PropGrid, Muted, List, EasyDate, DropdownActions } from 'tonva-react-form';
import { appIcon } from 'consts';
import { EditPage } from './editPage';
export class UQPage extends VPage {
    constructor() {
        super(...arguments);
        this.editItem = () => __awaiter(this, void 0, void 0, function* () {
            yield this.openVPage(EditPage);
            //nav.push(<EditAppPage {...this.props} />);
        });
        this.deleteItem = () => __awaiter(this, void 0, void 0, function* () {
            if (confirm('真的要删除UQ吗？') === true) {
                yield this.controller.deleteUq();
                nav.pop();
            }
        });
        this.page = () => {
            let { onUqUpload, serviceClick, uq, services } = this.controller;
            let { id, name, discription, access, unit, date_init, date_update } = uq;
            let disp = React.createElement("div", null,
                React.createElement("div", null, discription),
                React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
            let menuItems = [
                { caption: '修改UQ', action: this.editItem, icon: 'edit' },
                { caption: '删除', action: this.deleteItem, icon: 'trash-o' }
            ];
            let right = React.createElement(DropdownActions, { actions: menuItems });
            let rows = [
                '',
                {
                    type: 'component',
                    component: React.createElement(Media, { icon: appIcon, main: name, discription: disp })
                },
                {
                    type: 'component',
                    label: '开发号',
                    component: React.createElement("div", { className: "py-2" },
                        React.createElement(UnitSpan, { id: unit, isLink: true }))
                },
                '',
                {
                    type: 'component',
                    label: '编译代码',
                    component: React.createElement(LMR, { onClick: () => onUqUpload(), className: "w-100 py-2 cursor-pointer", left: "\u4E0A\u4F20\u7F16\u8BD1uq\u4EE3\u7801", right: React.createElement(FA, { className: "align-self-center", name: "chevron-right" }) })
                },
            ];
            return React.createElement(Page, { header: 'UQ - ' + name, right: right },
                React.createElement(PropGrid, { rows: rows, values: uq }),
                React.createElement("div", { className: "d-flex mx-3 mt-3 mb-1 align-items-end" },
                    React.createElement(Muted, { style: { display: 'block', flex: 1 } }, "Service"),
                    React.createElement("button", { className: "btn btn-outline-primary btn-sm", onClick: () => this.controller.showNewServicePage() }, "\u589E\u52A0")),
                React.createElement(List, { items: services, item: { render: this.renderService, onClick: serviceClick } }));
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.openPage(this.page);
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
}
//# sourceMappingURL=uqPage.js.map