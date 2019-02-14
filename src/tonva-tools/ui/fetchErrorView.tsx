import * as React from 'react';
import {FetchError} from '../fetchError';
import { refetchApi } from '../net';

export interface FetchErrorProps extends FetchError {
    clearError: ()=>void
}

export default class FetchErrorView extends React.Component<FetchErrorProps, null> {
    private reApi = async () => {
        this.props.clearError();
        const {channel, url, options, resolve, reject} = this.props;
        await refetchApi(channel, url, options, resolve, reject);
    }
    private close = async () => {
        this.props.clearError();
    }
    render() {
        let {error, url} = this.props;
            //let errMsg = fetchError.errorMsg;
        let errContent;
        if (typeof error === 'object') {
            let err = [];
            for (let i in error) {
                err.push(<li key={i}><label>{i}</label><div>{error[i]}</div></li>);
            }
            errContent = <ul>{err}</ul>;
        }
        else {
            errContent = <div>{error}</div>;
        }
        return <li>
            <article className="page-container">
                <section>
                    <div  className="va-error">
                        <div>网络出现问题</div>
                        <div>点击重新访问</div>
                        <div>url: {url}</div>
                        {errContent}
                        <div className="p-3">
                            <button type='button' onClick={this.reApi}>重新API</button>
                            <button type='button' onClick={this.close}>关闭</button>
                        </div>
                    </div>
                </section>
            </article>
        </li>;
    }
}
