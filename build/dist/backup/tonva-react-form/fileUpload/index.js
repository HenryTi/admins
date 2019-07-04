import * as React from 'react';
export class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit() {
    }
    render() {
        return React.createElement("form", { onSubmit: this.onSubmit },
            React.createElement("input", { id: "uname", name: "uname" }),
            React.createElement("input", { id: "age", name: "age" }),
            React.createElement("input", { id: "sex", name: "sex" }),
            React.createElement("input", { type: "file", id: "photo", name: "photo" }),
            React.createElement("button", { type: "submit" }, "\u63D0\u4EA4"));
    }
}
//# sourceMappingURL=index.js.map