import supertest from 'supertest';
import { application } from '../src/app';

let app = null;

describe('Books', () => {
    beforeAll(async () => {
        app = await application();
    });

    it('should return 200 if books were listed correctly', async () => {
        const api = supertest(app) as any;
        const response = await api.get('/bookshop/Books');
        expect(response.statusCode).toEqual(200);
    });

    afterEach((done) => {
        done();
    });
});
