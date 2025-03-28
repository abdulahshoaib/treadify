import { poolPromise } from "./connection.ts";

export const query = async (dbQuery: string, params: any = {}) => {
    try {
        const pool = await poolPromise()
        const request = pool.request()

        for (const key in params) {
            request.input(key, params[key])
        }

        const res = await request.query(dbQuery)
        return res.recordset
    } catch (err: any) {
        console.error("[Query] ", err.message)
        throw err
    }
};

