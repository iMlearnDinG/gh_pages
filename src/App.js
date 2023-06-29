import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import LoginScreen from './components/Login';
import Register from './components/Register';
import Lobby from './components/Lobby';
import SpecificLobby from './components/SpecificLobby'; // Import the SpecificLobby component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/lobby/:lobbyID" element={<SpecificLobby />} /> {/* Update the route for SpecificLobby */}
        <Route path="*" element={<LoginScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
