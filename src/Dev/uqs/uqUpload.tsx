import * as React from 'react';
import {nav, Page, FA} from 'tonva';
import {List, EasyDate, LMR, Muted} from 'tonva';
import {DevModel} from '../../model';
import {store} from '../../store';
import { ResultSections, Section } from './resultSections';
import { observer } from 'mobx-react';

interface State {
    files: any[];
    compiled?: string;
    text?: string;
}

export interface UqActionProps {
    uq: DevModel.UQ;
    action?: 'upload' | 'test' | 'deploy';
    services: DevModel.Service[];
}

//const fastUpload = '快速测试';
//const thoroughlyUpload = '完全测试';
export class UqUpload extends React.Component<UqActionProps, State> {
    private fileInput: HTMLInputElement;

    constructor(props:UqActionProps) {
        super(props);
        this.state = {
            files: undefined,
        }
    }

    private onFilesChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        let upFiles:any[] = [];
        let {files} = evt.target;
        let len = files.length;
        for (let i=0; i<len; i++) {
            upFiles.push(files[i]);
        }
        this.setState({
            files: upFiles,
        });
    }
    fileRender(file:any, index:number):JSX.Element {
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
    private fileClick = (file:any) => {
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

    private async upload() {
        var files:FileList = this.fileInput.files;
        var data = new FormData();
        let len = files.length;
        for (let i=0; i<len; i++) {
            let file = files[i];
            data.append('files[]', file, file.name);
        }
  
        let url = store.uqServer + 'uq-compile/' + this.props.uq.id + '/upload';
        /*
        let actionName:string;
        if (thoroughly === true) {
            actionName = thoroughlyUpload;
            url += '-thoroughly';
        }
        else {
            actionName = fastUpload;
        }
        */
        try {
            let abortController = new AbortController();
            let res = await fetch(url, {
                method: "POST",
                body: data,
                signal: abortController.signal,
            });
            nav.push(<CompileResult {...this.props} 
                actionName="上传" 
                action="upload"
                res={res} abortController={abortController} />);
        }
        catch (e) {
            console.error('%s %s', url, e);
        }
    }
    private onUpload = async () => {
        nav.ceaseTop();
        await this.upload();
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
                <button className="btn btn-success" type="submit" onClick={this.onUpload}>提交</button>
            </div>;
        }
        return <Page header={'测试 - ' + this.props.uq.name}>
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

interface Options {
    action: 'test' | 'deploy';
    caption: string;
    fast: string;
    thoroughly: string;
    description: any;
}
const test:Options = {
    action: 'test',
    caption: '测试',
    fast: '快速测试',
    thoroughly: '完全测试',
    description: <>
        <li>用上传的UQ代码，生成测试数据库</li>
        <li>优化测试快速比较代码，仅仅根据修改代码的部分修改数据库</li>
        <li>彻底测试仅用于底层代码有突破性变化时</li>
    </>
}

const deploy:Options = {
    action: 'deploy',
    caption: '发布',
    fast: '快速发布',
    thoroughly: '完全发布',
    description: <>
        <li>将已经编译测试过的代码，发布到生产服务器</li>
        <li>优化发布快速比较代码，仅仅对修改代码的部分发布</li>
        <li>彻底发布仅用于底层代码有突破性变化时</li>
    </>
}

export class UqDeploy extends React.Component<UqActionProps> {
    readonly options: Options;
    constructor(props: UqActionProps) {
        super(props);
        switch (props.action) {
            case 'test':
                this.options = test;
                break;
            case 'deploy':
                this.options = deploy;
                break;
        }
    }

    private onCompile = async () => {
        nav.ceaseTop();
        let thoroughly = false;
        await this.compile(thoroughly);
    }
    private onCompileThoroughly = async () => {
        nav.ceaseTop();
        let thoroughly = true;
        await this.compile(thoroughly);
    }
    private async compile(isThoroughly:boolean) {
        let {action, thoroughly, fast} = this.options;
        let url = store.uqServer + 'uq-compile/' + this.props.uq.id + '/' + action;
        let actionName:string;
        if (isThoroughly === true) {
            actionName = thoroughly;
            url += '-thoroughly';
        }
        else {
            actionName = fast;
        }
        try {
            let abortController = new AbortController();
            let res = await fetch(url, {
                method: "POST",
                signal: abortController.signal,
            });
            nav.push(<CompileResult {...this.props} 
                action={action}
                actionName={actionName}
                res={res} abortController={abortController} />);
        }
        catch (e) {
            console.error('%s %s', url, e);
        }
    }
    render() {
        let {caption, fast, thoroughly, description} = this.options;
        return <Page header={caption + ' - ' + this.props.uq.name}>
            <div className="m-3 bg-white p-3">
                <ul className="my-3">{description}</ul>
                <div className="d-flex p-3">
                    <button className="btn btn-success" type="submit" onClick={this.onCompile}>{fast}</button>
                    <div className="py-2 flex-grow-1" />
                    <button className="btn btn-outline-warning"
                        type="submit" onClick={this.onCompileThoroughly}>{thoroughly}</button>
                </div>
            </div>
        </Page>;
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

interface CompileResultProps extends UqActionProps {
    uq: DevModel.UQ;
    action: 'upload' | 'test' | 'deploy';
    actionName: string;
    res: Response;
    abortController: AbortController;
}

@observer
export class CompileResult extends React.Component<CompileResultProps> {
    private resultSections: ResultSections;
    private timeHandler:any;
    constructor(props:CompileResultProps) {
        super(props);
        this.resultSections = new ResultSections();
    }
    componentWillMount() {
        nav.regConfirmClose(async ():Promise<boolean>=>{
            if (this.resultSections.seconds>=0) return true;
            return new Promise<boolean>((resolve, reject) => {
                try {
                    if (confirm(`正在${this.props.actionName}中，真的要中止吗？`) === true) {
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
    private startAutoScrollToBottom() {
        this.timeHandler = setInterval(() => {
            var pane = document.getElementById('bottomDiv');
            pane && pane.scrollIntoView();
        }, 100);
    }
    private endAutoScrollToBottom() {
        setTimeout(()=>{
            clearInterval(this.timeHandler);
        }, 300);
    }
    private getParent(el:HTMLElement):HTMLElement {
        if (!el) return;
        if (el.tagName === 'MAIN') return el;
        return this.getParent(el.parentElement);
    }
    private topIntoView() {
        var pane = document.getElementById('topDiv');
        pane && pane.scrollIntoView();
    }
    private bottomIntoView() {
        var pane = document.getElementById('bottomDiv');
        pane && pane.scrollIntoView();
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
            let total = 0;
            return new Promise(async (resolve, reject) => {
                async function pump() {
                    let ret = await reader.read();
                    let {done, value} = ret;
                    try {
                        function uintToString(uintArray:number[]):string {
                            let encodedString = String.fromCharCode.apply(null, uintArray);
                            try {
                                return decodeURIComponent(escape(encodedString));
                            }
                            catch (err) {
                                return encodedString;
                            }
                        }        
                        if (done) {
                            that.resultSections.seconds = (new Date().getTime() - time.getTime());
                            let {action, services} = that.props;
                            let now = Date.now() / 1000;
                            for (let service of services) {
                                switch (action) {
                                    case 'test': service.compile_time = now; break;
                                    case 'deploy': service.deploy_time = now; break;
                                }
                            }
                            resolve();
                            return;
                        }
                        let text = uintToString(value);
                        that.resultSections.add(text);
                        total += value.byteLength;
                        await pump();
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                await pump();
            });
        }
        this.startAutoScrollToBottom();
        try {
            await consume(this.props.res.body.getReader());
        }
        catch (err) {
            console.error(err);
        }
        finally {
            this.endAutoScrollToBottom();
        }
    }
    private renderText = (section:Section, index:number):JSX.Element => {
        return <section.render key={index} />;
    }
    render() {
        let {uq, actionName} = this.props;
        let {seconds, sections, hasError} = this.resultSections;
        let finish = hasError === true? '发生错误' : '完成';
        let header = actionName + (seconds>=0? finish : "中...");
        if (uq !== undefined) header = uq.name + ' - ' + header;
        return <Page header={header} back="close">
            <div id='topDiv' />
            <div id='scrollDiv'
                onDoubleClick={this.doubleClick} 
                className='py-2 px-3' 
                style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>
                {sections.map(this.renderText)}
            </div>
            {seconds>=0? <div className='px-3 pb-3' style={{color: 'red', fontWeight: 'bold'}}>
                {actionName}完成。共计用时{Math.floor(seconds/1000)}秒
            </div> : undefined}
            <div id='bottomDiv' />
        </Page>;
    }
}