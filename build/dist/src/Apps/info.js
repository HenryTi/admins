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
import _ from 'lodash';
import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Media, List, LMR, PropGrid, FA } from 'tonva';
import { nav } from 'tonva';
import { IdDates, UnitSpan } from '../tools';
import { store } from '../store';
import { devApi } from 'api';
let Info = class Info extends React.Component {
    constructor() {
        super(...arguments);
        this.renderUqRow = (uqAccess, index) => {
            let { name, owner, unit, discription } = uqAccess;
            return React.createElement(LMR, { className: "py-2", right: React.createElement("small", { className: "text-muted" }, discription) },
                owner,
                " / ",
                name);
        };
        this.act = () => __awaiter(this, void 0, void 0, function* () {
            let { app, appActed } = this.props;
            let { id, unit, inUnit } = app;
            let newInUnit = 1;
            if (inUnit === 0) {
                let ret = yield store.restoreUnitApp(id);
                if (ret <= 0)
                    alert('app 或者 uq 没有定义 service');
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
                    alert('app 或者 uq 没有定义 service');
            }
            if (appActed !== undefined) {
                appActed(id, newInUnit);
            }
            nav.pop();
        });
    }
    componentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.uqAccesses = yield devApi.loadAppUqs(this.props.app.id);
        });
    }
    render() {
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
        let rows = [
            '',
            {
                type: 'component',
                component: React.createElement(Media, { icon: icon, main: name, discription: disp })
            },
            '',
            {
                type: 'component',
                label: '开发号',
                component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true }))
            },
            {
                type: 'component',
                label: '关联UQ',
                component: React.createElement(List, { className: "w-100", items: this.uqAccesses, item: { render: this.renderUqRow } })
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
        return React.createElement("div", null,
            React.createElement(PropGrid, { rows: rows, values: this.props }));
    }
};
__decorate([
    observable
], Info.prototype, "uqAccesses", void 0);
Info = __decorate([
    observer
], Info);
export { Info };
//# sourceMappingURL=info.js.map