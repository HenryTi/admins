import * as React from 'react';
import * as classNames from 'classnames';
export class LabelRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPressed: false
        };
    }
    mouseDown() {
        this.setState({ isPressed: true });
    }
    mouseUp() {
        this.setState({ isPressed: false });
        if (this.props.action)
            this.props.action();
    }
    render() {
        let c = classNames('row', 'label-row', this.props.className, {
            pressed: this.state.isPressed
        });
        return (React.createElement("div", { className: c, onMouseDown: () => this.mouseDown(), onMouseUp: () => this.mouseUp() },
            React.createElement("div", { className: "col-xs-3" }, this.props.label),
            React.createElement("div", { className: "col-xs-9" }, this.props.children)));
    }
}
export class ActionRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPressed: false
        };
    }
    mouseDown() {
        this.setState({ isPressed: true });
    }
    mouseUp() {
        this.setState({ isPressed: false });
        if (this.props.action)
            this.props.action();
    }
    render() {
        let c = classNames('action-row', this.props.className, {
            pressed: this.state.isPressed
        });
        return (React.createElement("div", { className: c, onMouseDown: () => this.mouseDown(), onMouseUp: () => this.mouseUp() }, this.props.children));
    }
}
//# sourceMappingURL=row.js.map