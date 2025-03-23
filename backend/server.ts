import express from "express"
import session from "express-session"
import https from "https"
import bcrypt from "bcrypt"
import fs from "fs"
import dotenv from "dotenv"

import { query } from "./db"

declare module "express-session" {
    interface SessionData {
        User: {
            id: number
            username: string
            email: string
        }
    }
}
const app = express()
const port = 3000

dotenv.config()

const keypath: string | undefined = process.env.KEY_PEM
const certpath: string | undefined = process.env.CERT_PEM
const secret: string | undefined = process.env.SECRET

if (!keypath || !certpath || !secret) {
    console.error("Missing Environment Variables.");
    process.exit(1);
}

const options = {
    key: fs.readFileSync(keypath),
    cert: fs.readFileSync(certpath)
}

app.use(express.json())
app.use(
    session({
        secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production", // true only in production
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 12, //valid for 12 hours
        },
    })
)

// post new user
app.post("/signup", async (req, res) => {
    try {
        const { username, email, pass } = req.body

        if (!username || !email || !pass)
            res.status(400).json({ error: "Invalid Input" })

        // hash the password
        const hash = await bcrypt.hash(pass, 10)

        const dbInsert = `
            INSERT INTO Users (Username, Email, Pass)
            VALUES ('${username}', '${email}', '${hash}')
        `
        await query(dbInsert);
        console.log("[POST] " + req.url)
        res.status(201).json({ message: "User Created" })

    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

app.post("/login", async (req, res) => {
    try {
        const { username, pass } = req.body

        if (!username || !pass)
            res.status(400).json({ error: "Invalid Input" })

        const dbQuery = `
            SELECT Pass FROM Users
            WHERE Username = '${username}'
        `
        const user = await query(dbQuery)

        if (user.length == 0)
            res.status(401).json({ error: "No User Found" })

        const validPassword = await bcrypt.compare(pass, user[0].Pass)

        if (!validPassword)
            res.status(401).json({ error: "Invalid Password" })

        // create a session
        req.session.User = {
            id: user[0].id,
            username: user[0].Username,
            email: user[0].Email,
        }
        res.status(200).json({ message: "Login Successful" })

    } catch (err: any) {
        console.log(err.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// middleware added
app.get("/dashboard", (req, res) => {
    if (!req.session.User)
        res.status(401).json({ error: "Unauthorized Access" })
    res.status(200).json({ message: "Welcome to dashboard" })
})

https.createServer(options, app).listen(port, () => {
    console.log(`[SERVER] server running at ${port}`)
})
