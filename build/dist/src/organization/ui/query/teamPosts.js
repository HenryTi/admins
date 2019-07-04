import * as React from 'react';
import { observer } from 'mobx-react';
const ui = {
    row: observer((item) => {
        let { post } = item;
        return React.createElement("div", { className: "px-3 py-2" }, post.content());
    }),
};
export default ui;
//# sourceMappingURL=teamPosts.js.map