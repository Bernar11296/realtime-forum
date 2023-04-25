const get_post = async() => {
    const response = await fetch(`http://localhost:8080/api`, {
        headers: {
            Accept: "application/json",
            Credentials: "include",
        },
        method: "GET",
        credentials: "include",
    });
    if (!response.ok) {
        const error = new Error(`Could not fetch the categories. Status: ${categoriesResponse.statusText}`);
        error.status = categoriesResponse.status;
        throw error;
    }
    const categories = await response.json();
    return categories;
}


async function renderHome() {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post-container');
    let res = await get_post();
    if (!res.posts) {
        const homePage = document.createElement('h1');
        homePage.textContent = 'Post`s not exist';
        app.innerHTML = '';
        app.appendChild(homePage);
        return
    }
    console.log(res.posts);
    res.posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
      <div class="post">
        <h2 class="post-title"><a href="/post/${post.id}">${post.Title}</a></h2>
        <p class="post-author">Author: ${post.Author}</p>
        <p class="post-date">Date of publication: ${post.CreationDate}</p>
        <p class="post-likes">Likes: ${post.CountLike}</p>
        <p class="post-dislikes">Dislikes: ${post.CountDislike}</p>
      </div>
     `;
        postContainer.appendChild(postElement);
    });
    const style = document.createElement('style');
    style.textContent = `
    /* Style for the title */
    h1 {
      text-align: center;
    }
    .post-container{
      margin-top: 700px;
    }
    /* Style for each post */
    .post {
      border: 1px solid black;
      margin: 20px;
      padding: 10px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    
    .post:hover {
      background-color: #f1f1f1;
    }
    
    /* Style for the post title */
    .post-title {
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    .post-title a {
      color: black;
      text-decoration: none;
    }
    
    .post-title a:hover {
      text-decoration: underline;
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
    
      
  `;
    app.innerHTML = '';
    app.appendChild(postContainer);
    app.appendChild(style)
}


export default renderHome;