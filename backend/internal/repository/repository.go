package repository

type Authorization interface {
	CreateUser(model.User) error
	CheckUser(model.User) (model.User, error)
	CheckUserByToken(string) (model.User, error)
	SaveToken(model.User) error
	DeleteToken(string) error
	UploadAvatar(string, int) error
	GetAvatar(int) (string, error)
	UpdateAvatar(string, int) error
	DeleteTokenById(int)
	GetUserInfo(int) (model.User, error)
	GetUserByEmail(string) (model.User, error)
	GetUserByUsername(string) (model.User, error)
}

type Post interface {
	CreatePost(model.Post) error
	GetAllPost(int, int) ([]model.Post, error)
	GetPost(int, int) (model.Post, error)
	DeletPost(int) error
	GetMetaDataPost(int) (model.MetaDataPost, error)
	GetMetaDataMyPost(int, int) (model.MetaDataPost, error)
	GetMetaDataMyLikedPost(int, int) (model.MetaDataPost, error)
	GetCategory() ([]model.Category, error)
	GetCategoryID(string) (int, error)
	GetMyPost(int, int, int) ([]model.Post, error)
	GetMyLikedPost(int, int, int) ([]model.Post, error)
	GetUsernameByID(int) (string, error)
}
