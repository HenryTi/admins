var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, Page } from 'tonva-tools';
import { List, EasyDate, LMR, Muted } from 'tonva-react-form';
import { store } from '../store';
export class UqUpload extends React.Component {
    constructor(props) {
        super(props);
        this.onFilesChange = (evt) => {
            let files = [];
            let len = evt.target.files.length;
            for (let i = 0; i < len; i++) {
                let f = evt.target.files[i];
                files.push(f);
            }
            this.setState({
                files: files,
            });
        };
        this.fileClick = (file) => {
            let fr = new FileReader();
            fr.onload = function (f) {
                //alert(this.result);
                nav.push(React.createElement(UqPage, { name: file.name, content: this.result }));
            };
            fr.readAsText(file, "utf8");
        };
        this.onSubmit = (evt) => {
            evt.preventDefault();
        };
        this.onUpdate = () => __awaiter(this, void 0, void 0, function* () {
            let thoroughly = false;
            yield this.update(thoroughly);
        });
        this.onUpdateThoroughly = () => __awaiter(this, void 0, void 0, function* () {
            let thoroughly = true;
            yield this.update(thoroughly);
        });
        this.state = {
            files: undefined,
        };
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
    update(thoroughly) {
        return __awaiter(this, void 0, void 0, function* () {
            //var files = (evt.target[0] as any).files;
            var files = this.fileInput.files;
            var data = new FormData();
            /*
            for (let i in files) {
                data.append("file" + i, files[i]);
            }
            */
            let len = files.length;
            for (let i = 0; i < len; i++) {
                let file = files[i];
                data.append('files[]', file, file.name);
            }
            let url = store.uqServer + 'uq-compile/' + this.props.uq.id + '/update';
            if (thoroughly === true)
                url += '-thoroughly';
            try {
                let abortController = new AbortController();
                let res = yield fetch(url, {
                    method: "POST",
                    body: data,
                    signal: abortController.signal,
                });
                nav.push(React.createElement(CompileResult, Object.assign({}, this.props, { res: res, abortController: abortController })));
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
            button = React.createElement("div", { className: "my-2 d-flex" },
                React.createElement("button", { className: "btn btn-success", type: "submit", onClick: this.onUpdate }, "\u4F18\u5316\u7F16\u8BD1"),
                React.createElement("div", { className: "py-2 flex-grow-1" }),
                React.createElement("button", { className: "btn btn-outline-warning", type: "submit", onClick: this.onUpdateThoroughly }, "\u5B8C\u5168\u7F16\u8BD1"));
        }
        return React.createElement(Page, { header: "编译 - " + this.props.uq.name },
            React.createElement("div", { className: "py-2 px-3" },
                React.createElement("div", null, "\u8BF7\u9009\u62E9UQ\u6E90\u4EE3\u7801\u6587\u4EF6"),
                React.createElement("form", { className: "my-1", encType: "multipart/form-data", onSubmit: this.onSubmit },
                    React.createElement("div", { className: "my-1" },
                        React.createElement("input", { ref: (fileInput) => this.fileInput = fileInput, type: "file", id: "photo", className: "w-100 form-control-file", name: "files", multiple: true, onChange: this.onFilesChange })),
                    fileList,
                    button),
                React.createElement("pre", null, this.state.compiled),
                React.createElement("div", null, this.state.text)));
    }
}
class UqPage extends React.Component {
    render() {
        return React.createElement(Page, { header: this.props.name },
            React.createElement("pre", { className: "px-3 py-2" }, this.props.content));
    }
}
class CompileResult extends React.Component {
    constructor(props) {
        super(props);
        this.doubleClick = () => {
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
        };
        this.texts = [];
        this.state = {
            texts: this.texts,
            seconds: -1,
        };
    }
    componentWillMount() {
        nav.regConfirmClose(() => __awaiter(this, void 0, void 0, function* () {
            if (this.state.seconds >= 0)
                return true;
            return new Promise((resolve, reject) => {
                try {
                    if (confirm('正在编译中，真的要中止吗？') === true) {
                        try {
                            this.props.abortController.abort();
                        }
                        catch (err) {
                            console.error(err);
                        }
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }
                catch (err) {
                    reject(err);
                }
            });
        }));
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
    scrollToBottom(defer = 100) {
        this.clearTimeHandler();
        let that = this;
        this.timeHandler = setTimeout(() => {
            var pane = document.getElementById('bottomDiv');
            pane && pane.scrollIntoView();
            /*
            if (pane !== undefined) {
                let childNodes = pane.childNodes;
                let last = childNodes.item(childNodes.length-1);
                (last as HTMLElement).scrollIntoView();
            }
            */
            that.clearTimeHandler();
        }, defer);
    }
    topIntoView() {
        var pane = document.getElementById('topDiv');
        pane && pane.scrollIntoView();
        /*
        let childNodes = pane.childNodes;
        let len = childNodes.length;
        if (len === 0) return;
        let first = childNodes.item(0);
        (first as HTMLElement).scrollIntoView();
        */
    }
    bottomIntoView() {
        var pane = document.getElementById('bottomDiv');
        pane && pane.scrollIntoView();
        /*
        let childNodes = pane.childNodes;
        let len = childNodes.length;
        if (len === 0) return;
        let last = childNodes.item(len-1);
        (last as HTMLElement).scrollIntoView();
        */
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
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
                                that.scrollToBottom();
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
            try {
                yield consume(this.props.res.body.getReader());
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    render() {
        let { seconds, texts } = this.state;
        return React.createElement(Page, { header: seconds >= 0 ? "编译完成" : "编译中...", back: "close" },
            React.createElement("div", { id: 'topDiv' }),
            React.createElement("div", { id: 'scrollDiv', onDoubleClick: this.doubleClick, className: 'py-2 px-3', style: { wordWrap: 'break-word', whiteSpace: 'normal' } }, texts.map((v, i) => React.createElement("pre", { style: { whiteSpace: 'pre-wrap' }, key: i }, v))),
            seconds >= 0 ? React.createElement("div", { className: 'px-3 pb-3', style: { color: 'red', fontWeight: 'bold' } },
                "\u7F16\u8BD1\u5B8C\u6210\u3002\u5171\u8BA1\u7528\u65F6",
                Math.floor(seconds / 1000),
                "\u79D2") : undefined,
            React.createElement("div", { id: 'bottomDiv' }));
    }
}
//# sourceMappingURL=uqUpload.js.map