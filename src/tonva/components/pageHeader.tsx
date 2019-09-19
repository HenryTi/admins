import * as React from 'react';
//import _ from 'lodash';
import {nav} from './nav';

export interface PageHeaderProps {
    back?: 'back' | 'close' | 'none';
    center: string | JSX.Element;
    right?: JSX.Element;
    logout?: boolean | (()=>Promise<void>);
    className?: string;
}
export interface PageHeaderState {
    hasBack: boolean;
}

export class PageHeader extends React.Component<PageHeaderProps, PageHeaderState> {
    constructor(props: PageHeaderProps) {
        super(props);
        //this.navChange = this.navChange.bind(this);
        this.state = {
            //hasBack: false,
            hasBack: nav.level > 1
        };
    }
    /*
    navChange() {
        this.setState({
            hasBack: nav.level > 1
        })
    }
    */
    /*
    componentWillMount() {
        this.navChange();
        //this.navChangeHandler = nav.events.add('change', this.navChange);
    }
    */
    componentWillUnmount() {
        //nav.events.remove('change', this.navChangeHandler);
    }
    async back() {
        await nav.back(); // 这个才会显示confirm box，在dataForm里面，如果输入了数据的话
    }
    openWindow() {
        window.open(document.location.href);
    }
    private logoutClick = () => {
        nav.showLogout(this.logout);
    }
    private logout = async () => {
        let {logout} = this.props;
        if (typeof logout === 'function') {
            await logout(); 
        }
        await nav.logout(undefined);
    }
    render() {
        let b = this.state.hasBack || window.self !== window.top;
        let {right, center, logout, className} = this.props;
        let back:any, pop:any, debugLogout:any;
        if (logout !== undefined && window.self === window.top) {
            if ((typeof logout === 'boolean' && logout === true)
                || typeof logout === 'function')
            {
                let {user} = nav;
                if (user !== undefined) {
                    let {nick, name} = user;
                    debugLogout = <div className="d-flex align-items-center">
                        <small className="text-light">{nick || name}</small>
                        <a className="btn ml-2 cursor-pointer" href="#/"
                            role="button"
                            onClick={this.logoutClick}>
                            <i className="fa fa-sign-out fa-lg" />
                        </a>
                    </div>;
                }
            }
        }
        if (b) {
            switch (this.props.back) {
                case 'none': back = undefined; break;
                default:
                case 'back': back = <nav onClick={this.back}><i className="fa fa-angle-left" /></nav>; break;
                case 'close': back = <nav onClick={this.back}><i className="fa fa-close" /></nav>; break;
            }
        }
        if (window.self !== window.top) {
            console.log(document.location.href);
            pop = <header onClick={this.openWindow} />;
        }
        let rightView = (right || debugLogout) && <aside>{right} {debugLogout}</aside>;
        return <header className={className}>
            {pop}
            {back}
            <div>{center}</div>
            {rightView}
        </header>;
    }
}
