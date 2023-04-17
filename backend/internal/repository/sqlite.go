package repository

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

const (
	userTable = `CREATE TABLE IF NOT EXISTS user(
		userId  INTEGER PRIMARY KEY AUTOINCREMENT,
		email text UNIQUE
		username TEXT UNIQUE,
		age INTEGER NOT NULL,
		gender text,
		firstname text,
		lastname text,
		password text, 	
		-- token TEXT ,
		-- expiresAt DATETIME
);`
	userAvatar = `CREATE TABLE IF NOT EXISTS user_avatar(
	avatarId INTEGER PRIMARY KEY AUTOINCREMENT,
	userId INTEGER UNIQUE,
	base  TEXT,
	FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE
);`
	userSession = `CREATE TABLE IF NOT EXISTS user_sessions(
  token TEXT PRIMARY KEY,
  expiresAt TEXT,
  userId INTEGER,
  FOREIGN KEY (userId) REFERENCES user(userId)
);`
	postTable = `CREATE TABLE IF NOT EXISTS posts(
		postId INTEGER PRIMARY KEY AUTOINCREMENT,
		author REFERENCES user(username),
		title text UNIQUE,
		content text,
		like INTEGER DEFAULT 0,
		dislike INTEGER DEFAULT 0,
		creationDate TEXT,
		category_id INTEGER,
		ImageName TEXT DEFAULT NULL,
		ImageBase TEXT DEFAULT NULL,
		FOREIGN KEY (category_id) REFERENCES posts_category(category_id)
);`
	postCategory = `CREATE TABLE IF NOT EXISTS posts_category(
    	category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
		category_name TEXT UNIQUE
);`
	commentsTable = `CREATE TABLE IF NOT EXISTS comments(
	commentsId INTEGER PRIMARY KEY AUTOINCREMENT,
	postId INTEGER,
	author TEXT,
	content TEXT,
	like INTEGER DEFAULT 0,
	dislike INTEGER DEFAULT 0,
	creationDate TEXT DEFAULT NULL,
	FOREIGN KEY (postId)  REFERENCES posts(postId) ON DELETE CASCADE
);`
	likesPostTable = `CREATE TABLE IF NOT EXISTS likesPost(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	userId INTEGER,
	postId INTEGER,
	like1 INT,
	FOREIGN KEY (postId) REFERENCES posts(postId) ON DELETE CASCADE
);`
	likesCommentTable = `CREATE TABLE IF NOT EXISTS likesComment(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	userId INTEGER,
	commentsId INTEGER,
	like1 INT,
	FOREIGN KEY (commentsId) REFERENCES comments(commentsId) ON DELETE CASCADE
);`
)

type ConfigDB struct {
	Driver string
	Path   string
	Name   string
}

func NewConfigDB() *ConfigDB {
	return &ConfigDB{
		Driver: "sqlite3",
		Name:   "realtimeforum.db",
	}
}

func InitDB(c *ConfigDB) (*sql.DB, error) {
	db, err := sql.Open(c.Driver, c.Name)
	if err != nil {
		logrus.Println("error initializing DB: %s", err.Error())
		return nil, err
	}
	if err := db.Ping(); err != nil {
		logrus.Println("error initializing DB: %s", err.Error())
		return nil, err
	}
	return db, nil
}
func CreateTables(db *sql.DB) error {
	tables := []string{userTable, userAvatar, userSession, postTable, postCategory, commentsTable, likesPostTable, likeCommentTable}
	for _, table := range tables {
		_, err := db.Exec(table)
		if err != nil {
			return fmt.Errorf("repository -> create tables: %w", err)
		}
	}
	return nil
}
