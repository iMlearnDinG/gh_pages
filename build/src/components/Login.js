import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Import the App CSS file
import loginImage from '../images/login-image.png'; // Update the file path and name
import loginImage1 from '../images/login-image1.png';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', password: '' });
  const [error, setError] = useState(null); // Add error state
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
      url: 'http://localhost:5000/login', // Update the URL to the new proxy URL
    })
      .then((res) => {
        console.log(res.data);
        if (res.data === 'Logged In') {
          navigate('/menu'); // Navigate to Menu upon successful login
        } else {
          setError('Account does not exist'); // Set the error message
        }
      })
      .catch((error) => {
        console.log(error);
        setError('Incorrect Details. Try again...'); // Set the error message
      });
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user', { withCredentials: true }); // Updated URL
        const user = response.data;
        if (user) {
          navigate('/menu'); // Redirect to Menu if user is already logged in
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
    image.onload = () => {
      const loginImageElement = document.getElementById('login-image');
      if(loginImageElement) {
        loginImageElement.classList.add('fade-in');
      }
    };
  }, []); // Now the effect only runs once on component mount

  useEffect(() => {
  if (error) {
    // If there's an error, set fadeOut to true after 3 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2200);

    // Clear the timeout if the component unmounts or if the error changes
    return () => clearTimeout(timer);
  }
  else {
    // Reset fadeOut to false when error is cleared
    setFadeOut(false);
  }
}, [error]);

  // Add a new useEffect to clear the error after it's faded out
  useEffect(() => {
  if (fadeOut) {
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [fadeOut]);


  return (
  <div className="App-header">
    <img
      id="login-image"
      src={loginImage}
      alt="Login"
      className="login-image"
    />

    <h2 className="glow-text" style={{ margin: 0 }}>B  l  i  n  d</h2>
    <h2 className="glow-text" style={{ margin: 0, fontSize: 50 }}>e y e</h2>

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
  <p className={`error-message ${fadeOut ? 'fade-out' : ''}`} >
    {error}
  </p>
)}
    <img
      id="login-image1"
      src={loginImage1}
      alt="Login"
      className="login-image1"
    />

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
