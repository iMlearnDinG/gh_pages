import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; // Import your CSS file

const Menu = () => {
  const navigate = useNavigate();

  const logout = () => {
    axios({
      method: 'GET',
      withCredentials: true,
      url: 'http://localhost:5000/logout',
    })
      .then((res) => {
        console.log(res.data);
        if (res.data === 'You have been logged out') {
          navigate('/login'); // Redirect to the login page
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
        const user = response.data;
        if (!user) {
          navigate('/login'); // Redirect to the login page if user is not authenticated
        }
      } catch (error) {
        console.log(error);
        navigate('/login'); // Redirect to the login page on error
      }
    };

    checkLoginStatus();
  }, [navigate]);

  return (
  <div className="menu-container">
    <div className="menu">
      <button onClick={() => console.log('Single Player')}>Single Player</button>
      <button onClick={() => navigate('/lobby')}>Multiplayer</button> {/* Redirect to Lobby */}
      <button onClick={logout}>Logout</button>
    </div>
  </div>
  );
};

export default Menu;
