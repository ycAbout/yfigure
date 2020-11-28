import React from 'react';
import {Link} from 'react-router-dom';

function Nav () {
      return (
          <nav id="websiteNav" className="navbar navbar-expand-lg navbar-light bg-info">
            <Link className="navbar-brand" to="./">YFigure</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to="./">Home <span className="sr-only">(current)</span></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="./licence">Buy Licence </Link>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="/awesomeyfigure/yfigure.min.js" download>Download Latest</a>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="./doc">Documentation</Link>
                </li>
              </ul>
            </div>
          </nav>
      );
  }
  
  export default Nav;