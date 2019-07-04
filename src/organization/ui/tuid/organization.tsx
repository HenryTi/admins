import * as React from 'react';
import { TuidUI } from 'tonva';

const ui:TuidUI = {
    divs: {
        post: {
            content: (item:any) => {
                let {title} = item;
                return <>{title}</>;
            },
            rowContent: (item:any) => {
                let {title} = item;
                return <>{title}</>;
            }
        }
    }
}

export default ui;
