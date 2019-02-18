import * as React from 'react';
const iconStyle = (color) => {
    return {
        color: color || '#7f7fff',
        margin: '6px 0'
    };
};
export const rowIcon = (name, color) => React.createElement("i", { style: iconStyle(color), className: 'fa fa-lg fa-' + name });
//# sourceMappingURL=rowIcon.js.map