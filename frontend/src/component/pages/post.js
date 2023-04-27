const getPostById = async(id) => {
    const response = await fetch(`http://localhost:8080/api/post/get_post/?id=${id}`, {
        headers: {
            'Accept': 'application/json',
            'Credentials': 'include'
        },
        method: "GET",
        credentials: 'include',
    })
    if (!response.ok) {
        throw new Error("Response error: " + response.status);

    } else if (response.ok) {
        const data = await response.json();
        if (data) { // Check if I get username in my response
            return data
        } else { // Handle if there is no username in the response
            const error = new Error("Error while getting userdata from the server"); // Very unlikely to happen
            error.status = 500;
            throw error;
        }
    }
}
const getComments = async(id) => {
    // /api/post/get_comment
    const response = await fetch(`http://localhost:8080/api/post/get_comment/?id=${id}`, {
        headers: {
            'Accept': 'application/json',
            'Credentials': 'include'
        },
        method: "GET",
        credentials: 'include',
    })
    if (!response.ok) {
        if (response.status === 401) {
            return null;
        } else {
            throw new Error("Response error: " + response.status);
        }
    } else if (response.ok) {
        const data = await response.json();
        if (data) {
            return data
        } else {
            const error = new Error("Error while getting userdata from the server"); // Very unlikely to happen
            error.status = 500;
            throw error;
        }
    }
}

const setLike = async(id) => {
    /*
    type Like struct {
	UserID       int `json:"UserID"`
	PostID       int `json:"PostID"`
	Islike       int `json:"Islike"`
	CommentID    int `json:"CommentID"`
	CountLike    int `json:"CountLike"`
	Countdislike int `json:"Countdislike"`
    }
    */
    console.log(id);
}


async function Post(app, usrObj) {
    console.log(usrObj);
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');
    if (postId < 1) {
        app.innerHTML = "<h1>Error: " + error.message + "</h1>";
        return
    }
    const postContainer = document.createElement('div');
    postContainer.classList.add('post-container');
    let post;
    try {
        post = await getPostById(postId);
    } catch (error) {
        app.innerHTML = "<h1>Error: " + error.message + "</h1>";
        return
    }
    console.log(post);
    // POST element
    const postElement = document.createElement('div');
    postElement.innerHTML = `
    <div class="post">
      <h2 class="post-title">${post.Title}</h2>
      <p class="post-author">Author: ${post.Author}</p>
      <p class="post-date">Date of publication: ${post.CreationDate}</p>
      <p class="post-likes">Likes: ${post.CountLike}</p>
      <p class="post-dislikes">Dislikes: ${post.CountDislike}</p>
      ${usrObj ? `<button class="like-button" id="like">Like</button><button class="dislike-button" id="dislike">Dislike</button>` : ''}
      <div class="post-body">${post.Content}</div>
    </div>
  `;
    postContainer.appendChild(postElement);




    // Formc comment element
    const postFormElement = document.createElement('form');
    postFormElement.id ='comment-form'; 
    postFormElement.innerHTML = `
      <label for="comment-input">Add a comment:</label>
      <textarea id="comment-input"></textarea>
      <button type="submit">Submit</button>
    `
    postContainer.appendChild(postFormElement);
    


    try {
      comments = await getComments(postId);
    } catch (error) {
      app.innerHTML = "<h1>Error: " + error.message + "</h1>";
      return
    }
    console.log(comments);
    const commentContainer = document.createElement('div');
    commentContainer.classList.add('comment-container');
    for (const comment of comments) {
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.innerHTML = `
        <p class="comment-text">${comment.text}</p>
        <p class="comment-author">Posted by: <span class="username">${comment.username}</span></p>
        <p class="comment-date">Date of posting: ${comment.date}</p>
      `;
      commentContainer.appendChild(commentElement);
    }

    const style = document.createElement('style');
    style.textContent = `
    /* Style for the title */
    h1 {
      text-align: center;
    }
    /* Style for each post */
    .post {
      border: 1px solid black;
      margin: 20px;
      padding: 10px;
      transition: background-color 0.3s ease;
    }
    /* Style for the post title */
    .post-title {
      font-size: 24px;
      margin-bottom: 10px;
    }
    /* Style for the post author */
    .post-author {
      font-style: italic;
    }
    /* Style for the post date */
    .post-date {
      margin-top: 0;
    }
    /* Style for the post likes and dislikes */
    .post-likes,
    .post-dislikes {
      display: inline-block;
      margin: 0 10px;
    }
    /* Style for the post body */
    .post-body {
      margin-top: 20px;
    }
    #comment-form {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
    }
    
    #comment-form label {
      margin-bottom: 5px;
    }
    
    #comment-input {
      margin-bottom: 10px;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 3px;
      resize: vertical;
      min-height: 100px;
    }
    
    #comment-form button[type="submit"] {
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 3px;
      padding: 10px;
      cursor: pointer;
    }
    
    #comment-form button[type="submit"]:hover {
      background-color: #3e8e41;
    }
    
  `;
    app.innerHTML = '';
    app.appendChild(postContainer);
    app.appendChild(style);
    postElement.querySelector('#like').addEventListener('click', setLike(post.Id) );

}
export default Post;