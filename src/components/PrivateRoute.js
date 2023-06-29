import React from 'react';
import { Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import MenuComponent from './components/Menu';
import LoginComponent from './components/Login';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn() ? (  // isLoggedIn() is a function that checks if user is logged in
        <Component {...props} />
      ) : (
        <Navigate to="/login" />
      )
    }
  />
);

const App = () => (
  <Router>
    <div>
      <PrivateRoute path="/menu" component={MenuComponent} />
      <Route path="/login" component={LoginComponent} />
    </div>
  </Router>
);

export default App;
