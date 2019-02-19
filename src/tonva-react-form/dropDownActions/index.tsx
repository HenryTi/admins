import * as React from 'react';
import classNames from 'classnames';

export interface Action {
    icon?: string;
    caption?: string;
    action?: () => void;
}

export interface DropdownActionsProps {
    icon?: string;
    actions: Action[];
    isRight?: boolean;
}

export interface DropdownActionsState {
    dropdownOpen: boolean;
}

export class DropdownActions extends React.Component<DropdownActionsProps, DropdownActionsState> {
    private menu: HTMLDivElement;
    private button: HTMLElement;
    constructor(props:DropdownActionsProps) {
        super(props);
        this.state = {
            dropdownOpen: false
        };
    }

    componentWillMount() {
        document.addEventListener('click', this.handleDocumentClick);
        document.addEventListener('touchstart', this.handleDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('touchstart', this.handleDocumentClick);
    }

    private handleDocumentClick = (evt:any) => {
        if (this.state.dropdownOpen === false) return;
        if (this.button && this.button.contains(evt.target)) return;
        if (!this.menu) return;
        //if (!this.menu.contains(evt.target)) 
        this.toggle();
    }

    private toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        let {icon, actions, isRight} = this.props;
        if (isRight === undefined) isRight = true;
        let hasIcon = actions.some(v => v.icon!==undefined);
        let {dropdownOpen} = this.state;
        //isOpen={this.state.dropdownOpen} toggle={this.toggle}
        return <div className="dropdown">
            <button ref={v=>this.button=v} className="cursor-pointer dropdown-toggle btn btn-sm"
                data-toggle="dropdown"
                aria-expanded={dropdownOpen}
                onClick={this.toggle}>
                <i className={classNames('fa', 'fa-'+(icon||'ellipsis-v'))} />
            </button>
            <div ref={v => this.menu=v} className={classNames({"dropdown-menu":true, "dropdown-menu-right":isRight, "show":dropdownOpen})}>
                {
                    actions.map((v,index) => {
                        let {icon, caption, action} = v;
                        if (icon === undefined && caption === undefined) 
                            return <div className="dropdown-divider" />;
                        let i:any;
                        if (hasIcon === true) {
                            if (icon !== undefined) icon = 'fa-' + icon;
                            i = <><i className={classNames('fa', icon, 'fa-fw')} aria-hidden={true}></i>&nbsp; </>;
                        }
                        if (action === undefined) 
                            return <h6 className="dropdown-header">{i} {caption}</h6>;
                        return <a className="dropdown-item" key={index} href="#" onClick={(evt:React.MouseEvent<HTMLAnchorElement>)=>{ evt.preventDefault();action()}}>{i} {caption}</a>
                    })
                }
            </div>
        </div>
    }
}

/*
export class DropdownActions extends React.Component<DropdownActionsProps, DropdownActionsState> {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false
        };
    }
    private toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    render() {
        let {icon, actions, isRight} = this.props;
        if (isRight === undefined) isRight = true;
        let hasIcon = actions.some(v => v.icon!==undefined);
        return <UncontrolledButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret={true} size="sm" className="cursor-pointer">
                <i className={classNames('fa', 'fa-'+(icon||'ellipsis-v'))} />
            </DropdownToggle>
            <DropdownMenu right={isRight}>
                {actions.map((v,index) => {
                    let {icon, caption, action} = v;
                    if (icon === undefined && caption === undefined) 
                        return <div className="dropdown-divider" />;
                    let i;
                    if (hasIcon === true) {
                        if (icon !== undefined) icon = 'fa-' + icon;
                        i = <><i className={classNames('fa', icon, 'fa-fw')} aria-hidden={true}></i>&nbsp; </>;
                    }
                    if (action === undefined) 
                        return <h6 className="dropdown-header">{i} {caption}</h6>;
                    return <DropdownItem key={index} onClick={action}>{i} {caption}</DropdownItem>
                })}
            </DropdownMenu>
        </UncontrolledButtonDropdown>
    }
}
*/