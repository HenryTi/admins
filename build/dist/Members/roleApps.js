var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { List, LMR } from 'tonva';
import { Page } from 'tonva';
import { store } from '../store';
import { mainApi } from '../api';
export class RoleApps extends React.Component {
    constructor(props) {
        super(props);
        this.state = { apps: undefined };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield mainApi.unitRoleApps(store.unit.id, this.props.role.id);
            this.setState({
                apps: ret,
            });
        });
    }
    renderRoleApp(app, index) {
        return React.createElement(LMR, { className: "py-2 px-3 align-items-center", left: app.name, right: React.createElement("small", { className: "text-muted" }, app.discription) });
    }
    render() {
        let { role } = this.props;
        return React.createElement(Page, { header: role.name + ' - 可用APP' },
            React.createElement(List, { items: this.state.apps, item: { render: this.renderRoleApp }, none: "\u6CA1\u6709APP" }));
    }
}
//# sourceMappingURL=roleApps.js.map