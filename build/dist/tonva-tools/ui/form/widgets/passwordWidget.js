import { TextWidget } from './textWidget';
export class PasswordWidget extends TextWidget {
    constructor() {
        super(...arguments);
        this.inputType = 'password';
    }
}
export class UrlWidget extends TextWidget {
    constructor() {
        super(...arguments);
        this.inputType = 'url';
    }
}
export class EmailWidget extends TextWidget {
    constructor() {
        super(...arguments);
        this.inputType = 'email';
    }
}
//# sourceMappingURL=passwordWidget.js.map