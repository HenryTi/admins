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
import { Media, PropGrid } from 'tonva-react-form';
import { UnitSpan, IdDates } from '../tools';
import { appIcon, appItemIcon } from '../consts';
import { store } from '../store';
import { Row } from './row';
let Info = class Info extends React.Component {
    /*
    private rows: Prop[];
    constructor(props:any) {
        super(props);
        let {unit, name, discription, schema, date_init, date_update} = this.props;
        let disp = <div>
            <div>{discription}</div>
            <IdDates date_update={date_update} date_init={date_init} />
        </div>;
        this.rows = [
            '',
            {type: 'component', component: <Media icon={appIcon} main={name} discription={disp} />},
            '',
            {type: 'component', label: '所有者', component: <div className="py-2"><UnitSpan id={unit} isLink={true} /></div> },
            '',
            {
                type: 'component',
                label: 'Schema',
                vAlign: 'stretch',
                component: <SchemaView />,
            },
        ];
    }*/
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            //await store.dev.buses.loadCurApis();
        });
    }
    render() {
        let { unit, name, discription, schema, date_init, date_update } = this.props;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        let rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: appIcon, main: name, discription: disp }) },
            '',
            { type: 'component', label: '所有者', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true })) },
            '',
            {
                type: 'component',
                label: 'Schema',
                vAlign: 'stretch',
                component: React.createElement(SchemaView, null),
            },
        ];
        return React.createElement("div", null,
            React.createElement(PropGrid, { rows: rows, values: this.props }));
    }
};
Info = __decorate([
    observer
], Info);
let SchemaView = class SchemaView extends React.Component {
    render() {
        let bus = store.dev.buses.cur;
        if (bus === null)
            return '...';
        let content = bus.schema;
        return React.createElement("div", { className: "d-flex py-2 w-100 align-items-center", style: { flex: 1 } },
            React.createElement("pre", null, content));
    }
};
SchemaView = __decorate([
    observer
], SchemaView);
export { SchemaView };
const busesProps = {
    title: 'BUS',
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
            label: 'Schema',
            field: { name: 'schema', type: 'string', maxLength: 2500 },
            face: { type: 'textarea', rows: 8 }
        },
    ],
    row: (item) => {
        let { owner, name, discription } = item;
        return React.createElement(Row, { icon: appItemIcon, main: owner + ' / ' + name, vice: discription });
    },
    items: () => store.dev.buses,
    repeated: {
        name: 'name',
        err: '跟已有的名称重复',
    },
    info: Info,
};
export default busesProps;
//# sourceMappingURL=buses.js.map