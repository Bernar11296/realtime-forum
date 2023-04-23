function renderAuth() {
    app.innerHTML = `
    <div class="auth-page">
      <form>
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Log in</button>
      </form>
    </div>
    `;

    // Create a style element and add CSS rules
    const style = document.createElement('style');
    style.textContent = `
    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 50px;
    }

    input {
      padding: 10px;
      margin-bottom: 20px;
      width: 300px;
      border-radius: 5px;
      border: 1px solid #ccc;
      font-size: 16px;
    }

    button[type="submit"] {
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }

    button[type="submit"]:hover {
      background-color: #45a049;
    }
  `;

    // Append the style element to the head of the HTML document
    document.head.appendChild(style);
}

export default renderAuth;