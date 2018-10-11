import * as React from 'react';
import { TuidUI } from "tonva-react-usql";

const ui:TuidUI = {
    divs: {
        post: {
            inputContent: (item:any) => {
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
