import * as React from 'react';
const ui = {
    divs: {
        post: {
            content: (item) => {
                let { title } = item;
                return React.createElement(React.Fragment, null, title);
            },
            rowContent: (item) => {
                let { title } = item;
                return React.createElement(React.Fragment, null, title);
            }
        }
    }
};
export default ui;
//# sourceMappingURL=organization.js.map