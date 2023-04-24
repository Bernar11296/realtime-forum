async function submitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const Username = formData.get('Username');
    const password = formData.get('password');
    const user = {
        Username: Username,
        Password: password,
    };
    console.log(user);
    if (user.Username.length === 0 || user.Password.length === 0) {
        const errorMessage = "Invalid input. Please make sure your passwords match and you are at least 18 years old.";
        const errorElement = document.querySelector('.error');
        errorElement.textContent = errorMessage;
        return;
    }
    const response = await fetch('http://localhost:8080/api/auth/sign_in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });

    // Handle the response
    if (response.ok) {

        console.log(response);
        // Registration successful, redirect to the login page
        window.location.href = '/home';
    } else {
        // Registration failed, display an error message
        const errorMessage = await response.text();
        alert(`Registration failed: ${errorMessage}`);
    }
}

function renderAuth() {
    app.innerHTML = `
    <div class="auth-page">
    <div class="error"></div>

      <form>
        <input type="text" name="Username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Log in</button>
      </form>
    </div>
    `;

    // Create a style element and add CSS rules
    const style = document.createElement('style');
    style.textContent = `
    .error {
      color: red;
      font-weight: bold;
      margin-bottom: 10px;
    }
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

    const form = document.querySelector('form');
    form.addEventListener('submit', submitHandler);
}

export default renderAuth;