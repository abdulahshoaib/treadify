import express from "express"
import { query } from "./db"

const app = express()
const port = 3000

app.get("/users", async (res, req) => {
    try {
        const dbQuery = "SELECT * FROM Users"
        const users = await query(dbQuery)
        req.send(users)
        console.log(res.url)
    } catch (err: any) {
        console.error(err)
    }
})

app.listen(port, () => {
    console.log(`[SERVER]: server running at ${port}`)
})
