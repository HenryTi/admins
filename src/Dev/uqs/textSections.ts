const groupStart = '///++++++';
const groupEnd = '------///';

export class TextSections {
    private text: string;
    private p: number;
    private group: string[];
    private stop: boolean;
    readonly sections: (string | string[])[] = [];

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
        this.sections.push(this.group);
        this.group = undefined;
        this.p = p + 9;
    }

    private addText():void {
        if (this.text === undefined) return;
        let p = this.text.indexOf(groupStart, this.p);
        if (p < 0) {
            if (this.mayStart(groupStart) === true) return;
            this.sections.push(this.p === 0? this.text : this.text.substr(this.p));
            this.p = 0;
            this.text = undefined;
            this.stop = true;
            return;
        }
        this.sections.push(this.text.substring(this.p, p));
        this.p = p + 9;
        this.group = [];
    }
}
