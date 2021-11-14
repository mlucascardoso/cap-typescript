using {bookshop} from '../db/cds/bookshop';

service BookshopService {
    @readonly
    entity ListOfBooks as projection on Books excluding {
        descr
    };

    /**
     * For display in details pages
     */
    @readonly
    entity Books as projection on bookshop.Books {
        * ,
        author.name as author
    } excluding {
        createdBy,
        modifiedBy
    };

    action submitOrder(book : Books:id, quantity : Integer) returns {
        stock: Integer
    };

    event OrderedBook: {
        book: Books:id;
        quantity: Integer;
        buyer: String
    };
}
