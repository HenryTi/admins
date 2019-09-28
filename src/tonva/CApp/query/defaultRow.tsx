import React from 'react';
import { jsonStringify } from '../tools';

export const DefaultRow = (values:any) => <div className="px-3 py-2">{jsonStringify(values)}</div>;
