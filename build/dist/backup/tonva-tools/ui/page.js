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
import classNames from 'classnames';
import _ from 'lodash';
import { PageHeader } from './pageHeader';
const scrollTimeGap = 100;
class ScrollView extends React.Component {
    constructor() {
        super(...arguments);
        this.bottomTime = 0;
        this.topTime = 0;
        this.onScroll = (e) => __awaiter(this, void 0, void 0, function* () {
            let { onScroll, onScrollTop, onScrollBottom } = this.props;
            if (onScroll)
                this.props.onScroll(e);
            let el = e.target;
            if (el.scrollTop < 30) {
                //this.eachChild(this, 'top');
                if (onScrollTop !== undefined) {
                    let topTime = new Date().getTime();
                    if (topTime - this.topTime > scrollTimeGap) {
                        this.topTime = topTime;
                        onScrollTop();
                    }
                }
            }
            if (el.scrollTop + el.offsetHeight > el.scrollHeight - 30) {
                //this.eachChild(this, 'bottom');
                if (onScrollBottom !== undefined) {
                    let bottomTime = new Date().getTime();
                    if (bottomTime - this.bottomTime > scrollTimeGap) {
                        this.bottomTime = bottomTime;
                        onScrollBottom();
                    }
                }
            }
        });
    }
    eachChild(c, direct) {
        let { props } = c;
        if (props === undefined)
            return;
        let { children } = props;
        if (children === undefined)
            return;
        React.Children.forEach(children, (child, index) => {
            let { _$scroll } = child;
            if (_$scroll)
                _$scroll(direct);
            console.log(child.toString());
            this.eachChild(child, direct);
        });
    }
    render() {
        return (React.createElement("main", { className: this.props.className, onScroll: this.onScroll }, this.props.children));
    }
}
let Page = class Page extends React.Component {
    constructor(props) {
        super(props);
        let { tabs } = props;
        if (tabs === undefined || tabs.length === 0)
            return;
        this.tabs = tabs;
        let cur;
        let tabStates = [];
        for (let tab of tabs) {
            let t = _.clone(tab);
            if (cur === undefined) {
                if (t.isSelected === true)
                    cur = t;
                else
                    t.isSelected = false;
            }
            else {
                t.isSelected = false;
            }
            t.isMounted = false;
            tabStates.push(t);
        }
        this.state = {
            cur: cur,
            tabs: tabStates,
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tabs === undefined)
                return;
            let t0 = this.state.tabs[0];
            if (t0 === undefined)
                return;
            yield this.onTabClick(t0);
        });
    }
    onTabClick(tab) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tab.isSelected === true)
                return;
            let cur;
            let tabs = this.state.tabs;
            for (let t of tabs) {
                if (t === tab) {
                    t.isSelected = true;
                    cur = t;
                }
                else
                    t.isSelected = false;
            }
            if (cur.isMounted !== true) {
                let { load } = cur;
                if (load !== undefined) {
                    yield load();
                }
            }
            this.setState({
                cur: cur,
                tabs: tabs
            });
        });
    }
    onTouchStart(evt) {
    }
    renderTabs(footer) {
        const { header, back, right, keepHeader, headerClassName } = this.props;
        let cur = this.state.cur;
        let tabs = React.createElement("div", null, this.state.tabs.map((tab, index) => {
            const { icon, isSelected, title, redDot } = tab;
            let img, redDotView, cn;
            if (icon !== undefined)
                img = React.createElement("img", { src: icon });
            if (redDot !== undefined) {
                let v = redDot.get();
                if (v < 0) {
                    cn = classNames('red-dot');
                    redDotView = React.createElement("u", null);
                }
                else if (v > 0) {
                    cn = classNames('red-dot', 'num');
                    redDotView = React.createElement("u", null, v);
                }
            }
            return React.createElement("div", { key: index, className: classNames('va-tab', { cur: isSelected }), onClick: () => this.onTabClick(tab) },
                img,
                React.createElement("div", { className: cn },
                    title,
                    redDotView));
        }));
        let pageHeader = header !== false &&
            React.createElement(PageHeader, { back: back, center: keepHeader === true ? header : (cur && (cur.header || cur.title)), right: right, className: headerClassName });
        return React.createElement("article", { className: 'page-container' },
            pageHeader,
            React.createElement("section", { className: "position-relative" },
                this.props.sideBar,
                this.state.tabs.map((tab, index) => {
                    let { isSelected, isMounted, content } = tab;
                    if (isSelected === true || isMounted === true) {
                        tab.isMounted = true;
                        return React.createElement(ScrollView, { key: index, className: classNames({ invisible: isSelected === false }), onScroll: tab.onScroll, onScrollTop: tab.onScrollTop, onScrollBottom: tab.onScrollBottom }, (typeof content) === 'function' ? content() : content);
                    }
                })),
            tabs,
            footer);
    }
    renderSingle(footer) {
        const { back, header, right, onScroll, onScrollTop, onScrollBottom, children, headerClassName } = this.props;
        let pageHeader = header !== false && React.createElement(PageHeader, { back: back, center: header, right: right, logout: this.props.logout, className: headerClassName });
        return (React.createElement("article", { className: 'page-container', onTouchStart: this.onTouchStart },
            pageHeader,
            React.createElement("section", { className: "position-relative" },
                this.props.sideBar,
                React.createElement(ScrollView, { onScroll: onScroll, onScrollTop: onScrollTop, onScrollBottom: onScrollBottom }, children)),
            footer));
    }
    render() {
        const { footer } = this.props;
        let elFooter = footer !== undefined && React.createElement("footer", null, footer);
        if (this.tabs !== undefined)
            return this.renderTabs(elFooter);
        else
            return this.renderSingle(elFooter);
    }
};
Page = __decorate([
    observer
], Page);
export { Page };
//# sourceMappingURL=page.js.map