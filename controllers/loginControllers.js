import db from "../db.js";
import bcrypt from "bcrypt"
import { v4 as uuid } from 'uuid';
// import sqlstring from "sqlstring";
import Joi from "joi";

//app.post('/signup',
export async function signup (req, res) {
    const { name, email, password } = req.body;
    const authSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref("password")).required()
    });
    const validation = authSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        return res.status(422).send(validation.error.details.map((e) => e.message));
    }
    delete req.body.confirmPassword;
    try {
        await db.query(`INSERT INTO users (name, email, password) 
                VALUES ('${name}', '${email}', '${bcrypt.hashSync(password, 10)}')
            `);
        res.status(201).send('ok');
    } catch {
        res.sendStatus(409);
    }
}
//app.post('/signin',
export async function signin (req, res) {
    const {email, password} = req.body;

    const authSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    const validation = authSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
      return res.status(422).send(validation.error.details.map((e) => e.message));
    }
    try {
        const UserDb = await db.query(`SELECT id, password FROM "users"
            WHERE users.email = '${email}'
        `);
        if(UserDb.rows.length == 0 || !bcrypt.compareSync(password, UserDb.rows[0].password)) 
            return res.sendStatus(401);
        const tokenIds = await db.query(`SELECT sessions.id as "tokenId"
        FROM "users"
        JOIN "sessions" 
                ON sessions."userId" = users.id
                WHERE users.email = '${email}' 
                AND sessions."statusActive" = true
            `);
        const token = uuid();

        if (!tokenIds.rows.length == 0) {
            await db.query(`UPDATE sessions SET
                "statusActive" = false
                WHERE id = ${tokenIds.rows[0].tokenId}
            `);
        }

        await db.query(`INSERT INTO "sessions" ("userId", token) 
                VALUES (${UserDb.rows[0].id}, '${token}')
            `);
        res.status(200).send(token);
    } catch {
        res.sendStatus(500);
    }
}