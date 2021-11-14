import cds from '@sap/cds';
import { Action, Handler, Param, Req } from 'cds-routing-handlers';
import { BookshopService, bookshop } from '@/entities/bookshop';
import { Request } from '@sap/cds/apis/services';

@Handler()
export class SubmitOrderHandler {
    @Action(BookshopService.ActionSubmitOrder.name)
    public async handle(
        @Param(BookshopService.ActionSubmitOrder.paramBook) bookId: bookshop.Books['id'],
        @Param(BookshopService.ActionSubmitOrder.paramQuantity) quantity: number,
        @Req() req: Request
    ): Promise<any> {
        if (!bookId || !quantity) {
            return req.reject(400, 'Please, provide all mandatory fields');
        }

        const affectedRows = await cds
            .update(BookshopService.Entity.Books)
            .with({ stock: { '-=': quantity } })
            .where({ id: bookId, stock: { '>=': quantity } });

        if (affectedRows < 0) {
            return req.reject(409, `${quantity} exceeds stock for book ${bookId}`);
        }
    }
}
