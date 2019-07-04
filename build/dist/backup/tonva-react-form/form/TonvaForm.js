var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { FormView } from './formView';
export function tonvaDebug() {
    let a = 0;
}
let TonvaForm = class TonvaForm extends React.Component {
    constructor(props) {
        super(props);
        this.formView = new FormView(this.props);
    }
    componentWillMount() {
        this.formView.setInitValues(this.props.initValues);
    }
    debug() {
        let s = null;
    }
    render() {
        let { className, children, initValues } = this.props;
        return React.createElement("div", { className: className }, children === undefined ?
            this.formView.render() :
            React.createElement("form", { onSubmit: this.formView.onSubmit }, children));
    }
};
TonvaForm = __decorate([
    observer
], TonvaForm);
export { TonvaForm };
//# sourceMappingURL=TonvaForm.js.map