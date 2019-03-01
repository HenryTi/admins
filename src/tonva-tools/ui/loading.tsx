import * as React from 'react';

export function Loading() {
    return <div className="d-flex h-100 align-items-center justify-content-center">
        <i className="fa fa-spinner fa-spin fa-2x fa-fw text-info" />
    </div>;
}

/*
export function Loading() {
    return <div style={{height:'100%'}} className="d-flex flex-fill align-items-center justify-content-center">
    <div className="d-flex align-items-center justify-content-center slide text-info" style={{width:'5em', height:'2em'}}>
        加载中...
    </div>
    </div>
}
*/


