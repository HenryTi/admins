import * as React from 'react';
import { TextWidget } from './textWidget';

export class PasswordWidget extends TextWidget {
    protected inputType = 'password';
}

export class UrlWidget extends TextWidget {
    protected inputType = 'url';
}

export class EmailWidget extends TextWidget {
    protected inputType = 'email';
}
