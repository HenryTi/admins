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

export interface UqUploadProps {
    uq: DevModel.UQ;
    services: DevModel.Service[];
}

const fastUpload = '快速测试';
const thoroughlyUpload = '完全测试';
export class UqUpload extends React.Component<UqUploadProps, State> {
    private fileInput: HTMLInputElement;

    constructor(props:UqUploadProps) {
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

    private async update(thoroughly:boolean) {
        var files:FileList = this.fileInput.files;
        var data = new FormData();
        let len = files.length;
        for (let i=0; i<len; i++) {
            let file = files[i];
            data.append('files[]', file, file.name);
        }
  
        let url = store.uqServer + 'uq-compile/' + this.props.uq.id + '/update';
        let actionName:string;
        if (thoroughly === true) {
            actionName = thoroughlyUpload;
            url += '-thoroughly';
        }
        else {
            actionName = fastUpload;
        }
        try {
            let abortController = new AbortController();
            let res = await fetch(url, {
                method: "POST",
                body: data,
                signal: abortController.signal,
            });
            nav.push(<CompileResult {...this.props} 
                actionName={actionName} 
                uploadOrDeploy="upload"
                res={res} abortController={abortController} />);
        }
        catch (e) {
            console.error('%s %s', url, e);
        }
    }
    private onUpdate = async () => {
        nav.ceaseTop();
        let thoroughly = false;
        await this.update(thoroughly);
    }
    private onUpdateThoroughly = async () => {
        nav.ceaseTop();
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
                <button className="btn btn-success" type="submit" onClick={this.onUpdate}>{fastUpload}</button>
                <div className="py-2 flex-grow-1" />
                <button className="btn btn-outline-warning"
                    type="submit" onClick={this.onUpdateThoroughly}>{thoroughlyUpload}</button>
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

const fastDeploy = '快速发布';
const thoroughlyDeploy = '完全发布';
export class UqDeploy extends React.Component<UqUploadProps> {
    private onDeploy = async () => {
        nav.ceaseTop();
        let thoroughly = false;
        await this.update(thoroughly);
    }
    private onDeployThoroughly = async () => {
        nav.ceaseTop();
        let thoroughly = true;
        await this.update(thoroughly);
    }
    private async update(thoroughly:boolean) {
        let url = store.uqServer + 'uq-compile/' + this.props.uq.id + '/deploy';
        let actionName:string;
        if (thoroughly === true) {
            actionName = thoroughlyDeploy;
            url += '-thoroughly';
        }
        else {
            actionName = fastDeploy;
        }
        try {
            let abortController = new AbortController();
            let res = await fetch(url, {
                method: "POST",
                signal: abortController.signal,
            });
            nav.push(<CompileResult {...this.props} 
                actionName={actionName}
                uploadOrDeploy="deploy"
                res={res} abortController={abortController} />);
        }
        catch (e) {
            console.error('%s %s', url, e);
        }
    }
    render() {
        return <Page header={'发布 - ' + this.props.uq.name}>
            <div className="m-3 bg-white p-3">
                <ul className="my-3">
                    <li>将已经编译测试过的代码，发布到生产服务器</li>
                    <li>优化发布快速比较代码，仅仅对修改代码的部分发布</li>
                    <li>彻底发布仅用于底层代码有突破性变化时</li>
                </ul>
                <div className="d-flex p-3">
                    <button className="btn btn-success" type="submit" onClick={this.onDeploy}>{fastDeploy}</button>
                    <div className="py-2 flex-grow-1" />
                    <button className="btn btn-outline-warning"
                        type="submit" onClick={this.onDeployThoroughly}>{thoroughlyDeploy}</button>
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

interface CompileResultProps extends UqUploadProps {
    uq: DevModel.UQ;
    actionName: string;
    res: Response;
    abortController: AbortController;
    uploadOrDeploy: 'upload' | 'deploy';
}
/*
interface CompileResultState {
    sections: Section[];
    seconds: number;
    collaps: {[index:number]: boolean};
}
*/
@observer
class CompileResult extends React.Component<CompileResultProps> {
    private resultSections: ResultSections;
    private timeHandler:any;
    constructor(props:CompileResultProps) {
        super(props);
        this.resultSections = new ResultSections();
        /*
        this.state = {
            sections: this.resultSections.sections,
            seconds: -1,
            collaps: {}
        }
        */
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
            /*
            if (pane !== undefined) {
                let childNodes = pane.childNodes;
                let last = childNodes.item(childNodes.length-1);
                (last as HTMLElement).scrollIntoView();
            }
            */
            //that.clearTimeHandler();
        }, 100);
    }
    private endAutoScrollToBottom() {
        setTimeout(()=>{
            clearInterval(this.timeHandler);
        }, 300);
    }
    /*
    private clearTimeHandler() {
        if (this.timeHandler !== undefined) {
            clearTimeout(this.timeHandler);
            this.timeHandler = undefined;
        }
    }*/
    private getParent(el:HTMLElement):HTMLElement {
        if (!el) return;
        if (el.tagName === 'MAIN') return el;
        return this.getParent(el.parentElement);
    }
    /*
    private scrollToBottom(defer:number = 100) {
        this.clearTimeHandler();
        let that = this;
        this.timeHandler = setTimeout(() => {
            var pane = document.getElementById('bottomDiv');
            pane && pane.scrollIntoView();
            that.clearTimeHandler();
        }, defer);
    }
    */
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
            let total = 0;
            return new Promise(async (resolve, reject) => {
                async function pump() {
                    let ret = await reader.read();
                    let {done, value} = ret;
                    try {
                    //.then(({done, value}) => {
                        function uintToString(uintArray:number[]):string {
                            let encodedString = String.fromCharCode.apply(null, uintArray);
                            try {
                                let decodedString = decodeURIComponent(escape(encodedString));
                                return decodedString;
                            }
                            catch {
                                return encodedString;
                            }
                        }        
                        if (done) {
                            // that.scrollToBottom();
                            /*
                            that.setState({
                                seconds: (new Date().getTime() - time.getTime()),
                            });
                            */
                            that.resultSections.seconds = (new Date().getTime() - time.getTime());
                            let {uploadOrDeploy, services} = that.props;
                            let now = Date.now() / 1000;
                            for (let service of services) {
                                switch (uploadOrDeploy) {
                                    case 'upload': service.compile_time = now; break;
                                    case 'deploy': service.deploy_time = now; break;
                                }
                            }
                            resolve();
                            return;
                        }
                        let text = uintToString(value);
                        that.resultSections.add(text);
                        /*
                        that.setState({
                            sections: that.resultSections.sections,
                        });
                        */
                        total += value.byteLength;
                        //that.scrollToBottom();
                        await pump();
                    }
                    catch (err) {
                        reject(err);
                    }
                    //}).catch(reject)
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
/*
        if (Array.isArray(section)) {
            let groupId = 'text-group-' + index;
            let line = section[0];
            let title: string;
            let p0 = line.indexOf('\n'), p:number;
            if (p0 === 0) {
                p0 = 1;
                p = line.indexOf('\n', p0);
            }
            else {
                p = line.indexOf('\n');
            }
            if (p < 0) p = undefined;
            else {
                let l = line.indexOf('(');
                if (l < p) p = l;
            }
            title = line.substring(p0, p);

            let onClick = () => {
                let c = this.state.collaps[index];
                if (c === false) c = true;
                else c = false;
                this.setState(prevState => ({
                    collaps: {
                        ...prevState.collaps,
                        [index]: c,
                    },
                }));
            }
            let titleIcon:any, content:any;
            if (this.state.collaps[index]===false) {
                titleIcon = <FA name='arrow-circle-up' className='text-success' />;
                content = <div>
                    {
                        section.map((v, i) => {
                            if (v.trim().length === 0) return null;
                            return <pre style={{whiteSpace: 'pre-wrap'}} key={index + '-' + i}>{v}</pre>
                        })
                    }
                </div>;
            }
            else {
                titleIcon = <FA name='arrow-circle-down' className='text-success' />;
            }
            return <React.Fragment key={index}>
                <div className="cursor-pointer text-primary" onClick={onClick}>{titleIcon} <u>{title}</u></div>
                {content}
            </React.Fragment>;
        }
        if (section.trim().length === 0) return null;
        let parts = section.split('\n');
        return <React.Fragment key={index}>
            {
                parts.map((v, i) => v.length === 0?
                    <div key={i}>&nbsp;</div> :
                    <div key={i}>{v}</div>
                )
            }
        </React.Fragment>;
*/
    }
    render() {
        let {uq, actionName} = this.props;
        let {seconds, sections, hasError} = this.resultSections;
        let finish = hasError === true? '发生错误' : '完成';
        let header = uq.name + ' - ' + actionName + (seconds>=0? finish : "中...");
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