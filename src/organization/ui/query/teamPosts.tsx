import * as React from 'react';
import { QueryUI } from "tonva-react-usql";
import { observer } from 'mobx-react';

const ui:QueryUI = {
    row: observer((item:any) => {
        let {post} = item;
        return <div className="px-3 py-2">{post.content()}</div>;
    }),
};

export default ui;
