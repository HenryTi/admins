import { TextWidget } from './textWidget';
export class DateWidget extends TextWidget {
    constructor() {
        super(...arguments);
        this.inputType = 'date';
    }
}
export class DateTimeWidget extends TextWidget {
    constructor() {
        super(...arguments);
        this.inputType = 'datetime';
    }
}
export class TimeWidget extends TextWidget {
    constructor() {
        super(...arguments);
        this.inputType = 'time';
    }
}
export class MonthWidget extends TextWidget {
    constructor() {
        super(...arguments);
        this.inputType = 'month';
    }
}
//# sourceMappingURL=dateWidget.js.map