const get_category = async() => {
    const response = await fetch(`http://localhost:8080/api/post/get_post_category`, {
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

async function submitHandler(usrObj, form) {
    const title = form.elements['post-title'].value;
    const category = form.elements['post-category'].value;
    const content = form.elements['post-content'].value;
    const author = usrObj.Username
    const NewPost = {
        Author: author,
        Title: title,
        Content: content,
        Category: category
    }
    const response = await fetch('http://localhost:8080/api/post/create_post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(NewPost),
    });

    if (response.ok) {
        window.location.href = '/create_post';
    } else {
        const errorMessage = await response.text();
        alert(`Registration failed: ${errorMessage}`);
    }

}

async function create_post(usrObj) {
    let categories
    try {
        categories = await get_category();
    } catch (error) {
        console.log(error);
        appDiv.innerHTML = "<h1>Error: " + error.message + "</h1>";
        return
    }
    app.innerHTML = `
    <form >
        <label for="post-title">Title:</label>
        <input type="text" id="post-title" name="post-title" required>
        <br>
        <label for="post-category">Category:</label>
        <select id="post-category" name="post-category" required>
             ` + categories.map((category) => {
        return '<option value="' +
            category.categoryName + '">' +
            category.categoryName + '</option>'
    }) + `
        </select>
        <br>
        <label for="post-content">Content:</label>
        <textarea id="post-content" name="post-content" rows="10" cols="50" required></textarea>
        <br>
        <button type="submit">Create</button>
  </form>
    `;

    // Create a style element and add CSS rules
    const style = document.createElement('style');
    style.textContent = `
    h1 {
        text-align: center;
        margin-top: 30px;
      }
      form {
        width: 50%;
        margin: 0 auto;
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 10px;
      }
      label {
        display: block;
        font-size: 18px;
        margin-bottom: 10px;
      }
      input[type="text"],
      select,
      textarea {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border-radius: 5px;
        border: 1px solid #ccc;
        margin-bottom: 20px;
      }
      button[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
      }
      button[type="submit"]:hover {
        background-color: #3e8e41;
      }
  `;

    // Append the style element to the head of the HTML document
    document.head.appendChild(style);

    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        submitHandler(usrObj, event.target);
    });
}

export default create_post;