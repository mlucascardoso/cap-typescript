import 'reflect-metadata';
import express from 'express';
import { createCombinedHandler } from 'cds-routing-handlers';
import cds from '@sap/cds';

export class Server {
    public static async run() {
        const app = express();

        const hdl = createCombinedHandler({
            handler: [__dirname + '/handlers/**/*.js'],
        });

        await cds.connect('db');
        await cds
            .serve('all')
            .in(app)
            .with((srv) => hdl(srv));

        // Run the server.
        const port = process.env.PORT || 3001;
        app.listen(port, async () => {
            console.info(`Server is listing at http://localhost:${port}`);
        });
    }
}

Server.run();
