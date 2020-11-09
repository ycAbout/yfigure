import React from 'react';
import { Link } from 'react-router-dom';
import HowtoUse from './howtouse';

function GetStart() {
  return (
    <div>
      <div className="container text-left">
        <div id="importantButtons">
          <span><Link to="./licence" className="btn btn-success"><font size="5">Buy Licence</font></Link></span>
          <span><a className="btn btn-secondary" href="/getStarted.png" download><font size="5">Download</font></a></span>
        </div>
        <hr />
        <h4 className="text-left">Get start</h4>
        <HowtoUse/>
        <p>Enjoy!</p>
      </div>
    </div >
  )
}

export default GetStart;

