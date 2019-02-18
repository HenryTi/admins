import * as React from 'react';
import { TuidMain, Book, Entity } from '../../entities';
import { Page } from 'tonva-tools';
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
