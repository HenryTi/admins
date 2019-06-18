var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
export class ResUploader extends React.Component {
    constructor() {
        super(...arguments);
        this.upload = () => __awaiter(this, void 0, void 0, function* () {
            let { url } = this.props;
            var files = this.fileInput.files;
            var data = new FormData();
            let len = files.length;
            for (let i = 0; i < len; i++) {
                let file = files[i];
                data.append('files[]', file, file.name);
            }
            try {
                let abortController = new AbortController();
                let res = yield fetch(url, {
                    method: "POST",
                    body: data,
                    signal: abortController.signal,
                });
                let json = yield res.json();
                return ':' + json.res.id;
            }
            catch (err) {
                console.error('%s %s', url, err);
            }
        });
    }
    render() {
        let { className, multiple, onFilesChange } = this.props;
        return React.createElement("input", { className: className, ref: t => this.fileInput = t, onChange: onFilesChange, type: 'file', name: 'file', multiple: multiple });
    }
}
//# sourceMappingURL=resUploader.js.map