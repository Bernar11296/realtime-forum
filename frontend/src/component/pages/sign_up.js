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
    if (password_prove !== password || age < 18) {
        const errorMessage = "Invalid input. Please make sure your passwords match and you are at least 18 years old.";
        const errorElement = document.querySelector('.error');
        errorElement.textContent = errorMessage;
        return;
    }
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
        window.location.href = '/auth';
    } else {
        // Registration failed, display an error message
        const errorMessage = await response.text();
        alert(`Registration failed: ${errorMessage}`);
    }
}

function renderRegister() {
    app.innerHTML = `
    <div class="signup-page">
    <div class="error"></div>
      <form>
        <input type="text" name="Username" placeholder="Username" required>
        <input type="number" name="age" placeholder="Age" min="18" max="120" required>
        <select name="gender" required>
          <option value="" disabled selected hidden>Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input type="text" name="firstName" placeholder="First Name" required>
        <input type="text" name="lastName" placeholder="Last Name" required>
        <input type="email" name="email" placeholder="E-mail" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="password" name="password_prove" placeholder="Prove password" required>
        <button type="submit">Sign up</button>
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

export default renderRegister;