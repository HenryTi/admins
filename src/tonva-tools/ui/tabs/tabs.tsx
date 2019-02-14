import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { IObservableValue } from 'mobx/lib/internal';

export type TabCaption = (selected:boolean) => JSX.Element;

export interface TabProp {
    name: string;
    caption: TabCaption;
    content: () => JSX.Element;
    notify?: IObservableValue<number>;
}

export interface TabsProps {
    tabs: TabProp[];
    size?: 'sm' | 'lg' | 'md';
    tabBack?: string;
    contentBack?: string;
    sep?: string;
    selected?: string;
}

class Tab {
    name: string;
    @observable selected: boolean;
    caption: TabCaption;
    contentBuilder: ()=>JSX.Element;
    notify: IObservableValue<number>;

    private _content: JSX.Element;
    get content(): JSX.Element {
        if (this.selected !== true) return this._content;
        if (this._content !== undefined) return this._content;
        return this._content = this.contentBuilder();
    }
}

export const TabCaptionComponent = (label:string, icon:string, color:string) => <div 
    className={'d-flex justify-content-center align-items-center flex-column cursor-pointer ' + color}>
    <div><i className={'fa fa-lg fa-' + icon} /></div>
    <small>{label}</small>
</div>;

@observer export class Tabs extends React.Component<TabsProps> {
    private size: string;
    private tabBack: string;
    private contentBack: string;
    private sep: string;
    @observable private selectedTab: Tab;
    @observable private tabs: Tab[] = [];

    constructor(props: TabsProps) {
        super(props);
        let {size, tabs, tabBack, contentBack, sep, selected} = this.props;
        switch (size) {
            default:
            case 'md': this.size = '3.2rem'; break;
            case 'sm': this.size = '4rem'; break;
            case 'lg': this.size = '2.5rem'; break;
        }
        this.tabs.push(...tabs.map(v => {
                let tab = new Tab();
                tab.name = v.name;
                tab.selected = false;
                tab.caption = v.caption;
                tab.contentBuilder = v.content;
                tab.notify = v.notify;
                return tab;
            }
        ));
        this.tabBack = tabBack || 'bg-light';
        this.contentBack = contentBack;
        this.sep = sep || 'border-top border-gray';
        if (selected !== undefined) {
            this.selectedTab = this.tabs.find(v => v.name === selected);
        }
        if (this.selectedTab === undefined) this.selectedTab = this.tabs[0];
        this.selectedTab.selected = true;
    }

    private tabClick = (tab:Tab) => {
        this.selectedTab.selected = false;
        tab.selected = true;
        this.selectedTab = tab;
    }

    render() {
        return <div className="tab">
            <div className={this.contentBack} style={{height: 'calc(100% - ' + this.size + ')'}}>
                {this.tabs.map((v,index) => {
                    let style:React.CSSProperties={
                        display: v.selected===true? undefined : 'none'};
                    return <div key={index} style={style}>{v.content}</div>;
                })}
            </div>
            <div className={classNames(this.tabBack, this.sep)} style={{height: this.size}}>
                {this.tabs.map((v,index) => {
                    let {selected, caption, notify} = v;
                    let notifyCircle:any;
                    if (notify !== undefined) {
                        let num = notify.get();
                        if (num !== undefined) {
                            if (num > 0) notifyCircle = <u>{num>99?'99+':num}</u>;
                            else if (num < 0) notifyCircle = <u className="dot" />;
                        }
                    }
                    return <div key={index} className="" onClick={()=>this.tabClick(v)}>
                        <div className="align-self-center">
                            {notifyCircle}
                            {caption(selected)}
                        </div>
                    </div>
                })}
            </div>
        </div>
    }
};
