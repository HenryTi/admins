import * as React from 'react';
import { factory } from './widgets';
import { ContextContainer, Context } from './context';

export interface FieldProps {
    name: string;
}

export class Field extends React.Component<FieldProps> {
    static contextType = ContextContainer;
    render() {
        let {name, children } = this.props;
        let context:Context = this.context;
        if (context === undefined) return <span className="text-danger">!only in Form!</span>;
        let itemSchema = context.getItemSchema(name);
        let content = factory(context, itemSchema, children, this.props);
        if (content === undefined) {
            return <span className="text-danger">!!{name} is not defined!!</span>;
        }
        return content;
    }
}
