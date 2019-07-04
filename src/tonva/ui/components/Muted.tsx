import * as React from 'react';
import * as classNames from 'classnames';

export const Muted = (props:any) => 
<small className={classNames('text-muted', props.className)} style={props.style}>
    {props.children}
</small>;
