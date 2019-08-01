import * as React from 'react';
import { FA } from 'tonva';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const groupStart = '///++++++';
const groupEnd = '------///';

export abstract class Section {
    render: () => JSX.Element;
}

class StringSection extends Section {
    text: string;
    constructor(text:string) {super(); this.text = text}
    render = (): JSX.Element => {
        if (this.text.trim().length === 0) return null;
        let parts = this.text.split('\n');
        return <>{parts.map((v, i) => v.length === 0?
            <div key={i}>&nbsp;</div> :
            <div key={i}>{v}</div>
        )}</>;
    }
}

class GroupSection extends Section {
    group: string[];
    @observable collaps: boolean;
    constructor(group:string[]) {
        super(); 
        this.group = group;
        this.collaps = true;
    }
    render = observer(():JSX.Element => {
        //let groupId = 'text-group-' + index;
        let line = this.group[0];
        let title: string;
        let p0 = 0, p = line.indexOf('\n');
        if (p < 0) p = undefined;
        else {
            let l = line.indexOf('(');
            if (l < p) p = l;
        }
        title = line.substring(p0, p);

        let onClick = () => {
            let c = this.collaps;
            if (c === false) c = true;
            else c = false;
            this.collaps = c;
            /*
            this.setState(prevState => ({
                collaps: {
                    ...prevState.collaps,
                    [index]: c,
                },
            }));*/
        }
        let titleIcon:any, content:any;
        if (this.collaps===false) {
            titleIcon = <FA name='arrow-circle-up' className='text-success' />;
            content = <div>
                {
                    this.group.map((v, i) => {
                        if (v.trim().length === 0) return null;
                        return <pre style={{whiteSpace: 'pre-wrap'}} key={i}>{v}</pre>
                    })
                }
            </div>;
        }
        else {
            titleIcon = <FA name='arrow-circle-down' className='text-success' />;
        }
        return <>
            <div className="cursor-pointer text-primary" onClick={onClick}>{titleIcon} <u>{title}</u></div>
            {content}
        </>;
    });
}

class ErrorSection extends Section {
    error: string[];
    constructor(error:string[]) {super(); this.error = error}
    render = ():JSX.Element => {
        return <div className="text-danger">
            <FA name="exclamation-circle" />&nbsp;
            {this.error.join().split('\n').map(v=><>{v}<br/></>)}
        </div>;
    }
}

export class ResultSections {
    private text: string;
    private p: number;
    private group: string[];
    private stop: boolean;
    @observable hasError: boolean = false;
    @observable seconds: number;
    //readonly sections: (string | string[])[] = [];
    @observable readonly sections: Section[] = [];

    add(text:string):void {
        this.stop = false;
        if (this.text === undefined) {
            this.p = 0;
            this.text = text;
        }
        else {
            this.text = this.text + text;
        }
        if (this.text.length < 10) return;
        while (this.stop === false) {
            this.addToGroup();
            this.addText();
        }
    }

    private mayStart(token:string):boolean {
        let len = this.text.length - token.length;
        if (this.p < len) return false;
        for (let i=0; i<len; i++) {
            if (this.text.charCodeAt(this.p + i) !== token.charCodeAt(i)) return false;
        }
        return true;
    }

    private parse():Section {
        let type: string = '';
        let len = this.group.length;
        for (let i=0; i<len; i++) {
            let ln = this.group[i];
            let pos = ln.indexOf('\n');
            if (pos < 0) {
                type += ln;
                continue;
            }
            type += ln.substr(0, pos);
            for (let s=0; s<i+1; s++) this.group.shift();
            this.group.unshift(ln.substr(pos+1));
            switch (type) {
                default:
                case '': 
                    return new GroupSection(this.group);
                case 'error': 
                    this.hasError = true;
                    return new ErrorSection(this.group);
            }            
        }
    }

    private addToGroup():void {
        if (this.group === undefined) return;
        if (this.text === undefined) return;
        let p = this.text.indexOf(groupEnd, this.p);
        if (p < 0) {
            if (this.mayStart(groupEnd) === true) return;
            this.group.push(this.p === 0? this.text : this.text.substr(this.p));
            this.p = 0;
            this.text = undefined;
            this.stop = true;
            return;
        }
        this.group.push(this.text.substring(this.p, p));
        this.sections.push(this.parse());
        this.group = undefined;
        this.p = p + 9;
    }

    private addText():void {
        if (this.text === undefined) return;
        let p = this.text.indexOf(groupStart, this.p);
        if (p < 0) {
            if (this.mayStart(groupStart) === true) return;
            this.sections.push(new StringSection(this.p === 0? this.text : this.text.substr(this.p)));
            this.p = 0;
            this.text = undefined;
            this.stop = true;
            return;
        }
        this.sections.push(new StringSection(this.text.substring(this.p, p)));
        this.p = p + 9;
        this.group = [];
    }
}
