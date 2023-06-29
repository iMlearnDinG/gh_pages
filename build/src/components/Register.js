import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate } from "react-router-dom";
import registerImage from '../images/register-image.png';
import registerImage1 from '../images/register-image1.png';
import registerImage2 from '../images/register-image2.png';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isImageAnimated, setImageAnimated] = useState(false);

  const register = () => {
    if (!username || !password) {
      setError('Please provide a username and password.');
      return;
    }

    const userData = {
      username: username,
      password: password
    };

    const jsonData = JSON.stringify(userData);

    axios.post('http://localhost:5000/register', jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    })
      .then(res => {
        alert('Signup was successful');
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setError(error.response.data);
        } else {
          setError('An error occurred during registration');
        }
      });
  };

  const exit = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <img
        src={registerImage}
        alt="Register"
        className={`register-image ${isImageAnimated ? "animate" : ""}`}
      />
      <h2 className="register-heading">Register</h2>
      <img
        src={registerImage1}
        alt="Register"
        className="register-image1"
        style={{ transform: "scaleY(-1)" }}
      />

      <input
        className="register-input"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="register-input"
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
        <img
        src={registerImage2}
        alt="Register"
        className="register-image2"
      />
      <button
        className="register-button"
        onClick={register}
        onMouseEnter={() => setImageAnimated(true)}
        onMouseLeave={() => setImageAnimated(false)}
      >
        Submit
      </button>
      <button className="exit-button" onClick={exit}>Cancel</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Register;
