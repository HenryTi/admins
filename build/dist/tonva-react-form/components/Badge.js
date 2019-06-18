var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import '../css/va-badge.css';
let Badge = class Badge extends React.Component {
    render() {
        let { className, badge, size, color, badgeAlign, badgeVertical, children } = this.props;
        let cn = classNames(className, 'va-badge', size && 'va-badge-' + size, 'va-badge-' + (color || 'secondary'), badgeAlign && 'va-badg-' + badgeAlign, badgeVertical && 'va-badg-' + badgeVertical);
        let b;
        if (badge)
            b = React.createElement("b", null, badge);
        return React.createElement("div", { className: cn },
            children,
            b);
    }
};
Badge = __decorate([
    observer
], Badge);
export { Badge };
//# sourceMappingURL=Badge.js.map