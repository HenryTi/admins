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
import classNames from 'classnames';
class Tab {
    get content() {
        if (this.selected !== true)
            return this._content;
        if (this._content !== undefined)
            return this._content;
        return this._content = this.contentBuilder();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._content !== undefined)
                return;
            if (this.load === undefined)
                return;
            yield this.load();
        });
    }
}
__decorate([
    observable
], Tab.prototype, "selected", void 0);
export const TabCaptionComponent = (label, icon, color) => React.createElement("div", { className: 'd-flex justify-content-center align-items-center flex-column cursor-pointer ' + color },
    React.createElement("div", null,
        React.createElement("i", { className: 'fa fa-lg fa-' + icon })),
    React.createElement("small", null, label));
let Tabs = class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.tabs = [];
        this.tabClick = (tab) => __awaiter(this, void 0, void 0, function* () {
            yield tab.start();
            this.selectedTab.selected = false;
            tab.selected = true;
            this.selectedTab = tab;
        });
        let { size, tabs, tabBack, contentBack, sep, selected } = this.props;
        this.size = size || 'md';
        this.tabs.push(...tabs.map(v => {
            let tab = new Tab();
            tab.name = v.name;
            tab.selected = false;
            tab.caption = v.caption;
            tab.contentBuilder = v.content;
            tab.notify = v.notify;
            tab.load = v.load;
            return tab;
        }));
        this.tabBack = tabBack || 'bg-light';
        this.contentBack = contentBack;
        this.sep = sep || 'border-top border-gray';
        if (selected !== undefined) {
            this.selectedTab = this.tabs.find(v => v.name === selected);
        }
        if (this.selectedTab === undefined)
            this.selectedTab = this.tabs[0];
        this.selectedTab.selected = true;
    }
    showTab(tabName) {
        let tab = this.tabs.find(v => v.name === tabName);
        if (tab === undefined)
            return;
        if (this.selectedTab !== undefined)
            this.selectedTab.selected = false;
        tab.selected = true;
        this.selectedTab = tab;
    }
    render() {
        let cn = classNames('tab', 'tab-' + this.size);
        return React.createElement("div", { className: cn },
            React.createElement("div", { className: this.contentBack }, this.tabs.map((v, index) => {
                let style = {
                    display: v.selected === true ? undefined : 'none'
                };
                return React.createElement("div", { key: index, style: style }, v.content);
            })),
            React.createElement("div", { className: classNames(this.tabBack, this.sep), style: { height: this.size } }, this.tabs.map((v, index) => {
                let { selected, caption, notify } = v;
                let notifyCircle;
                if (notify !== undefined) {
                    let num = notify.get();
                    if (num !== undefined) {
                        if (num > 0)
                            notifyCircle = React.createElement("u", null, num > 99 ? '99+' : num);
                        else if (num < 0)
                            notifyCircle = React.createElement("u", { className: "dot" });
                    }
                }
                return React.createElement("div", { key: index, className: "", onClick: () => this.tabClick(v) },
                    React.createElement("div", { className: "align-self-center" },
                        notifyCircle,
                        caption(selected)));
            })));
    }
};
__decorate([
    observable
], Tabs.prototype, "selectedTab", void 0);
__decorate([
    observable
], Tabs.prototype, "tabs", void 0);
Tabs = __decorate([
    observer
], Tabs);
export { Tabs };
;
//# sourceMappingURL=tabs.js.map