import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Lobby = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(false); // Enable loading state.

  const fetchLobbies = useCallback(async () => {
    setLoading(true); // Set loading state to true before request.
    try {
      const response = await axios.get('http://localhost:5000/lobbies', { withCredentials: true });
      setLobbies(response.data);
    } catch (error) {
      console.log(error);
      navigate('/login'); // Redirect to the login page on error or if the user is not authenticated
    } finally {
      setLoading(false); // Set loading state back to false after request.
    }
  }, [navigate]);

  useEffect(() => {
    fetchLobbies();
  }, [fetchLobbies]);

  const createLobby = async () => {
    console.log('Create Lobby clicked.'); // Debug message.
    setLoading(true); // Set loading state to true before request.
    try {
      const response = await axios.post('http://localhost:5000/lobbies', null, { withCredentials: true });
      console.log('Lobby created successfully. ID:', response.data.lobbyID); // Debug message.
      fetchLobbies(); // Fetch updated lobbies after creating a new lobby.
    } catch (error) {
      console.log('Error in createLobby: ', error); // Log error to console
      navigate('/login'); // Redirect to the login page on error or if the user is not authenticated
    } finally {
      setLoading(false); // Set loading state back to false after request.
    }
  };

  const joinLobby = (lobbyID) => {
    console.log('Join Lobby clicked. Lobby ID:', lobbyID); // Print lobby ID to the console
    navigate(`/lobby/${lobbyID}`); // Redirect to the lobby with the specified ID
  };

  return (
    <div className="lobby">
      <h2>Lobbies</h2>
      {loading ? (
        <p>Loading...</p> // Display loading text when fetching data.
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
                  <button
                    onClick={() => joinLobby(lobby.lobbyID)}
                    disabled={loading}
                  >
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
      <button onClick={createLobby} disabled={loading}>
        {loading ? 'Creating Lobby...' : 'Create Lobby'}
      </button>
      <Link to="/menu" className="App-button" style={{ marginTop: '10px' }}>
        Back to Menu
      </Link>
    </div>
  );
};

export default Lobby;
