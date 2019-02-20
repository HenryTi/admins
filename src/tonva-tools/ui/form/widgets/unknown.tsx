import * as React from 'react';
import { DataType } from '../../schema';
import { UiType } from '../../schema';

export const Unknown = (dataType:DataType, uiType:UiType, dataTypes:DataType[]) => {
    return <span className="text-danger">!!data type {dataType} only support {(dataTypes || []).join(', ')}, can't use ui {uiType}!!</span>;
};
