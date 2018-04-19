import * as React from 'react';
import {Button} from 'reactstrap';
import {nav, Page} from 'tonva-tools';
import {List, EasyDate, LMR, Muted} from 'tonva-react-form';
import {DevModel} from '../model';
import {store} from '../store';

interface State {
    files: any[];
    compiled?: string;
    text?: string;
}

export class UsqlUpload extends React.Component<DevModel.Usqldb, State> {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFilesChange = this.onFilesChange.bind(this);
        this.state = {
            files: undefined,
        }
    }
    onFilesChange(evt) {
        let files:any[] = [];
        let len = evt.target.files.length;
        for (let i=0; i<len; i++) {
            let f = evt.target.files[i];
            files.push(f);
        }
        this.setState({
            files: files,
        });
    }
    fileRender(file, index):JSX.Element {
        let {name, size, lastModifiedDate} = file;
        function sz():string {
            let n:number, u:string;
            if (size < 1024) {
                n = size; u = 'b';
            }
            else if (size < 1024*1024) {
                n = Math.trunc((size / 1024) * 100)/100; u = 'k';
            }
            else {
                n = Math.trunc((size / 1024 / 1024) * 100)/100; u = 'm';
            }
            return n + ' ' + u;
        }
        return <LMR className="px-2 py-1" right={<Muted>{sz()}</Muted>}>
            <div>{name}</div>
            <div><Muted>修改日期: <EasyDate date={lastModifiedDate} /></Muted></div>
        </LMR>;
    }
    fileClick(file) {
        let fr = new FileReader();
        fr.onload = function(f) {
            //alert(this.result);
            nav.push(<UsqlPage name={file.name} content={this.result} />)
        }
        fr.readAsText(file, "utf8");
    }
    async onSubmit(evt:React.FormEvent<any>) {        
        evt.preventDefault();
        var files = (evt.target[0] as any).files;
        var data = new FormData();
        for (let i in files) {
            data.append("file" + i, files[i]);
        }
  
        // "http://localhost:3009/upload"
        let res = await fetch(store.usqlServer + 'usql-compile/' + this.props.id + '/debug/update', {
          method: "POST",
          body: data
        });
        nav.push(<CompileResult res={res} />);
    }
    render() {
        let {files} = this.state;
        let fileList;
        if (files !== undefined) {
            fileList = <List className="my-3" items={files} item={{render: this.fileRender, onClick: this.fileClick}}/>;
        }
        let button;
        if (files !== undefined && files.length > 0) {
            button = <div className="my-2">
                <Button type="submit" color="primary">升级数据库</Button>
            </div>;
        }
        return <Page header="编译USQL">
            <div className="py-2 px-3">
                <div>请选择usql源代码文件</div>
                <form className="my-1" encType="multipart/form-data" onSubmit={this.onSubmit}>
                    <div className="my-1">
                        <input type="file" id="photo" className="w-100 form-control-file" name="files" multiple={true} onChange={this.onFilesChange} />
                    </div>
                    {fileList}
                    {button}
                </form>
                <pre>{this.state.compiled}</pre>
                <div>{this.state.text}</div>
            </div>
        </Page>
    }
}

interface UsqlPgeProps {
    name: string;
    content: string;
}
class UsqlPage extends React.Component<UsqlPgeProps> {
    render() {
        return <Page header={this.props.name}>
            <pre className="px-3 py-2">{this.props.content}</pre>
        </Page>;
    }
}

interface CompileResultProps {
    res: Response;
}
interface CompileResultState {
    texts: string[];
    seconds: number;
}
class CompileResult extends React.Component<CompileResultProps, CompileResultState> {
    private texts: string[];
    private timeHandler:any;
    constructor(props) {
        super(props);
        this.texts = [];
        this.state = {
            texts: this.texts,
            seconds: -1,
        }
        this.doubleClick = this.doubleClick.bind(this);
    }
    private clearTimeHandler() {
        if (this.timeHandler !== undefined) {
            clearTimeout(this.timeHandler);
            this.timeHandler = undefined;
        }
    }
    private getParent(el:HTMLElement):HTMLElement {
        if (!el) return;
        if (el.tagName === 'MAIN') return el;
        return this.getParent(el.parentElement);
    }
    private scrollToBottom() {
        this.clearTimeHandler();
        let that = this;
        this.timeHandler = setTimeout(() => {
            var pane = document.getElementById('scrollDiv');
            let childNodes = pane.childNodes;
            let last = childNodes.item(childNodes.length-1);
            (last as HTMLElement).scrollIntoView();
            that.clearTimeHandler();
        }, 100);
    }
    private topIntoView() {
        var pane = document.getElementById('scrollDiv');
        let childNodes = pane.childNodes;
        let len = childNodes.length;
        if (len === 0) return;
        let first = childNodes.item(0);
        (first as HTMLElement).scrollIntoView();
    }
    private bottomIntoView() {
        var pane = document.getElementById('scrollDiv');
        let childNodes = pane.childNodes;
        let len = childNodes.length;
        if (len === 0) return;
        let last = childNodes.item(len-1);
        (last as HTMLElement).scrollIntoView();
    }
    private doubleClick() {
        var pane = document.getElementById('scrollDiv');
        let main = this.getParent(pane);
        if (!main) return;
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
        function consume(reader: ReadableStreamReader) {
            var total = 0
            return new Promise((resolve, reject) => {
                function uintToString(uintArray):string {
                    var encodedString = String.fromCharCode.apply(null, uintArray),
                        decodedString = decodeURIComponent(escape(encodedString));
                    return decodedString;
                }
                function pump() {
                    reader.read().then(({done, value}) => {
                        if (done) {
                            that.setState({
                                seconds: (new Date().getTime() - time.getTime()),
                            })
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
                    }).catch(reject)
                }
                pump();
            });
        }
        consume(this.props.res.body.getReader());
    }
    render() {
        let {seconds, texts} = this.state;
        return <Page header={seconds>=0? "编译完成" : "编译中..."}>
            <div onDoubleClick={this.doubleClick} id='scrollDiv' className='py-2 px-3' style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>
                {texts.map((v, i) => <pre style={{whiteSpace: 'pre-wrap'}} key={i}>{v}</pre>)}
            </div>
            {seconds>=0? <div className='px-3 pb-3' style={{color: 'red', fontWeight: 'bold'}}>
                编译完成。共计用时{Math.floor(seconds/1000)}秒
            </div> : undefined}
        </Page>;
    }
}