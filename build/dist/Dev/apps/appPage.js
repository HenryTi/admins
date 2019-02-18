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
import { IdDates, UnitSpan, ServerSpan, UnitName } from 'tools';
import { Media, PropGrid, DropdownActions, List, LMR } from 'tonva-react-form';
import { appIcon } from 'consts';
import { EditPage } from './editPage';
import { SearchUqPage } from './appUqs';
export class AppPage extends VPage {
    constructor() {
        /*
        @observable private uqs:ListProp = {
            label: '关联UQ',
            type: 'list',
            list: undefined,
            row: UqRow
        };
        */
        super(...arguments);
        this.editItem = () => __awaiter(this, void 0, void 0, function* () {
            yield this.openVPage(EditPage);
            //nav.push(<EditAppPage {...this.props} />);
        });
        this.deleteItem = () => __awaiter(this, void 0, void 0, function* () {
            if (confirm('真的要删除吗？系统删除时并不会检查相关引用，请谨慎') === true) {
                yield this.controller.deleteApp();
                nav.pop();
            }
        });
        this.page = () => {
            let { app } = this.controller;
            let { unit, name, discription, icon, server, date_init, date_update } = app;
            let disp = React.createElement("div", null,
                React.createElement("div", null, discription),
                React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
            let menuItems = [
                // {icon: 'cogs', caption:'设置关联UQ', action: ()=>nav.push(<AppUqs />)},
                { caption: '修改App', action: this.editItem, icon: 'edit' },
                { caption: '删除', action: this.deleteItem, icon: 'trash-o' }
            ];
            let right = React.createElement(DropdownActions, { actions: menuItems });
            let rows = [
                '',
                {
                    type: 'component',
                    component: React.createElement(Media, { icon: icon || appIcon, main: name, discription: disp })
                },
                '',
                {
                    type: 'component',
                    label: '开发号',
                    component: React.createElement("div", { className: "py-2" },
                        React.createElement(UnitSpan, { id: unit, isLink: true }))
                },
                /*
                {
                    type: 'component',
                    label: 'Service',
                    vAlign: 'stretch',
                    component: <ServiceRow />,
                },*/
                {
                    label: 'URL',
                    name: 'url',
                    type: 'string',
                },
                {
                    type: 'component',
                    label: '服务器',
                    component: React.createElement(ServerSpan, { id: server })
                },
                '',
            ];
            let btnAddUq = React.createElement("button", { className: "btn btn-outline-primary btn-sm", onClick: () => this.openVPage(SearchUqPage) }, "\u589E\u52A0\u5173\u8054");
            return React.createElement(Page, { header: 'App - ' + name, right: right },
                React.createElement(PropGrid, { rows: rows, values: app }),
                React.createElement(LMR, { className: "mx-3 mt-3 mb-1", right: btnAddUq }, "\u5173\u8054UQ"),
                React.createElement(List, { items: this.controller.uqAccesses, item: { render: this.renderUqRow, onClick: this.uqClick } }));
        };
        this.uqClick = (uqAccess) => {
            this.controller.onUq(uqAccess.uq);
        };
        this.renderUqRow = (uqAccess, index) => {
            let { uq, bind_access: access } = uqAccess;
            let { name, discription, unit } = uq;
            let disp;
            let elAccess;
            if (access && access.length > 0) {
                elAccess = React.createElement(React.Fragment, null,
                    " + ",
                    access.join(', '),
                    " ");
            }
            if (discription)
                disp = React.createElement("div", { className: "small text-muted" },
                    " \u00A0 ",
                    discription);
            return React.createElement(LMR, { className: "px-3 py-2 align-items-center", right: disp },
                React.createElement(UnitName, { id: unit }),
                " / ",
                name,
                " ",
                elAccess);
        };
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            //this.uqs.list = this.controller.uqs;
            this.openPage(this.page);
        });
    }
}
/*
class UqRow extends React.Component<any> {
    render() {
        let {name, discription, unit} = this.props;
        let disp: any;
        if (discription) disp = <div className="small text-muted">{discription}</div>;
        return <div className='form-control-plaintext'>
            <div><UnitName id={unit} /> / {name}</div>
            {disp}
        </div>
    }
}
*/ 
//# sourceMappingURL=appPage.js.map