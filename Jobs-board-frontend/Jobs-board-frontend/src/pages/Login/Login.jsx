import React, { useState } from "react";
import './Login.css';


function Login() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState("");

  const emailStrong = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailStrong.test(email);
  const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const isPasswordValid = passwordStrong.test(password);
  const isFormValid = isEmailValid && isPasswordValid;
 


 const handleLogin = () => {
   setError("");
   setIsLoading(true);


  
  if (email === "test@email.com" && password === "password123") {
       console.log("Login successful!");
       setIsLoading(false);
     } else {
       setError("Invalid email or password");
       setIsLoading(false);
     }
 };


 return (
   <main>
     <div className="login-form-container">
       <h1>Login</h1>
      
       <input
         type="email"
         placeholder="Email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
       />
      
       <input
         type="password"
         placeholder="Password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
       />
      
       {error && <div style={{ color: "red" }}>{error}</div>}
      
       <button
         onClick={handleLogin}
         disabled={!isFormValid || isLoading}
       >
         {isLoading ? "Loading..." : "Log in"}
       </button>


       <div className="forgot-password-container">
         <p>
           Forgot your password?{" "}
           <a href="/reset-password">
             Reset it here
           </a>
         </p>
       </div>
     </div>
   </main>
 );
}


export default Login;