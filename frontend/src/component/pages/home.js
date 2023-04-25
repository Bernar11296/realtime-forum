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
    console.log(res.posts);
    res.posts.forEach(post => {
        const posthref = document.createElement('a');
        posthref.href = `/post/${post.Id}`
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const titleElement = document.createElement('h2');
        titleElement.textContent = post.Title;

        const authorElement = document.createElement('p');
        authorElement.classList.add('post-author');
        authorElement.textContent = `By ${post.Author}`;

        const contentElement = document.createElement('p');
        contentElement.classList.add('post-content');
        contentElement.textContent = post.Content;

        const dateElement = document.createElement('p');
        dateElement.classList.add('post-date');
        dateElement.textContent = `Published on ${post.CreationDate}`;

        const likeElement = document.createElement('p');
        likeElement.classList.add('post-like');
        likeElement.textContent = `Like (${post.CountLike})`;

        const dislikeElement = document.createElement('p');
        dislikeElement.classList.add('post-dislike');
        dislikeElement.textContent = `Dislike (${post.CountDislike})`;

        postElement.appendChild(titleElement);
        postElement.appendChild(authorElement);
        postElement.appendChild(contentElement);
        postElement.appendChild(dateElement);
        postElement.appendChild(likeElement);
        postElement.appendChild(dislikeElement);
        postContainer.appendChild(postElement);

    });
    const style = document.createElement('style');
    style.textContent = `
    .post-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 20px;
      padding: 20px;
      background-color: #f2f2f2;
    }
    
    .post {
      flex: 1 1 300px;
      background-color: #fff;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .post h2 {
      font-size: 24px;
      margin: 0;
      padding: 20px;
      background-color: #007bff;
      color: #fff;
    }
    
    .post p {
      font-size: 16px;
      margin: 0;
      padding: 10px 20px;
    }
    
    .post-author {
      font-weight: bold;
    }
    
    .post-content {
      text-align: justify;
      line-height: 1.5;
    }
    
    .post-date {
      font-style: italic;
    }
    
      
  `;
    app.innerHTML = '';
    app.appendChild(postContainer);
    app.appendChild(style)
}


export default renderHome;