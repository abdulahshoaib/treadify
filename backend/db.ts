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
        encrypt: true,
        trustServerCertificate: false
    }
}

const pool = new sql.ConnectionPool(config)

const poolPromise = pool.connect()
    .then(() => {
        console.log("Connected to DB")
        return pool
    })
    .catch((err: Error) => {
        console.error(err)
        throw err
    })

// function to query the DB
const query = async (dbQuery: string) => {
    try {
        const pool = await poolPromise
        const res = await pool.request().query(dbQuery);
        return res.recordset
    } catch (err: any) {
        console.error(err)
        throw err;
    }
}

export { poolPromise, query, sql }
