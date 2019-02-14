import * as React from 'react';

const iconStyle=(color?:string) => { 
    return {
        color:color || '#7f7fff',
        margin:'6px 0'
    }
};
export const rowIcon=(name:string, color?:string) => 
    <i style={iconStyle(color)} className={'fa fa-lg fa-' + name} />;
