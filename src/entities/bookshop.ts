export namespace bookshop {
    export interface Authors extends Managed {
        id: string;
        name: string;
        dateOfBirth: Date;
        dateOfDeath: Date;
        placeOfBirth: string;
        placeOfDeath: string;
        books?: Books[];
    }

    export interface Books extends Managed {
        id: string;
        title: string;
        descr: string;
        author?: Authors;
        author_id?: string;
        genre?: Genres;
        genre_id?: string;
        stock: number;
        price: number;
        currency: sap.common.Currencies;
        currency_code?: string;
        image: Buffer;
    }

    export interface Genres extends sap.common.CodeList {
        id: string;
        parent?: Genres;
        parent_id?: string;
        children: Genres[];
    }

    export enum Entity {
        Authors = 'bookshop.Authors',
        Books = 'bookshop.Books',
        Genres = 'bookshop.Genres',
    }

    export enum SanitizedEntity {
        Authors = 'Authors',
        Books = 'Books',
        Genres = 'Genres',
    }
}

export namespace sap.common {
    export interface CodeList {
        name: string;
        descr: string;
    }

    export interface Countries extends sap.common.CodeList {
        code: string;
    }

    export interface Currencies extends sap.common.CodeList {
        code: string;
        symbol: string;
    }

    export interface Languages extends sap.common.CodeList {
        code: string;
    }

    export enum Entity {
        CodeList = 'sap.common.CodeList',
        Countries = 'sap.common.Countries',
        Currencies = 'sap.common.Currencies',
        Languages = 'sap.common.Languages',
    }

    export enum SanitizedEntity {
        CodeList = 'CodeList',
        Countries = 'Countries',
        Currencies = 'Currencies',
        Languages = 'Languages',
    }
}

export namespace BookshopService {
    export interface Books {
        createdAt?: Date;
        modifiedAt?: Date;
        id: string;
        title: string;
        descr: string;
        author: string;
        genre?: Genres;
        genre_id?: string;
        stock: number;
        price: number;
        currency: Currencies;
        currency_code?: string;
        image: Buffer;
    }

    export interface Currencies {
        name: string;
        descr: string;
        code: string;
        symbol: string;
    }

    export interface Genres {
        name: string;
        descr: string;
        id: string;
        parent?: Genres;
        parent_id?: string;
        children: Genres[];
    }

    export interface ListOfBooks {
        createdAt?: Date;
        modifiedAt?: Date;
        id: string;
        title: string;
        author: string;
        genre?: Genres;
        genre_id?: string;
        stock: number;
        price: number;
        currency: Currencies;
        currency_code?: string;
        image: Buffer;
    }

    export enum ActionSubmitOrder {
        name = 'submitOrder',
        paramBook = 'book',
        paramQuantity = 'quantity',
    }

    export interface ActionSubmitOrderParams {
        book: string;
        quantity: number;
    }

    export type ActionSubmitOrderReturn = unknown;

    export enum Entity {
        Books = 'BookshopService.Books',
        Currencies = 'BookshopService.Currencies',
        Genres = 'BookshopService.Genres',
        ListOfBooks = 'BookshopService.ListOfBooks',
    }

    export enum SanitizedEntity {
        Books = 'Books',
        Currencies = 'Currencies',
        Genres = 'Genres',
        ListOfBooks = 'ListOfBooks',
    }
}

export type User = string;

export interface Cuid {
    ID: string;
}

export interface Managed {
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
}

export interface Temporal {
    validFrom: Date;
    validTo: Date;
}

export enum Entity {
    Cuid = 'cuid',
    Managed = 'managed',
    Temporal = 'temporal',
}

export enum SanitizedEntity {
    Cuid = 'Cuid',
    Managed = 'Managed',
    Temporal = 'Temporal',
}
