var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, Page } from 'tonva';
import { List, SearchBox } from 'tonva';
export function createIdPick(props) {
    return function (face, params) {
        return new Promise((resolve, reject) => {
            nav.push(React.createElement(IdPickPage, Object.assign({ resolve: resolve, face: face, params: params }, props)));
        });
    };
}
class IdPickPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: null,
        };
        this.itemClick = this.itemClick.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            let { face, candidateItems, params } = this.props;
            this.setState({
                items: Array.isArray(candidateItems) ? candidateItems : yield candidateItems(params, ''),
            });
        });
    }
    itemClick(item) {
        let { resolve } = this.props;
        resolve(item);
        nav.pop();
    }
    onSearch(key) {
        return __awaiter(this, void 0, void 0, function* () {
            //alert('search ' + key);
            //await store.dev.searchServer.first(key)
            let { candidateItems, params } = this.props;
            if (typeof candidateItems === 'function') {
                let ret = yield candidateItems(params, key);
                this.setState({ items: ret });
            }
        });
    }
    render() {
        let { caption, row, searchPlaceHolder } = this.props;
        return React.createElement(Page, { header: caption, back: "close" },
            React.createElement("div", { className: "container" },
                React.createElement(SearchBox, { className: "my-2", onSearch: this.onSearch, placeholder: searchPlaceHolder, maxLength: 100 })),
            React.createElement(List, { items: this.state.items, item: { onClick: this.itemClick, render: row } }));
    }
}
//# sourceMappingURL=createIdPick.js.map