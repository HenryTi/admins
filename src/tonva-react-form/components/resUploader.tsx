import * as React from 'react';

export interface ResUploaderProps {
    url: string;
    className?: string;
    multiple?: boolean;
    onFilesChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

export class ResUploader extends React.Component<ResUploaderProps> {
    private fileInput: HTMLInputElement;

    upload = async ():Promise<string> => {
        let {url} = this.props;
        var files:FileList = this.fileInput.files;
        var data = new FormData();
        let len = files.length;
        for (let i=0; i<len; i++) {
            let file = files[i];
            data.append('files[]', file, file.name);
        }
  
        try {
            let abortController = new AbortController();
            let res = await fetch(url, {
                method: "POST",
                body: data,
                signal: abortController.signal,
            });
            let json = await res.json();
            return ':' + json.res.id;
        }
        catch (err) {
            console.error('%s %s', url, err);
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
