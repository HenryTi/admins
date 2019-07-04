import * as React from 'react';
import { observer } from 'mobx-react';
export class ViewModel {
    render(className) {
        if (this.view === undefined)
            return React.createElement("div", null, "??? viewModel \u5FC5\u987B\u5B9A\u4E49 view ???");
        return React.createElement(this.view, { vm: this, className: className });
    }
}
export const PureJSONContent = (values) => React.createElement(React.Fragment, null,
    "content: ",
    JSON.stringify(values));
export const JSONContent = observer(PureJSONContent);
export const RowContent = (values) => React.createElement("div", { className: "px-3 py-2" }, JSON.stringify(values));
//# sourceMappingURL=viewModel.js.map