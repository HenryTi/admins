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
            let url = store.usqlServer + 'usql-compile/' + this.props.id + '/debug/update';
            try {
                let res = yield fetch(url, {
                    method: "POST",
                    body: data
                });
                nav.push(React.createElement(CompileResult, { res: res }));
            }
            catch (e) {
                console.error('%s %s', url, e);
            }
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
        return React.createElement(Page, { header: "\u7F16\u8BD1USQL" },
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
class CompileResult extends React.Component {
    constructor(props) {
        super(props);
        this.texts = [];
        this.state = {
            texts: this.texts,
            seconds: -1,
        };
        this.doubleClick = this.doubleClick.bind(this);
    }
    clearTimeHandler() {
        if (this.timeHandler !== undefined) {
            clearTimeout(this.timeHandler);
            this.timeHandler = undefined;
        }
    }
    getParent(el) {
        if (!el)
            return;
        if (el.tagName === 'MAIN')
            return el;
        return this.getParent(el.parentElement);
    }
    scrollToBottom() {
        this.clearTimeHandler();
        let that = this;
        this.timeHandler = setTimeout(() => {
            var pane = document.getElementById('scrollDiv');
            let childNodes = pane.childNodes;
            let last = childNodes.item(childNodes.length - 1);
            last.scrollIntoView();
            that.clearTimeHandler();
        }, 100);
    }
    topIntoView() {
        var pane = document.getElementById('scrollDiv');
        let childNodes = pane.childNodes;
        let len = childNodes.length;
        if (len === 0)
            return;
        let first = childNodes.item(0);
        first.scrollIntoView();
    }
    bottomIntoView() {
        var pane = document.getElementById('scrollDiv');
        let childNodes = pane.childNodes;
        let len = childNodes.length;
        if (len === 0)
            return;
        let last = childNodes.item(len - 1);
        last.scrollIntoView();
    }
    doubleClick() {
        var pane = document.getElementById('scrollDiv');
        let main = this.getParent(pane);
        if (!main)
            return;
        if (main.scrollTop >= main.scrollHeight / 2) {
            this.topIntoView();
        }
        else {
            this.bottomIntoView();
        }
    }
    componentDidMount() {
        let that = this;
        let time = new Date();
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
                                seconds: (new Date().getTime() - time.getTime()),
                            });
                            resolve();
                            return;
                        }
                        let text = uintToString(value);
                        that.texts.push(text);
                        that.setState({
                            texts: that.texts,
                        });
                        total += value.byteLength;
                        that.scrollToBottom();
                        pump();
                    }).catch(reject);
                }
                pump();
            });
        }
        consume(this.props.res.body.getReader());
    }
    render() {
        let { seconds, texts } = this.state;
        return React.createElement(Page, { header: seconds >= 0 ? "编译完成" : "编译中..." },
            React.createElement("div", { onDoubleClick: this.doubleClick, id: 'scrollDiv', className: 'py-2 px-3', style: { wordWrap: 'break-word', whiteSpace: 'normal' } }, texts.map((v, i) => React.createElement("pre", { style: { whiteSpace: 'pre-wrap' }, key: i }, v))),
            seconds >= 0 ? React.createElement("div", { className: 'px-3 pb-3', style: { color: 'red', fontWeight: 'bold' } },
                "\u7F16\u8BD1\u5B8C\u6210\u3002\u5171\u8BA1\u7528\u65F6",
                Math.floor(seconds / 1000),
                "\u79D2") : undefined);
    }
}
//# sourceMappingURL=usqlUpload.js.map