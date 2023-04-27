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
    let res = await get_post();
    if (!res.posts) {
        const homePage = document.createElement('h1');
        homePage.textContent = 'Post`s not exist';
        app.innerHTML = '';
        app.appendChild(homePage);
        return
    }
    const divPosts = document.createElement('div');
    divPosts.className = 'post-container'
    console.log(res.posts);
    const postList = document.createElement('ul');
    postList.className = 'post-list';
    console.log(res.posts);
    for (const post of res.posts) {
        const postItem = document.createElement('li');
        postItem.className = 'post-item';
        postItem.innerHTML = `
        <a href="/post?id=${post.Id}">
          <h2>${post.Title}</h2>
          <p>Author: ${post.Author}</p>
          <p>Category: ${post.Category}</p>
          <p>Publication Date: ${new Date(post.CreationDate).toLocaleDateString()}</p>
          <p>Likes: ${post.CountLike}</p>
          <p>Dislikes: ${post.CountDislike}</p>
        </a>
      `
        postList.append(postItem)
    }
    const style = document.createElement('style');
    style.textContent = `
    .post-container{
      margin-top:300px;
      padding-top: 200px;
    }
    .post-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .post-item {
      margin: 20px 0;
    }
    
    .post-item a {
      text-decoration: none;
      color: #333;
      display: block;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      transition: all 0.2s ease;
    }
    
    .post-item a:hover {
      background-color: #eee;
    }
    
    .post-item h2 {
      margin: 0 0 10px;
    }
    
    .post-item p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    
    .post-item p:first-child {
      margin-top: 10px;
    }
    
  `;
    divPosts.appendChild(postList)
    app.innerHTML = '';

    app.appendChild(divPosts);
    app.appendChild(style);
}


export default renderHome;