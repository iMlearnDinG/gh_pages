const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const passportSetup = require('../backend/config/passport-setup');
const activeSessions = [];
const router = express.Router();

const User = require('../backend/models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const app = express();
const db = 'mongodb://127.0.0.1:27017/blindeyeDB';

const lobbies = {};
const path = require('path');
const fs = require('fs');


// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));


    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(
    session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passportSetup(passport);

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'], // Add your new URL here
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // User is authenticated
    return next();
  }
  // User is not authenticated, redirect to the login page or return an error
  res.status(401).send('Unauthorized');
};

// Put your API routes here
app.use('/api', router);

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(400).json({ error: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    username,
    password: hashedPassword,
  });

  await user.save();
  res.status(200).json({ message: 'User registered' });
});


app.post('/login', passport.authenticate('local'), async (req, res) => {
  // Find the session index based on the sessionID
  const sessionIndex = activeSessions.findIndex((session) => session.sessionID === req.sessionID);

    if (sessionIndex !== -1) {
      // Assign the user identifier to the session
      activeSessions[sessionIndex].userIdentifier = req.user.username;
      console.log(`User "${req.user.username}" logged in with identifier "${activeSessions[sessionIndex].userIdentifier}"`);
    } else {
      // Create a new session object with the user identifier
      const newSession = {
        sessionID: req.sessionID,
        userIdentifier: req.user.username,
      };
      activeSessions.push(newSession);
      console.log(`User "${req.user.username}" logged in with identifier "${newSession.userIdentifier}"`);
    }

    res.send('Logged In');
  });

app.post('/lobbies/:lobbyID/join', isAuthenticated, (req, res) => {
  const lobbyID = req.params.lobbyID;
  const userID = req.user.userID;

  const lobby = lobbies.find(lobby => lobby.lobbyID === lobbyID);
  if (!lobby) {
    return res.status(404).send({ message: 'Lobby not found' });
  }

  if (lobby.users.find(user => user.userID === userID)) {
    return res.status(400).send({ message: 'User already in this lobby' });
  }

  lobby.users.push(req.user);

  const updatedLobby = {
    lobbyID: lobby.lobbyID,
    owner: lobby.owner,
    users: lobby.users.map(user => user.username)
  };

  io.to(lobbyID).emit('userJoined', updatedLobby);
  return res.status(200).send(updatedLobby);
});

app.post('/lobbies/:lobbyID/red-square-click', isAuthenticated, (req, res) => {
  const lobbyID = req.params.lobbyID;
  const userID = req.user.userID;

  const lobby = lobbies.find(lobby => lobby.lobbyID === lobbyID);
  if (!lobby) {
    return res.status(404).send({ message: 'Lobby not found' });
  }

  if (!lobby.users.find(user => user.userID === userID)) {
    return res.status(403).send({ message: 'User not in this lobby' });
  }

  io.to(lobbyID).emit('redSquareClick', { lobbyID, username: req.user.username });
  return res.status(200).send({ message: 'Red square click event emitted' });
});

app.get('/message', (req, res) => {
  const filePath = path.join(__dirname, 'motd.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read message' });
      return;
    }

    const messages = data.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');

    res.json({ messages });
  });
});



app.get('/user', isAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      // User is not authenticated, return an error or redirect as desired
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { username } = req.user;

    // Retrieve the user data from the database based on the username
    const user = await User.findOne({ username });

    if (!user) {
      // Handle the case when the user is not found
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Construct the user data object
    const userData = {
      username: user.username,
      email: user.email,
      // Add other user properties here
    };

    // Set the appropriate headers to indicate JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Update with your frontend URL

    // Send the user data as JSON
    res.json(userData);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.log('Accessed /user route');
    console.log(error);
    console.log(req.session);
    res.status(500).json({ error: 'An error occurred while retrieving user data' });
  }
});


app.get('/logout', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  const sessionID = req.sessionID; // Get the session ID of the logged-out user

  req.logout((err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
      return;
    }
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Server Error');
        return;
      }
      res.clearCookie('connect.sid'); // Clear the session cookie

      // Remove the session ID from the activeSessions array
      const sessionIndex = activeSessions.findIndex((session) => session.sessionID === sessionID);
      if (sessionIndex !== -1) {
        activeSessions.splice(sessionIndex, 1);
      }

      console.log(`User logged out. Active sessions: ${activeSessions.length}`); // Print the number of active sessions
      res.status(200).send('You have been logged out');
    });
  });
});



