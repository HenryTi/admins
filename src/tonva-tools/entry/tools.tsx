import * as React from 'react';

const logo = require('../img/logo.svg');

export const tonvaTop = <div className="d-flex align-items-center">
    <img className="App-logo h-3c position-absolute" src={logo} />
    <div className="h3 flex-fill text-center"><span className="text-primary mr-3">同</span>
        <span className="text-danger">花</span>
    </div>
</div>;

interface Sender {
    type: string;
    caption: string;
    regex: RegExp;
}
const senders:Sender[] = [
    {type:'mobile', caption:'手机号', regex: /^[0-9]*$/},
    {type:'email', caption:'邮箱', regex: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/}
];

export function getSender(un: string):Sender {
    let sender = senders.find(v => v.regex.test(un) === true);
    return sender;
}