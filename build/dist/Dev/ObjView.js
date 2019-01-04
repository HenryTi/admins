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
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Button } from 'reactstrap';
import { nav, Page } from 'tonva-tools';
import { TonvaForm, MultiStep, DropdownActions, List, FA } from 'tonva-react-form';
let DevObjs = class DevObjs extends React.Component {
    constructor() {
        super(...arguments);
        this.itemClick = (item) => {
            this.props.items().cur = observable(item);
            nav.push(React.createElement(Info, Object.assign({}, this.props)));
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.props.items().load();
        });
    }
    //converter(item:T):ListItem {
    //    return this.props.converter(item);
    //}
    newItem() {
        this.props.items().cur = undefined;
        nav.push(React.createElement(New, Object.assign({}, this.props)));
    }
    render() {
        let { title, items } = this.props;
        let right = React.createElement(Button, { color: 'secondary', size: 'sm', onClick: () => this.newItem() },
            React.createElement(FA, { name: "plus" }));
        return React.createElement(Page, { header: title, right: right },
            React.createElement(List, { items: items().items, item: { render: this.props.row, onClick: this.itemClick } }));
    }
};
DevObjs = __decorate([
    observer
], DevObjs);
export default DevObjs;
class New extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.props.items().saveCur(values);
            if (ret === true) {
                nav.pop();
            }
            else {
                let repeated = this.props.repeated;
                //this.formView.setError(repeated.name, repeated.err);
            }
            return;
        });
    }
    render() {
        let content;
        let { title, steps, stepHeader } = this.props;
        let { formRows, items } = this.props;
        if (steps !== undefined) {
            content = React.createElement(MultiStep, { className: "mt-4", header: stepHeader, steps: steps, first: "step1", onSubmit: this.onSubmit });
        }
        else if (formRows !== undefined) {
            content = React.createElement(TonvaForm, { className: "m-3", formRows: formRows, onSubmit: this.onSubmit, initValues: items().cur });
        }
        else {
            content = "ObjViewProps: no steps and no formRows";
        }
        return React.createElement(Page, { header: '新增' + title }, content);
    }
}
let Info = class Info extends React.Component {
    constructor() {
        super(...arguments);
        this.menuItems = [
            { caption: '修改' + this.props.title, action: this.editItem.bind(this), icon: 'edit' },
            { caption: '删除', action: this.deleteItem.bind(this), icon: 'trash-o' }
        ];
    }
    deleteItem() {
        return __awaiter(this, void 0, void 0, function* () {
            if (confirm('真的要删除吗？系统删除时并不会检查相关引用，请谨慎') === true) {
                yield this.props.items().del();
                nav.pop();
            }
        });
    }
    editItem() {
        nav.push(React.createElement(Edit, Object.assign({}, this.props)));
    }
    render() {
        let actions = [];
        let ex = this.props.extraMenuActions;
        if (ex !== undefined)
            actions.push(...ex);
        actions.push(...this.menuItems);
        let right = React.createElement(DropdownActions, { actions: actions });
        let item = this.props.items().cur;
        return React.createElement(Page, { header: this.props.title + ' - 详细资料', right: right },
            React.createElement(this.props.info, Object.assign({}, item)));
    }
};
Info = __decorate([
    observer
], Info);
class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.actions = [
            { caption: '删除', action: this.deleteItem.bind(this), icon: 'trash-o' }
        ];
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentWillMount() {
    }
    onSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.props.items().saveCur(values);
            nav.pop();
            return;
        });
    }
    deleteItem() {
        return __awaiter(this, void 0, void 0, function* () {
            if (confirm('真的要删除吗？系统删除时并不会检查相关引用，请谨慎') === true) {
                yield this.props.items().del();
                nav.pop();
            }
        });
    }
    render() {
        let right = React.createElement(DropdownActions, { actions: this.actions });
        return React.createElement(Page, { header: '修改 ' + this.props.title, right: right, back: "close" },
            React.createElement(TonvaForm, { className: "m-3", formRows: this.props.formRows, onSubmit: this.onSubmit, initValues: this.props.items().cur }));
    }
}
//# sourceMappingURL=ObjView.js.map