app.get('/active-sessions', (req, res) => {
  // Return the activeSessions array as the response
  res.send(activeSessions);
});


app.get('/lobbies', isAuthenticated, (req, res) => {
  // Convert the lobbies object to an array and send it as the response
  const lobbiesArray = Object.values(lobbies);
  res.send(lobbiesArray);
});


app.get('/lobbies/:lobbyID', isAuthenticated, (req, res) => {
  const { lobbyID } = req.params;
  const lobby = lobbies[lobbyID];

  if (!lobby) {
    res.status(404).send('Lobby not found');
    return;
  }

  res.send(lobby);
});


app.post('/lobbies', isAuthenticated, (req, res) => {
  // Handle the request to create a new lobby
  const { username } = req.user;
  const lobbyID = Math.random().toString(36).substring(2, 15); // Generate a random lobby ID
  const newLobby = { lobbyID, owner: username, users: [username] };
  lobbies[lobbyID] = newLobby;
  io.emit('lobbyUpdate', newLobby); // Send the updated lobby data to all connected clients
  res.status(200).send(newLobby);
});


app.post('/lobbies/:lobbyID/leave', isAuthenticated, (req, res) => {
  const lobbyID = req.params.lobbyID;
  const username = req.user.username; // Assuming you have authenticated the user and obtained their username

  // Find the lobby in your data store
  const lobby = lobbies[lobbyID];

  if (!lobby) {
    return res.status(404).json({ error: 'Lobby not found' });
  }

  // Remove the user from the lobby
  const userIndex = lobby.users.findIndex((user) => user === username);
  if (userIndex !== -1) {
    lobby.users.splice(userIndex, 1);
  }

  // Broadcast the updated lobby to other users in the lobby
  io.to(lobbyID).emit('lobbyUpdate', lobby);

  res.sendStatus(200); // Send a success response

});


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const port = process.env.PORT || 5000;
app.set('port', port);
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Game server logic
io.on('connection', (socket) => {
  console.log('New client connected');

  // Assign a unique identifier to the user
  const userIdentifier = uuidv4();
  activeSessions.push({ sessionID: socket.id, userIdentifier });

  socket.on('joinLobby', ({ username, lobbyID }) => {
    if (lobbies[lobbyID]) {
      lobbies[lobbyID].users.push(username);
      socket.join(lobbyID); // Join the user to the lobby room
      io.to(lobbyID).emit('lobbyUpdate', lobbies[lobbyID]); // Send the updated lobby data

      // Emit a join event to the lobby room to notify other users
      socket.to(lobbyID).emit('userJoin', username);
    } else {
      socket.emit('error', 'Lobby does not exist');
    }
  });

  socket.on('blackSquareMove', ({ lobbyID, squarePosition }) => {
    socket.to(lobbyID).emit('blackSquareMove', squarePosition);
  });

  socket.on('redSquareMove', ({ lobbyID, squarePosition }) => {
    socket.to(lobbyID).emit('redSquareMove', squarePosition);
  });

  // Handle user click on red square
  socket.on('userClickedSquare', ({username, lobbyID}) => {
    if (username && lobbyID) {
      socket.to(lobbyID).emit('userClickedSquare', { username });
    } else {
      console.error('Received invalid data:');
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');

    // Remove user from lobbies and notify other users...
    // This is left as an exercise, and should consider cases where the disconnected user is the lobby owner.
    const sessionIndex = activeSessions.findIndex((session) => session.sessionID === socket.id);
    if (sessionIndex !== -1) {
      activeSessions.splice(sessionIndex, 1);
    }
  });

  socket.on('updateLobby', (updatedLobby) => {
    if (lobbies[updatedLobby.lobbyID]) {
      lobbies[updatedLobby.lobbyID] = updatedLobby;
      io.to(updatedLobby.lobbyID).emit('lobbyUpdate', updatedLobby);
    }
  });
});

server.listen(port, () => console.log(`Server started on port ${port}`));