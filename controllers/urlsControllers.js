import db from "../db.js";
import { nanoid } from "nanoid";
// import sqlstring from "sqlstring";
import Joi from "joi";

//app.post('/urls/shorten', 
export async function postShorten (req, res) {
    const authorization = req.headers.authorization;
    const { url } = req.body;
    try {
        const UserDb = await db.query(`SELECT "userId" FROM "sessions"
            WHERE sessions.token = '${authorization}'
        `);
        if (UserDb.rows.length == 0) return res.sendStatus(401);
        const validation = Joi.string().uri().required().validate(url);
        if (validation.error) {
            return res.status(422).send(validation.error.details.map((e) => e.message));
        }
        const short = nanoid(10);
        await db.query(`INSERT INTO "shortUrl" ("userId", url, short, "createdAt") 
                VALUES (${UserDb.rows[0].userId}, '${url}', '${short}', TO_DATE('${new Date().toISOString()}', 'YYYY/MM/DD'))
            `);
        res.status(200).send({ "shortUrl" : short });
    } catch {
        res.sendStatus(500);
    }
}
//app.get('/urls/:id', 
export async function getUrls (req, res) {
    const id = req.params.id;
    try {
        const shortUrl = await db.query(`SELECT url, short FROM "shortUrl"
                WHERE id = ${id}
            `);
        if (shortUrl.rows.length == 0) return res.sendStatus(404);
        res.status(200).send({
            "id": id,
            "shortUrl": shortUrl.rows[0].short,
            "url": shortUrl.rows[0].url
        })
    } catch {
        res.sendStatus(500);
    }
}
//app.get('/urls/open/:shortUrl', 
export async function getUrlsOpen (req, res) {
    const short = req.params.shortUrl;
    try {
        const shortUrl = await db.query(`SELECT url, "views" FROM "shortUrl"
                WHERE short = '${short}'
            `);
        if (shortUrl.rows.length == 0) return res.sendStatus(404);
        await db.query(`UPDATE "shortUrl" SET
            "views" = ${shortUrl.rows[0].views + 1}
            WHERE short = '${short}'
        `);
        res.status(200).redirect(shortUrl.rows[0].url);
    } catch {
        res.sendStatus(500);
    }
}
//app.delete('/urls/:id', 
export async function deleteUrls (req, res) {
    const id = req.params.id;
    const authorization = req.headers.authorization;
    try {
        const UserDb = await db.query(`SELECT sessions."userId" FROM sessions
                JOIN "shortUrl" ON sessions."userId" = "shortUrl"."userId"
                WHERE sessions.token = '${authorization}' 
                AND "shortUrl".id = ${id}
            `);
        const UserId = await db.query(`SELECT "userId" FROM "shortUrl"
                WHERE id = '${id}' 
            `);
        if (UserId.rows.length == 0) return res.sendStatus(404);
        if (UserDb.rows.length == 0) return res.sendStatus(401);
        await db.query(`DELETE FROM "shortUrl"
                WHERE "userId" = ${UserDb.rows[0].userId} 
                AND id = ${id}
            `);
        res.sendStatus(204);
    } catch {
        res.sendStatus(500);
    }
}
