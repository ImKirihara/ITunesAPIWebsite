CREATE TABLE users (
    userid TEXT PRIMARY KEY NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

CREATE TABLE playlist (  
    userid TEXT NOT NULL REFERENCES users(userid),
    artist TEXT NOT NULL,
    title TEXT NOT NULL,
    artwork TEXT NOT NULL,
    trackId INTEGER NOT NULL
);

INSERT INTO Users (userid, password, role) VALUES ('EMolina', 'Lol123', 'admin');
