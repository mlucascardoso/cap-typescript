import { Handler, AfterRead, Entities } from 'cds-routing-handlers';
import { BookshopService } from '@/entities/bookshop';

@Handler(BookshopService.SanitizedEntity.Books)
export class BookService {
    @AfterRead()
    public async addDiscount(@Entities() books: BookshopService.Books[]): Promise<void> {
        for (const book of books) {
            if (book.stock > 111) {
                book.title += ` -- 11% discount!`;
            }
        }
    }
}
