import express, { json } from "express";
import cors from 'cors';
import loginRoutes from "./routes/loginRoutes.js";
import urlsRoutes from "./routes/urlsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(json())
app.use(cors())

app.use(loginRoutes)
app.use(urlsRoutes)
app.use(usersRoutes)

app.listen(process.env.PORT, () => {
    console.log("server on");
})