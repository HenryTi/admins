import * as React from 'react';
import { Book } from '../../uqs';
import { Page } from '../../../ui';
import { VEntity } from '../CVEntity';
import { CBook, BookUI } from './cBook';

export class VBookMain extends VEntity<Book, BookUI, CBook> {
    async open(param?:any):Promise<void> {
        this.openPage(this.view);
    }

    protected view = () => <Page header={this.label}>
        Book
    </Page>;
}
