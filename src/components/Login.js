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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const loginUser = () => {
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
        }
      })
      .catch((error) => {
        console.log(error);
        setError('Incorrect Details. Try again...');
      });
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        require('../css/Desktop.css');
      } else {
        require('../css/Mobile.css');
      }
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    const image = new Image();
    image.src = loginImage;
    $(image).on('load', function () {
      $('#login-image').addClass('fade-in');
    });
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setFadeOut(false);
    }
  }, [error]);

  useEffect(() => {
    const videoElement = $('.background-video')[0];
    if (videoElement) {
      videoElement.playbackRate = 0.42;
    }
  }, []);


  return (
    <div className="App-header">
      <div className="background-video-container" id="video-container">
        <video id="background-video" className="background-video" autoPlay loop muted>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="background-video-overlay"></div>
      </div>

      <img id="login-image" src={loginImage} alt="Login" className="login-image" />

      <h2 className="glow-text">B L I N D</h2>
      <h3 className="glow-text">E Y E</h3>



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
      <button onClick={loginUser} className="login-button">
        Login
      </button>
      {error && (
        <p className={`error-message ${fadeOut ? 'fade-out' : ''}`}>
          {error}
        </p>
      )}
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
