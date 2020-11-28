import React from 'react';
import { Link } from 'react-router-dom';
import HowtoUse from './howtouse';

function GetStart() {
  return (
    <div>
      <div className="container text-left">
        <div id="importantButtons">
          <span><Link to="./licence" className="btn btn-success"><font size="5">Buy Licence</font></Link></span>
          <span> </span>
          <span><a className="btn btn-secondary" href="/awesomeyfigure/yfigure.min.js" download><font size="4">Download</font></a></span>
        </div>
        <hr />
        <h5 className="text-left">
          <span>Get start in seconds</span>
          <span><Link className='text-secondary' to="./doc">(See full doc)</Link></span>
        </h5>
        <HowtoUse />
        <p>Enjoy!</p>
      </div>
    </div >
  )
}

export default GetStart;

