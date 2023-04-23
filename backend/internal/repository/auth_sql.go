package repository

import (
	"database/sql"
	"time"

	"github.com/Bernar11296/realtime-forum/models"
)

type AuthRepo struct {
	db *sql.DB
}

func NewAuthRepo(db *sql.DB) *AuthRepo {
	return &AuthRepo{
		db: db,
	}
}

func (a *AuthRepo) CreateUser(User models.User) error {
	stmt, err := a.db.Prepare("INSERT INTO user(username, password,email, firstname, lastname, gender, age) values(?,?,?)")
	if err != nil {
		return err
	}
	if _, err := stmt.Exec(User.Username, User.Password, User.Email, User.FirstName, User.LastName, User.Gender, User.Age); err != nil {
		return err
	}
	return nil
}

func (a *AuthRepo) CheckUser(User models.User) (models.User, error) {
	var fullUser models.User
	query := `SELECT * FROM user WHERE username=$1 and password=$2`
	row := a.db.QueryRow(query, User.Username, User.Password)
	if err := row.Scan(&fullUser.ID, &fullUser.Email, &fullUser.Username, &fullUser.Password, &fullUser.FirstName, &fullUser.LastName, &fullUser.Age, &fullUser.Gender); err != nil {
		return fullUser, err
	}
	return fullUser, nil
}

func (a *AuthRepo) CheckUserByToken(token string) (models.User, error) {
	var fullUser models.User
	var id int
	var expiresAt string
	query := `SELECT userId,expiresAt FROM user_sessions WHERE token=$1`
	err := a.db.QueryRow(query, token).Scan(&id, &expiresAt)
	if err != nil {
		return fullUser, err
	}
	query1 := `SELECT userId, username, email FROM user WHERE userId=?`
	row := a.db.QueryRow(query1, id)
	if err := row.Scan(&fullUser.ID, &fullUser.Username, &fullUser.Email, &fullUser.FirstName, &fullUser.LastName, &fullUser.Age, &fullUser.Gender); err != nil {
		return fullUser, err
	}
	fullUser.TokenDuration, _ = time.Parse("01-02-2006 15:04:05", expiresAt)
	return fullUser, nil
}

func (a *AuthRepo) SaveToken(User models.User) error {
	stmt, err := a.db.Prepare(`INSERT INTO user_sessions(token, expiresAt,userId) values(?,?,?)`)
	if err != nil {
		return err
	}
	if _, err := stmt.Exec(User.Token, User.TokenDuration, User.ID); err != nil {
		return err
	}
	return nil
}

func (a *AuthRepo) DeleteToken(token string) error {
	query := `DELETE FROM user_sessions WHERE token=$1`
	_, err := a.db.Exec(query, token)
	if err != nil {
		return err
	}
	return nil
}

func (a *AuthRepo) DeleteTokenById(id int) {
	query := `DELETE FROM user_sessions WHERE userId=$1`
	a.db.Exec(query, id)
}

func (a *AuthRepo) GetAvatar(id int) (string, error) {
	var base string
	query1 := `SELECT base FROM user_avatar WHERE userId=?`
	row := a.db.QueryRow(query1, id)
	if err := row.Scan(&base); err != nil {
		return base, err
	}
	return base, nil
}

func (a *AuthRepo) UpdateAvatar(file string, id int) error {
	query := `UPDATE user_avatar SET base = $1 WHERE userId = $4`
	if _, err := a.db.Exec(query, file, id); err != nil {
		return err
	}
	return nil
}

func (a *AuthRepo) UploadAvatar(file string, id int) error {
	stmt, err := a.db.Prepare(`INSERT INTO user_avatar(userId, base) values(?,?)`)
	if err != nil {
		return err
	}
	if _, err := stmt.Exec(id, file); err != nil {
		return err
	}
	return nil
}

func (a *AuthRepo) GetUserInfo(userID int) (models.User, error) {
	var fullUser models.User
	query := `SELECT
		u.userId,
		u.username,
		u.email,
		COALESCE(ua.base, 'null') AS base,
		(SELECT COUNT(id) FROM likesPost WHERE userId = u.userId and like1 =1) as LikedPosts,
		(SELECT COUNT(postId) FROM posts WHERE author = u.username) as Myposts,
		COALESCE((SELECT SUM(like) FROM posts WHERE author = u.username), 0) as LikesOnMyPost
	FROM 
		user as u
	LEFT JOIN 
		user_avatar as ua
	ON 
		ua.userId = u.userId
	WHERE 
		u.userId = $1`
	row := a.db.QueryRow(query, userID)
	if err := row.Scan(&fullUser.ID, &fullUser.Email, &fullUser.Username, &fullUser.Age, &fullUser.Gender, &fullUser.FirstName, &fullUser.LastName, &fullUser.Avatar, &fullUser.LikedPosts, &fullUser.Myposts, &fullUser.LikesOnMyPost); err != nil {
		return fullUser, err
	}
	return fullUser, nil
}

func (a *AuthRepo) GetUserByEmail(email string) (models.User, error) {
	query := "SELECT * FROM user WHERE email = $1"
	row := a.db.QueryRow(query, email)
	var fullUser models.User
	err := row.Scan(&fullUser.ID, &fullUser.Email, &fullUser.Username, &fullUser.Age, &fullUser.Gender, &fullUser.FirstName, &fullUser.LastName, &fullUser.Password)
	if err != nil {
		return models.User{}, err
	}
	return fullUser, nil
}

func (a *AuthRepo) GetUserByUsername(username string) (models.User, error) {
	query := "SELECT * FROM user WHERE username = $1"
	row := a.db.QueryRow(query, username)
	var fullUser models.User
	err := row.Scan(&fullUser.ID, &fullUser.Email, &fullUser.Username, &fullUser.Age, &fullUser.Gender, &fullUser.FirstName, &fullUser.LastName, &fullUser.Password)
	if err != nil {
		return models.User{}, err
	}
	return fullUser, nil
}
