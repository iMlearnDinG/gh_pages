import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import '../css/App.css'; // Import your CSS file

const SpecificLobby = () => {
    const { lobbyID } = useParams();
    const [lobby, setLobby] = useState(null);
    const [consoleMessages, setConsoleMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        const fetchLobbyData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/lobbies/${lobbyID}`, { withCredentials: true });
                setLobby(response.data);
            } catch (error) {
                console.log('Error while fetching lobby data', error);
            }
        };

        fetchLobbyData();

        return () => {
            socketRef.current.disconnect();
        };
    }, [lobbyID]);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');
        console.log("socketRef after connection:", socketRef.current);

        socketRef.current.on('userJoined', (updatedLobby) => {
            if (updatedLobby.lobbyID === lobbyID) {
                setLobby(updatedLobby);

                if (lobby && updatedLobby.users.length > lobby.users.length) {
                    const newUser = updatedLobby.users.find(user => !lobby.users.includes(user));
                    setConsoleMessages(prevMessages => [...prevMessages, `${newUser} joined the lobby`]);
                }
            }
        });

        socketRef.current.on('redSquareClick', ({ username }) => {
            setConsoleMessages(prevMessages => [...prevMessages, `${username} clicked the red square`]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [lobbyID, lobby]);

    const handleLeaveLobby = async () => {
        try {
            await axios.post(`http://localhost:5000/lobbies/${lobbyID}/leave`, null, { withCredentials: true });
            window.location.href = "/menu";
        } catch (error) {
            console.log('Error while leaving the lobby', error);
        }
    };

    const handleRedSquareMouseDown = () => {
        console.log("Red square clicked");
        console.log("socketRef:", socketRef.current);
        socketRef.current.emit('redSquareClick', { lobbyID, username: JSON.stringify(lobby.owner) });
    };

    if (!lobby) {
        return <p>Loading...</p>;
    }

    return (
        <div className="specific-lobby-container">
            <h2 className="specific-lobby-header">Lobby: {lobby.lobbyID}</h2>
            <p>Owner: {lobby.owner}</p>
            <p>Users: {lobby.users.join(', ')}</p>
            <button onClick={handleLeaveLobby}>Leave Lobby</button>

            <h3 className="specific-lobby-console">Console</h3>
            <ul>
                {consoleMessages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>

            {/* The red square */}
            <div
                className="specific-lobby-square"
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '25%',
                    transform: 'translate(-50%, -50%)',
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'red',
      }}
      onMouseDown={handleRedSquareMouseDown}
    />
  </div>
);

};

export default SpecificLobby;
