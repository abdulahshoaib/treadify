import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const config: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER || "localhost",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
}

// lazy connection
let pool: sql.ConnectionPool | null = null

export const poolPromise = async () => {
    if (!pool) {
        pool = await new sql.ConnectionPool(config).connect();
        console.log("[DATABASE] Connected");
    }
    return pool;
};
