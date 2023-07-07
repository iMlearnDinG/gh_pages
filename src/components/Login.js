import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import '../css/App.css';
import '../css/Mobile.css';
import '../css/Desktop.css';
import loginImage from '../images/login-image.png';
import loginImage1 from '../images/login-image1.png';
import backgroundVideo from '../images/video.mp4';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [errorMessageKey, setErrorMessageKey] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

    const loginUser = () => {
    navigate('/menu');
  };


  /*const loginUser = () => {
    axios({
      method: 'POST',
      data: {
        username: user.username,
        password: user.password,
      },
      withCredentials: true,
      url: 'http://localhost:5000/login',
    })
      .then((res) => {
        console.log(res.data);
        if (res.data === 'Logged In') {
          navigate('/menu');
        } else {
          setError('Account does not exist');
          setErrorMessageKey((prevKey) => prevKey + 1); // Update the key to trigger component remount
        }
      })
      .catch((error) => {
        console.log(error);
        setError('Incorrect Details. Try again...');
        setErrorMessageKey((prevKey) => prevKey + 1); // Update the key to trigger component remount
      });
  };*/

  useEffect(() => {
  const checkLoginStatus = async () => {
    try {
       const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
      const user = response.data;
       if (user) {
        navigate('/menu');
       }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckLoginStatus = async () => {
    try {
      await checkLoginStatus();
    } catch (error) {
      console.log(error);
    }
  };

  handleCheckLoginStatus();
}, [navigate]);


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setFadeOut(false);
    }
  }, [error, fadeOut]);

  useEffect(() => {
    const videoElement = $('.background-video')[0];
    if (videoElement) {
      videoElement.playbackRate = 0.42;
    }
  }, []);

  const handleClick = () => {
    // Remove focus from the button
    document.activeElement.blur();

    // Your button click logic here
    loginUser();

    // Add a time limit on the yellow effect
    setTimeout(() => {
      document.activeElement.blur();
    }, 500); // Adjust the duration as needed (in milliseconds)
  };

  return (
  <div className="App-header">
    <img id="login-image" src={loginImage} alt="Login" className="login-image" />
    <video id="background-video" className="background-video" autoPlay loop muted playsInline>
      <source src={backgroundVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>

      <h2 className="glow-text" style={{ textAlign: 'center' }}>B L I N D</h2>
      <h3 className="glow-text" style={{ textAlign: 'center' }}>E Y E</h3>


    <div className="login-input-group" style={{ marginTop: '35px' }}>
      <input
        type="text"
        name="username"
        value={user.username}
        onChange={handleChange}
        placeholder="Username"
        className="App-input"
      />
      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="Password"
        className="App-input"
      />
    </div>
    {error && (
      <p key={errorMessageKey} className={`error-message ${fadeOut ? 'fade-out' : ''}`}>
        {error}
      </p>
    )}
    <div onClick={handleClick} className="login-button">
      Login
    </div>
    <img id="login-image1" src={loginImage1} alt="Login" className="login-image1" />
    <div className="signup-section">
      <p>Don't have an account?</p>
      <div className="centered">
        <Link to="/register" className="App-button">
          Register
        </Link>
      </div>
    </div>
  </div>
);

};

export default Login;
