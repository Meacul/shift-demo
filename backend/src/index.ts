import config from "./config";
import { shutdownPostgres } from "./dataSources/postgres";
import { apolloServer } from "./graphql/apolloServer";
import { startStandaloneServer } from '@apollo/server/standalone';


startStandaloneServer(apolloServer, {
    listen: { port: config.port }
}).then(() => {
    console.log(`Server ready at http://localhost:${config.port}/graphql`);
});

// Handle graceful shutdown
const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    if (apolloServer) {
        await apolloServer.stop();
    }
    await shutdownPostgres();
    process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
