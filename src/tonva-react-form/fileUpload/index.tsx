import * as React from 'react';

export class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit() {
        
    }
    render() {
        return <form onSubmit={this.onSubmit}>
            <input id="uname"  name="uname" />
            <input id="age"  name="age" />
            <input id="sex"  name="sex" />
            <input type="file" id="photo"  name="photo" />
            <button type="submit">提交</button>
        </form>;
    }
}
