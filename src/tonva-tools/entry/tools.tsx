import * as React from 'react';
import { nav } from '../ui';

const logo = require('../img/logo.svg');

export function tonvaTop() {
    return nav.loginTop(<div className="d-flex align-items-center">
        <img className="App-logo h-3c position-absolute" src={logo} />
        <div className="h3 flex-fill text-center"><span className="text-primary mr-3">同</span>
            <span className="text-danger">花</span>
        </div>
    </div>);
}

interface Sender {
    type: string;
    caption: string;
    regex: RegExp;
}

const mobileRegex = /^[0-9]*$/;
const emailRegex = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
// /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
const senders:Sender[] = [
    {type:'mobile', caption:'手机号', regex: mobileRegex},
    {type:'email', caption:'邮箱', regex: emailRegex}
];

export function getSender(un: string):Sender {
    let sender = senders.find(v => v.regex.test(un) === true);
    return sender;
}