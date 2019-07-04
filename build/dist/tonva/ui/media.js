import * as React from 'react';
import classNames from 'classnames';
import { Image } from '../ui';
export class Media extends React.Component {
    render() {
        let { icon, main, discription, px, py } = this.props;
        let disp;
        if (typeof discription === 'string')
            disp = React.createElement("div", null, discription);
        else
            disp = discription;
        let cn = classNames('media', px === undefined ? 'px-0' : 'px-' + px, py === undefined ? 'py-2' : 'py-' + py);
        return React.createElement("div", { className: cn },
            React.createElement(Image, { className: "mr-3 w-4c h-4c", src: icon }),
            React.createElement("div", { className: "media-body" },
                React.createElement("h5", { className: "mt-0" }, main),
                disp));
    }
}
//# sourceMappingURL=media.js.map