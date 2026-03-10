import { configDotenv } from "dotenv";
import path from "node:path";

configDotenv({
    path: [path.join(__dirname, "..", "..", ".env"), path.join(__dirname, "..", "..", ".env.local")],
    override: true,
    debug: true,
});

type Config = {
    port: number | undefined;
    databaseUrl: string | undefined;
    databasePort: number | undefined;
    databaseUser: string | undefined;
    databaseName: string | undefined;
    databasePassword: string | undefined;
}

const config: Config = {
    port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    databaseUrl: process.env.DATABASE_URL,
    databasePort: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : undefined,
    databaseUser: process.env.DATABASE_USER,
    databaseName: process.env.DATABASE_NAME,
    databasePassword: process.env.DATABASE_PASSWORD
};

for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
        console.error(`Error: Environment variable ${key} is not set.`);
        process.exit(1);
    }
}

export default config;
