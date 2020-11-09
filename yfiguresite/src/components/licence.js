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
        <p>The price is undecided yet, but it intended to be much cheaper than most products on market (less than $100 CAD).</p>
        <p className="card-text">please email: <a href="mailto:example@tutorialspark.com">yc.about@gmail.com</a> if you want to use it now.</p>
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