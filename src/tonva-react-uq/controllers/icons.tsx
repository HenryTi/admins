import React from 'react';
import { FA } from "tonva-react-form";

function icon(className:string, name:string) {
    return <FA className={className} name={name} fixWidth={true} />;
}
/*
export interface EntityRes {
    caption: string;
    icon: JSX.Element;
}
*/

export const entityIcons:{[type:string]:JSX.Element} = {
    tuid: icon('text-info', 'list-alt'),
    action: icon('text-info', 'hand-o-right'),
    map: icon('text-muted', 'list-ul'),
    book: icon('text-muted', 'book'),
    query: icon('text-warning', 'search'),
    history: icon('text-info', 'hand-o-right'),
    pending: icon('text-info', 'forward'),
    sheet: icon('text-primary', 'wpforms'),
};
