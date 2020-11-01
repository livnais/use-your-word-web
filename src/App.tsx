import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import HomeScreen from "./Screens/Home";
import GameScreen from "./Screens/Game";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/Game" component={GameScreen} />
        <Route path="/" component={HomeScreen} />
      </Switch>
    </Router>
  );
}

export default App;
