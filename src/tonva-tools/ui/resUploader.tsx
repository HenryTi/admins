import * as React from 'react';
import { nav } from './nav';

export interface ResUploaderProps {
    className?: string;
    multiple?: boolean;
    maxSize?: number;
    onFilesChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

export class ResUploader extends React.Component<ResUploaderProps> {
    private fileInput: HTMLInputElement;

    upload = async ():Promise<string> => {
        let {maxSize} = this.props;
        if (maxSize === undefined || maxSize <= 0) 
            maxSize = 100000000000;
        else
            maxSize = maxSize * 1024;
        let resUrl = nav.resUrl + 'upload';
        var files:FileList = this.fileInput.files;
        var data = new FormData();
        let len = files.length;
        for (let i=0; i<len; i++) {
            let file = files[i];
            if (file.size > maxSize) return null;
            data.append('files[]', file, file.name);
        }
  
        try {
            let abortController = new AbortController();
            let res = await fetch(resUrl, {
                method: "POST",
                body: data,
                signal: abortController.signal,
            });
            let json = await res.json();
            return ':' + json.res.id;
        }
        catch (err) {
            console.error('%s %s', resUrl, err);
        }
    }
    render() {
        let {className, multiple, onFilesChange} = this.props;
        return <input 
            className={className}
            ref={t=>this.fileInput=t} 
            onChange={onFilesChange}
            type='file' name='file' multiple={multiple} />
    }
}
