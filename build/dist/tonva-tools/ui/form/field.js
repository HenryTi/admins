import * as React from 'react';
import { factory } from './widgets';
import { ContextContainer } from './context';
export class Field extends React.Component {
    render() {
        let { name, children } = this.props;
        let context = this.context;
        if (context === undefined)
            return React.createElement("span", { className: "text-danger" }, "!only in Form!");
        let itemSchema = context.getItemSchema(name);
        let content = factory(context, itemSchema, children, this.props);
        if (content === undefined) {
            return React.createElement("span", { className: "text-danger" },
                "!!",
                name,
                " is not defined!!");
        }
        return content;
    }
}
Field.contextType = ContextContainer;
//# sourceMappingURL=field.js.map