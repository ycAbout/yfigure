import React from 'react';
import Nav from './nav';
import './home.css';
import Header from './header';
import Demo from './demo';
import GetStart from './getStart';
import Footer from './footer';

function Home() {
  return (
    <div>
      <header>
        <Header />
      </header>
      <nav>
        <Nav />
        <br />
      </nav>
      <div id="majorContent">
      <main>
        <div>
          <Demo />
        </div>
        <hr />
      </main>
      <aside>
        <GetStart />
        <br />
      </aside>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Home;