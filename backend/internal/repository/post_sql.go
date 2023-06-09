package repository

import (
	"database/sql"
	"errors"
	"github.com/Bernar11296/realtime-forum/models"
	"github.com/sirupsen/logrus"
	"strings"
	"time"
)

type PostRepo struct {
	db *sql.DB
}

func NewPostRepo(db *sql.DB) *PostRepo {
	return &PostRepo{
		db: db,
	}
}

const limit = 10

func (p *PostRepo) CreatePost(post models.Post) error {
	query := `INSERT INTO posts(author, title, content, creationDate, category_id, ImageName, ImageBase) 
				VALUES (?, ?, ?, ?, ?, ?, ?)`
	result, err := p.db.Exec(query, post.Author, post.Title, post.Content, time.Now().Format("01-02-2006 15:04:05"), post.CategoryId, post.ImageName, post.ImageData)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			return errors.New("post with that title already exists")
		}
		logrus.Println(err.Error())
		return err
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("no rows were affected")
	}
	return nil
}
func (p *PostRepo) GetUsernameByID(id int) (string, error) {
	var username string
	query := `SELECT username FROM user WHERE userId = $1`
	err := p.db.QueryRow(query, id).Scan(&username)
	if err != nil {
		return "", err
	}
	return username, nil
}
func (p *PostRepo) GetMyLikedPost(id int, offset int, category int) ([]models.Post, error) {
	var allPosts []models.Post
	var query string
	var args []interface{}
	if category == 0 {
		query = `SELECT
        p.postId,
        p.author,
        p.title,
        p.content,
        p.like,
        p.dislike,
        p.creationDate,
        p.category_id,
        c.category_name,
        COALESCE(ua.base, 'null') AS base,
        COALESCE(p.ImageName, 'null') AS ImageName,
        COALESCE(p.ImageBase, 'null') AS ImageBase
    FROM
        posts p
    JOIN
        posts_category c
    ON
        p.category_id = c.category_id
    JOIN 
        user u
    ON
        p.author = u.username
    LEFT JOIN
        user_avatar ua
    ON
        u.userId = ua.userId
    JOIN
        likesPost lp
    ON
        p.postId = lp.postId
    WHERE
        lp.userId = $1 AND lp.like1 = 1
    LIMIT $2 OFFSET $3`
		args = []interface{}{id, limit, offset}
	} else {
		query = `SELECT
        p.postId,
        p.author,
        p.title,
        p.content,
        p.like,
        p.dislike,
        p.creationDate,
        p.category_id,
        c.category_name,
        COALESCE(ua.base, 'null') AS base,
        COALESCE(p.ImageName, 'null') AS ImageName,
        COALESCE(p.ImageBase, 'null') AS ImageBase
    FROM
        posts p
    JOIN
        posts_category c
    ON
        p.category_id = c.category_id
    JOIN 
        user u
    ON
        p.author = u.username
    LEFT JOIN
        user_avatar ua
    ON
        u.userId = ua.userId
    JOIN
        likesPost lp
    ON
        p.postId = lp.postId
    WHERE
        lp.userId = $1 AND lp.like1 = 1
	AND
		p.category_id = $2
    LIMIT $3 OFFSET $4`
		args = []interface{}{id, category, limit, offset}
	}
	stmt, err := p.db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()
	rows, err := stmt.Query(args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var post models.Post
		if err := rows.Scan(&post.ID, &post.Author, &post.Title, &post.Content, &post.CountLike, &post.CountDislike, &post.CreationDate, &post.CategoryId, &post.Category, &post.AuthorAvatar, &post.ImageName, &post.ImageData); err != nil {
			return nil, err
		}
		allPosts = append(allPosts, post)
	}
	return allPosts, nil
}
func (p *PostRepo) GetMyPost(id int, offset int, category int) ([]models.Post, error) {
	var allPosts []models.Post
	var query string
	var args []interface{}
	if category == 0 {
		query = `SELECT
		p.postId,
		p.author,
		p.title,
		p.content,
		p.like,
		p.dislike,
		p.creationDate,
		p.category_id,
		c.category_name,
		COALESCE(ua.base, 'null') AS base,
		COALESCE(p.ImageName, 'null') AS ImageName,
		COALESCE(p.ImageBase, 'null') AS ImageBase
	  FROM
		posts p
	  JOIN
		posts_category c
	  ON
		p.category_id = c.category_id
	  JOIN 
		user u
	  ON
		p.author = u.username
	  LEFT JOIN
		user_avatar ua
	  ON
		u.userId = ua.userId
	  WHERE
		u.userId = $1
		LIMIT $2 OFFSET $3;`
		args = []interface{}{id, limit, offset}
	} else {
		query = `SELECT
		p.postId,
		p.author,
		p.title,
		p.content,
		p.like,
		p.dislike,
		p.creationDate,
		p.category_id,
		c.category_name,
		COALESCE(ua.base, 'null') AS base,
		COALESCE(p.ImageName, 'null') AS ImageName,
		COALESCE(p.ImageBase, 'null') AS ImageBase
	  FROM
		posts p
	  JOIN
		posts_category c
	  ON
		p.category_id = c.category_id
	  JOIN 
		user u
	  ON
		p.author = u.username
	  LEFT JOIN
		user_avatar ua
	  ON
		u.userId = ua.userId
	  WHERE
		u.userId = $1
	  AND
	    p.category_id = $2
		LIMIT $3 OFFSET $4`
		args = []interface{}{id, category, limit, offset}
	}
	stmt, err := p.db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()
	rows, err := stmt.Query(args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var post models.Post
		if err := rows.Scan(&post.ID, &post.Author, &post.Title, &post.Content, &post.CountLike, &post.CountDislike, &post.CreationDate, &post.CategoryId, &post.Category, &post.AuthorAvatar, &post.ImageName, &post.ImageData); err != nil {
			return nil, err
		}
		allPosts = append(allPosts, post)
	}
	return allPosts, nil
}
func (p *PostRepo) GetAllPost(offset int, category int) ([]models.Post, error) {
	var allPosts []models.Post
	var query string
	var args []interface{}
	if category == 0 {
		query = `SELECT
		p.postId,
		p.author,
		p.title,
		p.content,
		p.like,
		p.dislike,
		p.creationDate,
		p.category_id,
		c.category_name,
		COALESCE(ua.base, 'null') AS base,
		COALESCE(p.ImageName, 'null') AS ImageName,
		COALESCE(p.ImageBase, 'null') AS ImageBase
		FROM
			posts p
		JOIN
			posts_category c
		ON
			p.category_id = c.category_id
		JOIN 
			user u
		ON
			p.author = u.username
		LEFT JOIN
			user_avatar ua
		ON
			u.userId = ua.userId
		LIMIT $1 OFFSET $2;`
		args = []interface{}{limit, offset}
	} else {
		query = `SELECT
		p.postId,
		p.author,
		p.title,
		p.content,
		p.like,
		p.dislike,
		p.creationDate,
		p.category_id,
		c.category_name,
		COALESCE(ua.base, 'null') AS base,
		COALESCE(p.ImageName, 'null') AS ImageName,
		COALESCE(p.ImageBase, 'null') AS ImageBase
		FROM
			posts p
		JOIN
			posts_category c
		ON
			p.category_id = c.category_id
		JOIN 
			user u
		ON
			p.author = u.username
		LEFT JOIN
			user_avatar ua
		ON
			u.userId = ua.userId
		WHERE 
			p.category_id = $1
			LIMIT $2 OFFSET $3;`
		args = []interface{}{category, limit, offset}
	}
	stmt, err := p.db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()
	rows, err := stmt.Query(args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var post models.Post
		if err := rows.Scan(&post.ID, &post.Author, &post.Title, &post.Content, &post.CountLike, &post.CountDislike, &post.CreationDate, &post.CategoryId, &post.Category, &post.AuthorAvatar, &post.ImageName, &post.ImageData); err != nil {
			return nil, err
		}
		allPosts = append(allPosts, post)
	}
	return allPosts, nil
}
func (p *PostRepo) GetMetaDataPost(category int) (models.MetaDataPost, error) {
	var metadatapost models.MetaDataPost
	if category == 0 {
		if err := p.db.QueryRow("SELECT COUNT(*), ROUND(COUNT(*)/10+0.5) FROM posts").Scan(&metadatapost.Posts, &metadatapost.Pages); err != nil {
			return metadatapost, err
		}
		return metadatapost, nil
	}
	if err := p.db.QueryRow("SELECT COUNT(*), ROUND(COUNT(*)/10+0.5) FROM posts WHERE category_id = $1", category).Scan(&metadatapost.Posts, &metadatapost.Pages); err != nil {
		return metadatapost, err
	}
	return metadatapost, nil
}
func (p *PostRepo) GetMetaDataMyPost(id int, category int) (models.MetaDataPost, error) {
	var metadatapost models.MetaDataPost
	var query string
	var args []interface{}
	if category == 0 {
		query = `SELECT 
		COUNT(*), 
		ROUND(COUNT(*)/10+0.5) 
	FROM 
		posts p 
	WHERE 
		p.author = (SELECT username from user where userId = $1 )`
		args = []interface{}{id}
	} else {
		query = `SELECT 
		COUNT(*), 
		ROUND(COUNT(*)/10+0.5) 
	FROM 
		posts p 
	WHERE 
		p.author = (SELECT username from user where userId = $1 )
		AND
	    p.category_id = $2 
		`
		args = []interface{}{id, category}
	}
	stmt, err := p.db.Prepare(query)
	if err != nil {
		return models.MetaDataPost{}, err
	}
	defer stmt.Close()
	row := stmt.QueryRow(args...)
	if err := row.Scan(&metadatapost.Posts, &metadatapost.Pages); err != nil {
		return metadatapost, err
	}
	return metadatapost, nil
}
func (p *PostRepo) GetMetaDataMyLikedPost(id int, category int) (models.MetaDataPost, error) {
	var metadatapost models.MetaDataPost
	var query string
	var args []interface{}
	if category == 0 {
		query = `SELECT 
		COUNT(p.postId), 
		ROUND(COUNT(*)/10+0.5) 
	  FROM 
		posts p 
	  JOIN
			likesPost lp
		ON
			p.postId = lp.postId
		WHERE
			lp.userId = $1 AND lp.like1 = 1`
		args = []interface{}{id}
	} else {
		query = `SELECT 
		COUNT(p.postId), 
		ROUND(COUNT(*)/10+0.5) 
	  FROM 
		posts p 
	  JOIN
			likesPost lp
		ON
			p.postId = lp.postId
		WHERE
			lp.userId = $1 AND lp.like1 = 1
		AND
			p.category_id = $2  
		`
		args = []interface{}{id, category}
	}
	stmt, err := p.db.Prepare(query)
	if err != nil {
		return models.MetaDataPost{}, err
	}
	defer stmt.Close()
	row := stmt.QueryRow(args...)
	if err := row.Scan(&metadatapost.Posts, &metadatapost.Pages); err != nil {
		return metadatapost, err
	}
	return metadatapost, nil
}
func (p *PostRepo) GetPost(postID int, userId int) (models.Post, error) {
	var post models.Post
	query := `SELECT 
		postId,
		author,
		title,
		content,
		like,
		dislike,
		creationDate,
		category_id,
		COALESCE(p.ImageName, 'null') AS ImageName,
		COALESCE(p.ImageBase, 'null') AS ImageBase 
	FROM 
		posts p
	WHERE 
		postid=$1`
	row := p.db.QueryRow(query, postID)
	if err := row.Scan(&post.ID, &post.Author, &post.Title, &post.Content, &post.CountLike, &post.CountDislike, &post.CreationDate, &post.CategoryId, &post.ImageName, &post.ImageData); err != nil {
		return post, err
	}
	if userId != 0 {
		query1 := `SELECT 
		(SELECT EXISTS (SELECT 1 FROM likesPost WHERE userId = $1 AND postId = $2 AND like1 = 1)) AS like, 
		(SELECT EXISTS (SELECT 1 FROM likesPost WHERE userId = $1 AND postId = $2 AND like1 = 0)) AS like;`
		p.db.QueryRow(query1, userId, postID).Scan(&post.Likeisset, &post.Dislikeisset)
	}
	return post, nil
}
func (p *PostRepo) DeletPost(id int) error {
	stmt, err := p.db.Prepare("DELETE FROM posts WHERE postId = $1")
	if err != nil {
		return err
	}
	if _, err := stmt.Exec(stmt, id); err != nil {
		return err
	}
	return nil
}
func (p *PostRepo) GetCategoryID(category string) (int, error) {
	var id int
	query := `SELECT category_id FROM posts_category where category_name=$1`
	row := p.db.QueryRow(query, category)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}
	return id, nil
}
func (p *PostRepo) GetCategory() ([]models.Category, error) {
	var allCategories []models.Category
	query := `SELECT * FROM posts_category`
	rows, err := p.db.Query(query)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var category models.Category
		if err := rows.Scan(&category.CategoryID, &category.CategoryName); err != nil {
			return nil, err
		}
		allCategories = append(allCategories, category)
	}
	return allCategories, nil
}
