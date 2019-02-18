import * as React from 'react';
import {nav, Page} from 'tonva-tools';
import {List, EasyDate, LMR, Muted} from 'tonva-react-form';
import {DevModel} from '../../model';
import {store} from '../../store';

interface State {
    files: any[];
    compiled?: string;
    text?: string;
}

export interface UpUploadProps {
    uq: DevModel.UQ;
    services: DevModel.Service[];
}

export class UqUpload extends React.Component<UpUploadProps, State> {
    private fileInput: HTMLInputElement;

    constructor(props) {
        super(props);
        this.state = {
            files: undefined,
        }
    }
    private onFilesChange = (evt) => {
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
    private fileClick = (file) => {
        let fr = new FileReader();
        fr.onload = function(f) {
            //alert(this.result);
            nav.push(<UqPage name={file.name} content={this.result} />)
        }
        fr.readAsText(file, "utf8");
    }
    private onSubmit = (evt:React.FormEvent<any>) => {
        evt.preventDefault();
    }

    private async update(thoroughly:boolean) {
        //var files = (evt.target[0] as any).files;
        var files:FileList = this.fileInput.files;
        var data = new FormData();
        /*
        for (let i in files) {
            data.append("file" + i, files[i]);
        }
        */
        let len = files.length;
        for (let i=0; i<len; i++) {
            let file = files[i];
            data.append('files[]', file, file.name);
        }
  
        let url = store.uqServer + 'uq-compile/' + this.props.uq.id + '/update';
        if (thoroughly === true) url += '-thoroughly';
        try {
            let abortController = new AbortController();
            let res = await fetch(url, {
                method: "POST",
                body: data,
                signal: abortController.signal,
            });
            nav.push(<CompileResult {...this.props} res={res} abortController={abortController} />);
        }
        catch (e) {
            console.error('%s %s', url, e);
        }
    }
    private onUpdate = async () => {
        let thoroughly = false;
        await this.update(thoroughly);
    }
    private onUpdateThoroughly = async () => {
        let thoroughly = true;
        await this.update(thoroughly);
    }
    render() {
        let {files} = this.state;
        let fileList:any;
        if (files !== undefined) {
            fileList = <List 
                className="my-3" 
                items={files} 
                item={{render: this.fileRender, onClick: this.fileClick}}/>;
        }
        let button:any;
        if (files !== undefined && files.length > 0) {
            button = <div className="my-2 d-flex">
                <button className="btn btn-success" type="submit" onClick={this.onUpdate}>优化编译</button>
                <div className="py-2 flex-grow-1" />
                <button className="btn btn-outline-warning"
                    type="submit" onClick={this.onUpdateThoroughly}>完全编译</button>
            </div>;
        }
        return <Page header={"编译 - " + this.props.uq.name}>
            <div className="py-2 px-3">
                <div>请选择UQ源代码文件</div>
                <form className="my-1" encType="multipart/form-data" onSubmit={this.onSubmit}>
                    <div className="my-1">
                        <input ref={(fileInput) => this.fileInput=fileInput}type="file" id="photo" 
                            className="w-100 form-control-file" name="files" multiple={true} 
                            onChange={this.onFilesChange} />
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

interface UqPgeProps {
    name: string;
    content: string|ArrayBuffer;
}
class UqPage extends React.Component<UqPgeProps> {
    render() {
        return <Page header={this.props.name}>
            <pre className="px-3 py-2">{this.props.content}</pre>
        </Page>;
    }
}

interface CompileResultProps {
    res: Response;
    abortController: AbortController;
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
    }
    componentWillMount() {
        nav.regConfirmClose(async ():Promise<boolean>=>{
            if (this.state.seconds>=0) return true;
            return new Promise<boolean>((resolve, reject) => {
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
            })
        });
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
    private scrollToBottom(defer:number = 100) {
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
    private topIntoView() {
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
    private bottomIntoView() {
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
    private doubleClick = () => {
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
    async componentDidMount() {
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
                            that.scrollToBottom();
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
        try {
            await consume(this.props.res.body.getReader());
        }
        catch (err) {
            console.error(err);
        }
    }
    render() {
        let {seconds, texts} = this.state;
        return <Page header={seconds>=0? "编译完成" : "编译中..."} back="close">
            <div id='topDiv' />
            <div id='scrollDiv'
                onDoubleClick={this.doubleClick} 
                className='py-2 px-3' 
                style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>
                {texts.map((v, i) => <pre style={{whiteSpace: 'pre-wrap'}} key={i}>{v}</pre>)}
            </div>
            {seconds>=0? <div className='px-3 pb-3' style={{color: 'red', fontWeight: 'bold'}}>
                编译完成。共计用时{Math.floor(seconds/1000)}秒
            </div> : undefined}
            <div id='bottomDiv' />
        </Page>;
    }
}