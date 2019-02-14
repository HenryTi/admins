import * as React from 'react';
import {Control, ControlBase} from './control';
import {FormView} from '../formView';

export class UnknownControl extends Control {
    renderControl():JSX.Element {
        return <div className="form-control-plaintext">
            <div className="alert alert-primary" role="alert">
            don't know how to create control<br/>
            field: {JSON.stringify(this.field)} must be object <br/>
            face: {JSON.stringify(this.face)} must be object <br/>
            </div>
        </div>;
    }
}

export class EmptyControl extends ControlBase {
    private element:JSX.Element;
    constructor(formView:FormView, element:JSX.Element) {
        super(formView);
        this.element = element;
    }
    renderControl():JSX.Element {
        return <div className="form-control-plaintext">
            {this.element}
        </div>;
    }
}
