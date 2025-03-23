import sql from 'mssql'

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
        trustedConnection: true,
        encrypt: true,
        trustServerCertificate: true
    }
}

const pool = new sql.ConnectionPool(config)

const poolPromise = pool.connect()
    .then(() => {
        console.log("[DATABASE] Connected")
        return pool
    })
    .catch((err: Error) => {
        console.error(err.message)
        throw err
    })

// function to query the DB
const query = async (dbQuery: string) => {
    try {
        const pool = await poolPromise
        const res = await pool.request().query(dbQuery);
        return res.recordset
    } catch (err: any) {
        throw err;
    }
}

export { query }
