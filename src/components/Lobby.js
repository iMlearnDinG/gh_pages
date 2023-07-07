import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Lobby = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  const fetchLobbies = useCallback(async () => {
    setLoading(true);
    /*try {
      const response = await axios.get('http://localhost:5000/lobbies', { withCredentials: true });
      setLobbies(response.data);
    } catch (error) {
      console.log(error);
      navigate('/login');
    } finally {
      setLoading(false);
    }*/
  }, [navigate]);

  useEffect(() => {
    fetchLobbies();

    const socket = io('http://localhost:5000'); // Create a socket connection

    socket.on('lobbyUpdate', (updatedLobby) => {
      setLobbies((prevLobbies) =>
        prevLobbies.map((lobby) => (lobby.lobbyID === updatedLobby.lobbyID ? updatedLobby : lobby))
      );
    });

    socket.on('userJoin', (username) => {
      console.log(`User ${username} joined the lobby`);
    });

    socket.on('userLeave', (username) => {
      console.log(`User ${username} left the lobby`);
    });

    return () => {
      socket.disconnect(); // Disconnect the socket connection on component unmount
    };
  }, [fetchLobbies]);

  const createLobby = async () => {
    if (!isAuthenticated) {
      return; // Don't create a lobby if not authenticated
    }

    setLoading(true);
    /*try {
      const response = await axios.post('http://localhost:5000/lobbies', null, { withCredentials: true });
      console.log('Lobby created successfully. ID:', response.data.lobbyID);
      fetchLobbies();
    } catch (error) {
      console.log('Error in createLobby: ', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }*/
  };

  const joinLobby = (lobbyID) => {
    console.log('Join Lobby clicked. Lobby ID:', lobbyID);
    navigate(`/lobby/${lobbyID}`);
  };

  useEffect(() => {
    // Check if the user is authenticated on component mount
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <div className="lobby">
      <h2>Lobbies</h2>
      {loading ? (
        <p>Loading...</p>
      ) : lobbies.length > 0 ? (
        <table className="lobby-table">
          <thead>
            <tr>
              <th>Lobby ID</th>
              <th>Owner</th>
              <th>Users</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lobbies.map((lobby) => (
              <tr key={lobby.lobbyID}>
                <td>{lobby.lobbyID}</td>
                <td>{lobby.owner}</td>
                <td>{lobby.users.join(', ')}</td>
                <td>
                  <button onClick={() => joinLobby(lobby.lobbyID)} disabled={loading}>
                    {loading ? 'Joining...' : 'Join'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No lobbies available</p>
      )}
      {isAuthenticated ? (
        <button onClick={createLobby} disabled={loading}>
          {loading ? 'Creating Lobby...' : 'Create Lobby'}
        </button>
      ) : (
        <p>Login to create a lobby</p>
      )}
      <Link to="/menu" className="lobbyButtonExit" style={{ marginTop: '10px' }}>
        Back to Menu
      </Link>
    </div>
  );
};

export default Lobby;
