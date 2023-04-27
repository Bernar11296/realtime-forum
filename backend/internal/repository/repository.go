package repository

import (
	"github.com/Bernar11296/realtime-forum/models"
)

type Authorization interface {
	CreateUser(models.User) error
	CheckUser(models.User) (models.User, error)
	CheckUserByToken(string) (models.User, error)
	SaveToken(models.User) error
	DeleteToken(string) error
	UploadAvatar(string, int) error
	GetAvatar(int) (string, error)
	UpdateAvatar(string, int) error
	DeleteTokenById(int)
	GetUserInfo(int) (models.User, error)
	GetUserByEmail(string) (models.User, error)
	GetUserByUsername(string) (models.User, error)
}

type Post interface {
	CreatePost(models.Post) error
	GetAllPost(int, int) ([]models.Post, error)
	GetPost(int, int) (models.Post, error)
	DeletPost(int) error
	GetMetaDataPost(int) (models.MetaDataPost, error)
	GetMetaDataMyPost(int, int) (models.MetaDataPost, error)
	GetMetaDataMyLikedPost(int, int) (models.MetaDataPost, error)
	GetCategory() ([]models.Category, error)
	GetCategoryID(string) (int, error)
	GetMyPost(int, int, int) ([]models.Post, error)
	GetMyLikedPost(int, int, int) ([]models.Post, error)
	GetUsernameByID(int) (string, error)
}
