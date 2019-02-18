import { VIntField, VDecField, VStringField, VTextField, VDateTimeField } from './vField';
export function buildVField(form, field, fieldUI, fieldRes) {
    let vField;
    switch (field.type) {
        default: return;
        case 'tinyint':
        case 'smallint':
        case 'int':
            vField = VIntField;
            break;
        case 'bigint':
            let { _tuid } = field;
            if (_tuid !== undefined)
                return;
            vField = VIntField;
            break;
        case 'dec':
            vField = VDecField;
            break;
        case 'char':
            vField = VStringField;
            break;
        case 'text':
            vField = VTextField;
            break;
        case 'datetime':
            vField = VDateTimeField;
            break;
    }
    return new vField(form, field, fieldUI, fieldRes);
}
//# sourceMappingURL=buildVmField.js.map