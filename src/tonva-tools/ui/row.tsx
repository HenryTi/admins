import * as React from 'react';
import * as classNames from 'classnames';

export interface LabelRowProps {
    label: string;
    className?: string;
    action?: () => void;
}

export interface LabelRowState {
    isPressed: boolean;
} 

export class LabelRow extends React.Component<LabelRowProps, LabelRowState> {
    constructor(props) {
        super(props);
        this.state = {
            isPressed: false
        }
    }
    mouseDown() {
        this.setState({isPressed: true});
    }
    mouseUp() {
        this.setState({isPressed: false});
        if (this.props.action) this.props.action();
    }
    render() {
        let c = classNames('row', 'label-row', this.props.className, {
            pressed: this.state.isPressed
        });
        return (
        <div
            className={c}
            onMouseDown={()=>this.mouseDown()} 
            onMouseUp={()=>this.mouseUp()}>
            <div className="col-xs-3">{this.props.label}</div>
            <div className="col-xs-9">{this.props.children}</div>
        </div>
        );
    }
}

export interface ActionRowProps {
    className?: string;
    action?: () => void;
}

export interface ActionRowState {
    isPressed: boolean;
} 

export class ActionRow extends React.Component<ActionRowProps, ActionRowState> {
    constructor(props) {
        super(props);
        this.state = {
            isPressed: false
        }
    }
    mouseDown() {
        this.setState({isPressed: true});
    }
    mouseUp() {
        this.setState({isPressed: false});
        if (this.props.action) this.props.action();
    }
    render() {
        let c = classNames('action-row', this.props.className, {
            pressed: this.state.isPressed
        });
        return (
        <div
            className={c}
            onMouseDown={()=>this.mouseDown()} 
            onMouseUp={()=>this.mouseUp()}>
            {this.props.children}
        </div>
        );
    }
}
