import * as React from 'react';
import * as className from 'classnames';
const imgStyle = {
    width: '4rem',
    height: '4rem',
};
export class Media extends React.Component {
    render() {
        let { icon, main, discription, px, py } = this.props;
        let disp;
        if (typeof discription === 'string')
            disp = React.createElement("div", null, discription);
        else
            disp = discription;
        let img = icon;
        if (typeof icon === 'string')
            img = React.createElement("img", { className: "d-flex mr-3", src: icon, alt: "img", style: imgStyle });
        let cn = className('media', px === undefined ? 'px-0' : 'px-' + px, py === undefined ? 'py-2' : 'py-' + py);
        return React.createElement("div", { className: cn },
            img,
            React.createElement("div", { className: "media-body" },
                React.createElement("h5", { className: "mt-0" }, main),
                disp));
    }
}
//# sourceMappingURL=media.js.map