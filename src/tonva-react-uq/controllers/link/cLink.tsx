import * as React from 'react';
import classNames from 'classnames';
import { Controller } from 'tonva-tools';

export abstract class Link {
    abstract onClick: () => void;
    abstract render(className?:string):JSX.Element;
}

export class CLink extends Link {
    private controller: Controller;
    protected icon:string|JSX.Element;
    protected label:string|JSX.Element;

    constructor(controller:Controller) {
        super();
        this.controller = controller;
        this.icon = controller.icon;
        this.label = controller.label;
    }

    onClick = async () => {
        await this.controller.start();
    }

    render(className?:string) {
        return <div
            className={classNames('px-3', 'py-2', 'align-items-center', 'cursor-pointer', className)}
            onClick={this.onClick}>
            {this.icon} &nbsp; {this.label}
        </div>;
        //return React.createElement(this.view, className);
    }
}
