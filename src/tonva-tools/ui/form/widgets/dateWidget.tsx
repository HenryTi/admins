import * as React from 'react';
import { TextWidget } from './textWidget';

export class DateWidget extends TextWidget {
    protected inputType = 'date';
}

export class DateTimeWidget extends TextWidget {
    protected inputType = 'datetime';
}

export class TimeWidget extends TextWidget {
    protected inputType = 'time';
}

export class MonthWidget extends TextWidget {
    protected inputType = 'month';
}
