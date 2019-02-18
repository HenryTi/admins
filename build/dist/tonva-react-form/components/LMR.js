var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observer } from 'mobx-react';
import * as classNames from 'classnames';
import '../css/va-lmr.css';
let LMR = class LMR extends React.Component {
    render() {
        let { className, left, children, right, onClick } = this.props;
        let l, r;
        if (left !== undefined)
            l = React.createElement("header", null, left);
        if (right !== undefined)
            r = React.createElement("footer", null, right);
        let cursor;
        if (onClick !== undefined)
            cursor = 'cursor-pointer';
        return React.createElement("div", { className: classNames('va-lmr', className, cursor), onClick: onClick },
            l,
            React.createElement("div", null, children),
            r);
    }
};
LMR = __decorate([
    observer
], LMR);
export { LMR };
//# sourceMappingURL=LMR.js.map