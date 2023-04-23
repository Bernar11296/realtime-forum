async function submitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const Username = formData.get('Username');
    const age = formData.get('age');
    const gender = formData.get('gender');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const password_prove = formData.get('password_prove');
    // if (password_prove !== password || age < 18) {

    //     return;
    // }
    const user = {
        Email: email,
        Username: Username,
        Age: age,
        Gender: gender,
        FirstName: firstName,
        LastName: lastName,
        Password: password,
    };
    const response = await fetch('http://localhost:8080/api/auth/sign_up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });

    // Handle the response
    if (response.ok) {
        console.log(response);
        // Registration successful, redirect to the login page
        // window.location.href = '/auth';
    } else {
        // Registration failed, display an error message
        const errorMessage = await response.text();
        alert(`Registration failed: ${errorMessage}`);
    }
}

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

    const form = document.querySelector('form');
    form.addEventListener('submit', submitHandler);
}

export default renderAuth;