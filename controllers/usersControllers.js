import db from "../db.js";
// import sqlstring from "sqlstring";
import Joi from "joi";

//app.get('/users/:id',
export async function getUsers (req, res) {
    const id = req.params.id;
    const authorization = req.headers.authorization;
    try {
        const UserDb = await db.query(`SELECT "userId" FROM "sessions"
            WHERE sessions.token = '${authorization}'
        `);
        if (UserDb.rows.length == 0) return res.sendStatus(401);
        const dados = await db.query(`SELECT users.name, SUM("shortUrl".views) as views 
                FROM users
                JOIN "shortUrl" ON users.id = "shortUrl"."userId"
                WHERE users.id = ${id}
                GROUP BY users.name
            `);
        if (dados.rows.length == 0) return res.sendStatus(404);
        const shortenedUrls = await db.query(`SELECT id, short as "shortUrl", url, views as "visitCount" 
                FROM "shortUrl"
                WHERE "userId" = '${id}' 
            `);

        res.status(200).send({
            "id": id,
            "name": dados.rows[0].name,
            "visitCount": dados.rows[0].views,
            "shortenedUrls": shortenedUrls.rows
        });
    } catch {
        res.sendStatus(500);
    }
}

//app.get('/ranking',
export async function getRanking(req, res) {
    try {
        const dados = await db.query(`SELECT users.id, users.name,
                COUNT("shortUrl".id) as "linksCount", 
                SUM("shortUrl".views) as "visitCount" 
                FROM users
                JOIN "shortUrl" ON users.id = "shortUrl"."userId"
                GROUP BY users.id
                ORDER BY "visitCount" DESC
                LIMIT 10
            `);
       
        res.status(200).send(dados.rows);
    } catch {
        res.sendStatus(500);
    }
}