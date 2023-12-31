import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../css/App.css';
import '../css/Mobile.css';
import { useNavigate } from "react-router-dom";
import registerImage from '../images/register-image.png';
import registerImage1 from '../images/register-image1.png';
import registerImage2 from '../images/register-image2.png';
import registerImage3 from '../images/register-image3.png';
import backgroundVideo from '../images/video.mp4';
import $ from "jquery";


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

  useEffect(() => {
    const videoElement = $('.background-video')[0];
    if (videoElement) {
      videoElement.playbackRate = 0.42;
    }
  }, []);

  const exit = () => {
    navigate("/login");
  };

 return (
  <div className="App-header">
    <img src={registerImage} alt="Register" className={`register-image ${isImageAnimated ? "animate" : ""}`} />
        <video id="background-video" className="background-video" autoPlay loop muted playsInline>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
    <h2 className="register-heading">Register</h2>
    <img
      src={registerImage1}
      alt="Register"
      className="register-image1"
      style={{ transform: "scaleY(-1)" }}
    />

    <input
      className="register-input"
      placeholder="Choose a username..."
      onChange={(e) => setUsername(e.target.value)}
    />
    <input
      className="register-input"
      type="password"
      placeholder="Create a password..."
      onChange={(e) => setPassword(e.target.value)}
    />
    <img
      src={registerImage2}
      alt="Register"
      className="register-image2"
    />
      <img
      src={registerImage3}
      alt="Register"
      className="register-image3"
      />
    <div className="button-container">
      <button
        className="register-button"
        onClick={register}
        onMouseEnter={() => setImageAnimated(true)}
        onMouseLeave={() => setImageAnimated(false)}
      >
        Submit
      </button>
      <button className="exit-button" onClick={exit}>Cancel</button>
    </div>
    {error && <p className="error-message">{error}</p>}
  </div>
);
}


export default Register;
