CREATE table "users"(
    "id" serial PRIMARY KEY,
    "name" text NOT NULL,
    "email" text UNIQUE NOT NULL,
    "password" text NOT NULL
);

CREATE table "sessions"(
    "id" serial PRIMARY KEY,
    "userId" integer REFERENCES "users"("id") NOT NULL,
    "token" text UNIQUE NOT NULL,
    "statusActive" boolean DEFAULT true 
);                
                
CREATE table "shortUrl"(
    "id" serial PRIMARY KEY,
    "userId" integer REFERENCES "users"("id") NOT NULL,
    "url" text NOT NULL,
    "short" text NOT NULL,
    "views" integer DEFAULT 0,
    "createdAt" timestamp
);
