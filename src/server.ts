import { application } from './app';

export class Server {
    public static async run() {
        const app = await application();

        // Run the server.
        const port = process.env.PORT || 3001;
        app.listen(port, async () => {
            console.info(`Server is listing at http://localhost:${port}`);
        });
    }
}

Server.run();
