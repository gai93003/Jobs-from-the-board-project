import React from 'react';
import ReactDom from 'react-dom/client';

function App() {

  function signUP(formData) {
    const email = formData.get("email");
    console.log(email)
  }

  return (

    <main>

      <h1>CYF Job Board</h1>

      <section className="login-container">
        <article class="header">
        <h1>Create Your Account</h1>
        <p>Join the CYF Job Board Community</p>
      </article>

      <form action={signUP}>
        <fieldset>
          <label class="name" htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" placeholder="Enter your full name"/>

          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder="Enter you email address"/>

          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="Create a password" />
          <p className="password-char-count">8+ characters, one number</p>

          <label htmlFor="confirm-password">Confirm password</label>
          <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" />

          <label htmlFor="role">Select Your Role</label>
          <select name="role" id="role">
            <option value="Trainee">Trainee</option>
            <option value="Mentor">Mentor</option>
            <option value="Staff">Staff</option>
          </select>

        </fieldset>

        <button id="register-btn">Register</button>
      </form>
      </section>
      <section className="go-to-login">
        <p>Already have an account? <a href="" className="login-link">Log in</a></p>
      </section>
    </main>

  )

}

export default App