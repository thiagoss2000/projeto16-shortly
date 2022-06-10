CREATE table "users"(
    "id" serial PRIMARY KEY,
    "name" text NOT NULL,
    "email" text UNIQUE NOT NULL,
    "password" text NOT NULL
)
SELECT * FROM "users"

CREATE table "sessions"(
    "id" serial PRIMARY KEY,
    "userId" integer REFERENCES "users"("id") NOT NULL,
    "token" text UNIQUE NOT NULL,
    "statusActive" boolean DEFAULT true 
)
SELECT * FROM "sessions" 

SELECT sessions.id FROM "users"
                JOIN "sessions" 
                ON sessions."userId" = users.id
                WHERE sessions."statusActive" = true
                
INSERT INTO "sessions" ("userId", token) 
                VALUES (1, '${token}')