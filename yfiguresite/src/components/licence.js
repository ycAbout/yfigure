import React from 'react';
import Nav from './nav';
import './home.css';
import Header from './header';
import Footer from './footer';

function SingleLicence() {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Single Developer Licence</h5>
        <p>Early bird promotion price: </p> 
        <p>$49 CAD</p>
        <p> Full price: </p>
        <p> <strike>$99 CAD</strike></p>
        <p> Up to a year free update </p>
        <p className="card-text">please email: <a href="mailto:example@tutorialspark.com">yc.about@gmail.com</a> for more information.</p>
      </div>
    </div>)
}

function Licence() {
  return (
    <div>
      <header>
        <Header />
      </header>
      <nav>
        <Nav />
        <br />
      </nav>
      <SingleLicence/>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Licence;