import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Licence from './components/licence';
import Doc from './components/doc';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/licence" component={Licence} />
        <Route exact path="/doc" component={Doc} />
      </Router>
     </div>
  );
}

export default App;