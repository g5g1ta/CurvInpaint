import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import './HomePage.css'; // Assuming your styles are in this file

const HomePage = () => {
  // State to control visibility of the login and register forms
  const [formToShow, setFormToShow] = useState(null); // null, "login", or "register"

  return (
    <div className="homepage">
      {/* Fullscreen Video Background */}
      <div className="video-container">
        <video autoPlay muted loop>
          <source
            src="Earth_spinning.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay Content */}
      <div className="content">
        <h1 className="time-to-imagine">
          <span>Time to</span> Imagine
        </h1>
        <h2 className="world-of-abstraction">
          <span>Welcome to</span> The World of Abstraction
        </h2>

        <button onClick={() => setFormToShow("login")}>Login</button>
        <button onClick={() => setFormToShow("register")}>Register</button>
      </div>

      {/* Conditionally Render Login or Register Form */}
      {formToShow === "login" && <LoginForm />}
      {formToShow === "register" && <RegisterForm />}
    </div>
  );
};

export default HomePage;
