import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/App.css';
import registerImage from '../images/register-image.png';
import bannerImage from '../images/banner.png';

import blindeyeRules1 from '../images/blindeye-rules_Page_1.png';
import blindeyeRules2 from '../images/blindeye-rules_Page_2.png';
import blindeyeRules3 from '../images/blindeye-rules_Page_3.png';
import blindeyeRules4 from '../images/blindeye-rules_Page_4.png';
import blindeyeRules5 from '../images/blindeye-rules_Page_5.png';
import blindeyeRules6 from '../images/blindeye-rules_Page_6.png';
import blindeyeRules7 from '../images/blindeye-rules_Page_7.png';
import blindeyeRules8 from '../images/blindeye-rules_Page_8.png';
import blindeyeRules9 from '../images/blindeye-rules_Page_9.png';

import multiplayerImage from '../images/register-image3.png';
import loginImage from "../images/login-image.png";

const Menu = () => {
  const navigate = useNavigate();
  const imageAreaRef = useRef(null); // Create a ref for the image area
  const [messages, setMessages] = useState([]);

  const logout = () => {
    axios({
      method: 'GET',
      withCredentials: true,
      url: 'http://localhost:5000/logout',
    })
      .then((res) => {
        console.log(res.data);
        if (res.data === 'You have been logged out') {
          navigate('/login');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showImage = (buttonClicked) => {
    const imageArea = imageAreaRef.current; // Get the image area from the ref
    imageArea.innerHTML = '';

    const closeButton = document.createElement('div');
    closeButton.innerHTML = 'X';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', () => {
      imageArea.style.display = 'none';
    });

    imageArea.appendChild(closeButton);

    if (buttonClicked === 'rules') {
      const imagePaths = [
        blindeyeRules1,
        blindeyeRules2,
        blindeyeRules3,
        blindeyeRules4,
        blindeyeRules5,
        blindeyeRules6,
        blindeyeRules7,
        blindeyeRules8,
        blindeyeRules9,
      ]; // Add the rest of the image paths for rules

      for (let i = 0; i < imagePaths.length; i++) {
        const imagePath = imagePaths[i];
        const image = document.createElement('img');
        image.src = imagePath;
        image.className = 'rules-image'; // Add the CSS class to the image element
        imageArea.appendChild(image);
      }
    } else if (buttonClicked === 'singlePlayer') {
      const imagePaths = [registerImage]; // Add the rest of the image paths for single player

      for (let i = 0; i < imagePaths.length; i++) {
        const imagePath = imagePaths[i];
        const image = document.createElement('img');
        image.src = imagePath;
        imageArea.appendChild(image);
      }
    } else if (buttonClicked === 'multiplayer') {
      const imagePaths = [multiplayerImage]; // Add the rest of the image paths for multiplayer

      for (let i = 0; i < imagePaths.length; i++) {
        const imagePath = imagePaths[i];
        const image = document.createElement('img');
        image.src = imagePath;
        imageArea.appendChild(image);
      }
    }

    imageArea.style.display = 'block';
  };



  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        //const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
        //const user = response.data;
        //if (!user) {
        //navigate('/login');
        //}
      } catch (error) {
        console.log(error);
        navigate('/login');
      }
    };

    checkLoginStatus();
  }, [navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/message');
        const data = response.data;
        setMessages(data.messages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, []);



  return (
    <div className="menu-container">
      <h1 className="menu-title">Menu</h1>
      <img src={bannerImage} alt="Banner" className="banner-image" />
      <div className="menu">
        <button onClick={() => showImage('rules')} className="menu-button">
          Rules
        </button>
        <button onClick={() => showImage('singlePlayer')} className="menu-button">
          Single Player
        </button>
        <button onClick={() => showImage('multiplayer')} className="menu-button">
          Multiplayer
        </button>

        <button onClick={logout} className="menu-button-logout">
          Logout
        </button>
      </div>
    <div id="image-area" ref={imageAreaRef} className="image-area">
      <h2>Welcome to Blindeye</h2>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
      <img id="login-image" src={loginImage} alt="Login" className="menu-image" />
      <img id="login-image" src={loginImage} alt="Login" className="menu-image2" />
  </div>
);
};

export default Menu;
