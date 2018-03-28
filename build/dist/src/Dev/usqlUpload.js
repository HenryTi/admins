var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Button } from 'reactstrap';
import { nav, Page } from 'tonva-tools';
import { List, EasyDate, LMR, Muted } from 'tonva-react-form';
import { store } from '../store';
escape('a');
export class UsqlUpload extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFilesChange = this.onFilesChange.bind(this);
        this.state = {
            files: undefined,
        };
    }
    onFilesChange(evt) {
        let files = [];
        let len = evt.target.files.length;
        for (let i = 0; i < len; i++) {
            let f = evt.target.files[i];
            files.push(f);
        }
        this.setState({
            files: files,
        });
    }
    fileRender(file, index) {
        let { name, size, lastModifiedDate } = file;
        function sz() {
            let n, u;
            if (size < 1024) {
                n = size;
                u = 'b';
            }
            else if (size < 1024 * 1024) {
                n = Math.trunc((size / 1024) * 100) / 100;
                u = 'k';
            }
            else {
                n = Math.trunc((size / 1024 / 1024) * 100) / 100;
                u = 'm';
            }
            return n + ' ' + u;
        }
        return React.createElement(LMR, { className: "px-2 py-1", right: React.createElement(Muted, null, sz()) },
            React.createElement("div", null, name),
            React.createElement("div", null,
                React.createElement(Muted, null,
                    "\u4FEE\u6539\u65E5\u671F: ",
                    React.createElement(EasyDate, { date: lastModifiedDate }))));
    }
    fileClick(file) {
        let fr = new FileReader();
        fr.onload = function (f) {
            //alert(this.result);
            nav.push(React.createElement(UsqlPage, { name: file.name, content: this.result }));
        };
        fr.readAsText(file, "utf8");
    }
    onSubmit(evt) {
        return __awaiter(this, void 0, void 0, function* () {
            evt.preventDefault();
            var files = evt.target[0].files;
            var data = new FormData();
            for (let i in files) {
                data.append("file" + i, files[i]);
            }
            // "http://localhost:3009/upload"
            let res = yield fetch(store.usqlServer + 'usql/' + this.props.dbname + '/debug/update', {
                method: "POST",
                body: data
            });
            let that = this;
            function consume(reader) {
                var total = 0;
                return new Promise((resolve, reject) => {
                    function uintToString(uintArray) {
                        var encodedString = String.fromCharCode.apply(null, uintArray), decodedString = decodeURIComponent(escape(encodedString));
                        return decodedString;
                    }
                    function pump() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                that.setState({
                                    compiled: 'done: ' + total + ' bytes in total',
                                });
                                resolve();
                                return;
                            }
                            total += value.byteLength;
                            that.setState({
                                compiled: 'received ' + value.byteLength + ' bytes ' + total + ' bytes in total',
                                text: uintToString(value),
                            });
                            pump();
                        }).catch(reject);
                    }
                    pump();
                });
            }
            consume(res.body.getReader());
            //let text = await res.text();
            //this.setState({compiled: text});
            //alert(JSON.stringify(json));
        });
    }
    render() {
        let { files } = this.state;
        let fileList;
        if (files !== undefined) {
            fileList = React.createElement(List, { className: "my-3", items: files, item: { render: this.fileRender, onClick: this.fileClick } });
        }
        let button;
        if (files !== undefined && files.length > 0) {
            button = React.createElement("div", { className: "my-2" },
                React.createElement(Button, { type: "submit", color: "primary" }, "\u5347\u7EA7\u6570\u636E\u5E93"));
        }
        return React.createElement(Page, { header: "编译USQL" },
            React.createElement("div", { className: "py-2 px-3" },
                React.createElement("div", null, "\u8BF7\u9009\u62E9usql\u6E90\u4EE3\u7801\u6587\u4EF6"),
                React.createElement("form", { className: "my-1", encType: "multipart/form-data", onSubmit: this.onSubmit },
                    React.createElement("div", { className: "my-1" },
                        React.createElement("input", { type: "file", id: "photo", className: "w-100 form-control-file", name: "files", multiple: true, onChange: this.onFilesChange })),
                    fileList,
                    button),
                React.createElement("pre", null, this.state.compiled),
                React.createElement("div", null, this.state.text)));
    }
}
class UsqlPage extends React.Component {
    render() {
        return React.createElement(Page, { header: this.props.name },
            React.createElement("pre", { className: "px-3 py-2" }, this.props.content));
    }
}
//# sourceMappingURL=usqlUpload.js.map