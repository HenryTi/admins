import * as React from 'react';
import {IComputedValue} from 'mobx';
import {observer} from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';
import {TitleBar} from './titleBar';

export interface ScrollProps {
    onScroll?: (e:any) => void;
    onScrollTop?: () => void;
    onScrollBottom?: () => void;
}
interface ScrollViewProps extends ScrollProps {
    className?: string;
}
const scrollTimeGap = 100;
class ScrollView extends React.Component<ScrollViewProps, null> {
    private bottomTime:number = 0;
    private topTime:number = 0;

    private onScroll = async (e) => {
        let {onScroll, onScrollTop, onScrollBottom} = this.props;
        if (onScroll) this.props.onScroll(e);
        let el = e.target as HTMLBaseElement;
        if (el.scrollTop < 30) {
            //this.eachChild(this, 'top');
            if (onScrollTop !== undefined) {
                let topTime = new Date().getTime();
                if (topTime-this.topTime > scrollTimeGap) {
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
    }
    private eachChild(c:any, direct:'top'|'bottom') {
        let { props } = c;
        if (props === undefined)
            return;
        let { children } = props;
        if (children === undefined)
            return;
        React.Children.forEach(children, (child, index) => {
            let {_$scroll} = child as any;
            if (_$scroll) _$scroll(direct);
            console.log(child.toString());
            this.eachChild(child, direct);
        });
    }
    render() {
        return (
            <main className={this.props.className} onScroll={this.onScroll}>
                {this.props.children}
            </main>
        );
    }
}

export interface Tab extends ScrollProps {
    title: string;
    icon?: string;
    content?: JSX.Element | (()=>JSX.Element);
    header?: string;
    isSelected?: boolean;
    redDot?: IComputedValue<number>;
    load?: () => Promise<void>;
}
export interface TabState extends Tab {
    isMounted?: boolean;
}
export interface PageProps extends ScrollProps {
    back?: 'close' | 'back' | 'none';
    header?: boolean | string | JSX.Element;
    keepHeader?: boolean;
    right?: JSX.Element;
    footer?: JSX.Element;
    tabs?: Tab[];
    logout?: boolean | (()=>void);
}
export interface PageState {
    cur?: Tab;
    tabs?: TabState[];
}

@observer
export class Page extends React.Component<PageProps, PageState> {
    private tabs:TabState[];
    constructor(props: PageProps) {
        super(props);
        let {tabs} = props;
        if (tabs === undefined || tabs.length === 0) return;
        this.tabs = tabs;
        let cur:Tab;
        let tabStates:Tab[] = [];
        for (let tab of tabs) {
            let t:TabState = _.clone(tab);
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

    async componentDidMount() {
        if (this.tabs === undefined) return;
        let t0 = this.state.tabs[0];
        if (t0 === undefined) return;
        await this.onTabClick(t0);
    }

    private async onTabClick(tab: TabState) {
        if (tab.isSelected === true) return;
        let cur:TabState;
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
            let {load} = cur;
            if (load !== undefined) {
                await load();
            }
        }
        this.setState({
            cur: cur,
            tabs: tabs
        });
    }

    private onTouchStart(evt: React.TouchEvent<HTMLElement>) {
    }

    private renderTabs(footer: JSX.Element) {
        const {header, back, right, keepHeader} = this.props;
        let cur = this.state.cur;
        let tabs = <div>{
                this.state.tabs.map((tab, index) => {
                    const {icon, isSelected, title, redDot} = tab;
                    let img:any, redDotView:any, cn:any;
                    if (icon !== undefined) img = <img src={icon} />;
                    if (redDot !== undefined) {
                        let v = redDot.get();
                        if (v < 0) {
                            cn = classNames('red-dot');
                            redDotView = <u />;
                        }
                        else if (v > 0) {
                            cn = classNames('red-dot', 'num');
                            redDotView = <u>{v}</u>;
                        }
                    }
                    return <div key={index}
                        className= {classNames('va-tab', {cur: isSelected})}
                        onClick={() => this.onTabClick(tab)}>
                        {img}<div className={cn}>{title}{redDotView}</div>
                    </div>
                })
            }</div>;
        let titleBar;
        if (header !== false) {
            titleBar = <TitleBar 
                back={back} 
                center={keepHeader===true? (header as string) : (cur && (cur.header || cur.title))}
                right={right} 
            />;
        }

        return <article className='page-container'>
            {titleBar}
            <section>
            {
                this.state.tabs.map((tab, index) => {
                    let {isSelected, isMounted, content} = tab;
                    if (isSelected === true || isMounted === true) {
                        tab.isMounted = true;
                        return <ScrollView key={index}
                            className={classNames({invisible: isSelected===false})}
                            onScroll={tab.onScroll}
                            onScrollTop={tab.onScrollTop}
                            onScrollBottom={tab.onScrollBottom}
                        >
                            {(typeof content)==='function'? (content as ()=>JSX.Element)():content}
                        </ScrollView>;
                    }
                })
            }
            </section>
            {tabs}
            {footer}
        </article>;
    }
    private renderSingle(footer: JSX.Element) {
        const {back, header, right, onScroll, onScrollTop, onScrollBottom, children} = this.props;
        let titleBar;
        if (header !== false)
            titleBar = <TitleBar 
                back={back} 
                center={header as any}
                right={right}
                logout={this.props.logout}
            />;
        return (
            <article className='page-container' onTouchStart={this.onTouchStart}>
                {titleBar}
                <section>
                    <ScrollView
                        onScroll={onScroll}
                        onScrollTop={onScrollTop}
                        onScrollBottom={onScrollBottom}
                    >
                        {children}
                    </ScrollView>
                </section>
                {footer}
            </article>
        );
    }

    render() {
        const {footer} = this.props;
        let elFooter;
        if (footer !== undefined) elFooter = <footer>{footer}</footer>;
        if (this.tabs !== undefined)
            return this.renderTabs(elFooter);
        else
            return this.renderSingle(elFooter);
    }
}
