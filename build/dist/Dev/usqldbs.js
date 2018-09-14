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
import { Media, PropGrid, LMR, FA, List, Muted } from 'tonva-react-form';
import { nav, Page } from 'tonva-tools';
import { UnitSpan, IdDates, ApiSpan } from '../tools';
import { Row } from './row';
import { appIcon, appItemIcon } from '../consts';
import { store } from '../store';
import { UsqlUpload } from './usqlUpload';
import { observer } from 'mobx-react';
class Info extends React.Component {
    onUsql() {
        nav.push(React.createElement(UsqlUpload, Object.assign({}, this.props)));
    }
    render() {
        let { dbname, discription, usq, cloud, connection, unit, date_init, date_update } = this.props;
        //api = 55;
        let disp = React.createElement("div", null,
            React.createElement("div", null, discription),
            React.createElement(IdDates, { date_update: date_update, date_init: date_init }));
        let rows = [
            '',
            { type: 'component', component: React.createElement(Media, { icon: appIcon, main: dbname, discription: discription }) },
            '',
            { type: 'component', label: '所有者', component: React.createElement("div", { className: "py-2" },
                    React.createElement(UnitSpan, { id: unit, isLink: true })) },
            { type: 'component', label: 'API', component: React.createElement("div", { className: "py-2" },
                    React.createElement(ApiSpan, { id: usq, isLink: true })) },
            { type: 'string', label: '云服务', name: 'cloud' },
            { type: 'component', label: 'usql代码', component: React.createElement(LMR, { onClick: () => this.onUsql(), className: "w-100 py-2 cursor-pointer", left: "\u4E0A\u4F20\u7F16\u8BD1usql\u4EE3\u7801", right: React.createElement(FA, { className: "align-self-center", name: "chevron-right" }) })
            },
        ];
        return React.createElement("div", null,
            React.createElement(PropGrid, { rows: rows, values: this.props }));
    }
}
const usqldbsProps = {
    title: 'UsqlDB',
    info: Info,
    formRows: [
        {
            label: '数据库名',
            field: { name: 'dbname', type: 'string', maxLength: 50, required: true },
        },
        {
            label: '描述',
            field: { name: 'discription', type: 'string', maxLength: 50, required: true },
        },
        {
            label: '云服务商',
            field: { name: 'cloud', type: 'string', maxLength: 20, required: true },
        },
        {
            label: 'API',
            field: { name: 'api', type: 'number', required: true },
            face: {
                type: 'pick',
                content: ({ id }) => React.createElement(ApiSpan, { id: id, isLink: false }),
                fromPicked: (item) => { return { id: item.id, caption: 'API' }; },
                pick: (face, formProps, formValues) => __awaiter(this, void 0, void 0, function* () {
                    return new Promise((resolve, reject) => {
                        nav.push(React.createElement(SearchApis, { resolve: resolve }));
                        /*
                            <button onClick={()=>{
                                resolve({id:18});
                                nav.pop();
                            }}>完成</button>
                        </Page>);*/
                    });
                })
            }
        },
        {
            label: 'Connection',
            field: { name: 'connection', type: 'string', maxLength: 200 },
            face: { type: 'textarea', rows: 6 }
        },
    ],
    row: (item) => {
        let { dbname, discription, cloud } = item;
        return React.createElement(Row, { icon: appItemIcon, main: discription, vice: React.createElement(React.Fragment, null, dbname + '@' + cloud) });
    },
    items: () => store.dev.usqldbs,
    repeated: {
        name: 'discription',
        err: '重复的描述',
    }
};
export default usqldbsProps;
let SearchApis = class SearchApis extends React.Component {
    constructor() {
        super(...arguments);
        /*
        onSearch = async (key:string) => {
            await store.dev.apis.items.apps.searchApi(key);
        }
        onBind(api: DevModel.Api, bind: boolean) {
            store.dev.apps.appBindApi([{id:api.id, access:['*']}]);
        }
        */
        this.row = (api) => {
            let { name, discription } = api;
            return React.createElement("div", { className: "d-flex justify-content-start py-2 px-3" },
                React.createElement("div", { className: "align-self-center" },
                    name,
                    " ",
                    React.createElement(Muted, null, discription && ' -  ' + discription)));
        };
        this.onSelect = (api) => {
            nav.pop();
            this.props.resolve(api);
        };
    }
    componentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.dev.usqs.load();
        });
    }
    render() {
        /*
        let header = <SearchBox className="w-100 mx-1"
            onSearch={this.onSearch}
            placeholder="搜索API名字"
            maxLength={100} />;*/
        return React.createElement(Page, { back: "close", header: "\u9009\u62E9API" },
            React.createElement(List, { items: store.dev.usqs.items, item: { render: this.row, onClick: this.onSelect }, loading: null }));
    }
};
SearchApis = __decorate([
    observer
], SearchApis);
//# sourceMappingURL=usqldbs.js.map