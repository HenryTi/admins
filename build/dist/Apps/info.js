var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import { Media, PropGrid, FA } from 'tonva-react-form';
import { nav } from 'tonva-tools';
import { appIcon } from '../consts';
import { IdDates, UnitSpan } from '../tools';
import { store } from '../store';
export class Info extends React.Component {
    constructor(props) {
        super(props);
        this.act = this.act.bind(this);
        let { unit, name, discription, icon, inUnit, date_init, date_update } = this.props.app;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        let faName, text, color;
        if (inUnit === 1) {
            faName = 'ban';
            text = '停用APP';
            color = 'btn-danger';
        }
        else if (inUnit === 0) {
            faName = 'refresh';
            text = '恢复APP';
            color = 'btn-success';
        }
        else {
            faName = 'plus';
            text = '启用APP';
            color = 'btn-primary';
        }
        this.rows = [
            '',
            {
                type: 'component',
                component: React.createElement(Media, { icon: icon || appIcon, main: name, discription: disp })
            },
            '',
            {
                type: 'component',
                label: '所有者',
                component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true }))
            },
            '',
            '',
            {
                type: 'component',
                bk: '',
                component: React.createElement("button", { className: classNames('btn', 'w-100', color), onClick: this.act },
                    React.createElement(FA, { name: faName, size: "lg" }),
                    " ",
                    text)
            },
        ];
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            //await store.dev.apps.loadCurApis();
            //this.apis.list = store.dev.apps.apis;
        });
    }
    act() {
        return __awaiter(this, void 0, void 0, function* () {
            let { app, appActed } = this.props;
            let { id, unit, inUnit } = app;
            let newInUnit = 1;
            if (inUnit === 0) {
                let ret = yield store.restoreUnitApp(id);
                if (ret <= 0)
                    alert('app 或者 usq 没有定义 service');
            }
            else if (inUnit === 1) {
                yield store.stopUnitApp(id);
                newInUnit = 0;
            }
            else {
                let newApp = _.clone(app);
                newApp.id = id;
                newApp.inUnit = 1;
                let ret = yield store.addUnitApp(newApp);
                if (ret <= 0)
                    alert('app 或者 usq 没有定义 service');
            }
            if (appActed !== undefined) {
                appActed(id, newInUnit);
            }
            nav.pop();
        });
    }
    render() {
        return React.createElement("div", null,
            React.createElement(PropGrid, { rows: this.rows, values: this.props }));
    }
}
//# sourceMappingURL=info.js.map