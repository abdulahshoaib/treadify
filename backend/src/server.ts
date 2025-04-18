import express from "express"
import session from "express-session"
import dotenv from "dotenv"
import cors from "cors"

import Routes from "./routes/routes.ts"

declare module "express-session" {
    interface SessionData {
        User: {
            id: number
            username: string
            email: string
            feature: number | null
            product: number | null
            channel: number | null
            role: string
        }
    }
}

const app = express()
const port = 5000

dotenv.config()

const secret: string | undefined = process.env.SECRET

if (!secret) {
    console.error("Missing Environment Variables.");
    process.exit(1);
}

app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(
    session({
        secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 12, //valid for 12 hours
        },
    })
)

app.use("/auth", Routes.authRoutes)
app.use("/user", Routes.userRoutes)
app.use("/productchannel", Routes.productRoutes)
app.use("/featurechannel", Routes.featureRoutes)
app.use("/progress", Routes.progressRoutes)
app.use("/messages", Routes.messageRoutes)


app.listen(port, () => {
    console.log(`[SERVER] server running at ${port}`)
})
