import React from 'react';
import { Link } from 'react-router-dom';
import getStarted1 from '../media/getStarted1.png'
import getStarted2 from '../media/getStarted2.png'
import getStarted3 from '../media/getStarted3.png'
import getStarted4 from '../media/getStarted4.png'

function GetStart() {
  return (
    <div>
      <div className="container text-left">
        <div id="importantButtons">
        <span><Link to="#" className="btn btn-success"><font size="5">Buy Licence</font></Link></span>
        <span><a className="btn btn-secondary" href="/getStarted.png" download><font size="5">Download</font></a></span>
        </div>
        <hr />
        <h4 className="text-left">Get start</h4>
        <p>1. Add the YFigure library to your html: </p>
        <p><img src={getStarted1} alt='code'></img></p>
        <p>2. Use it in Javascript (write anywhere below 1.).</p>
        <p>E.g., add a figure to the html body: </p>
        <p><img src={getStarted2} alt='code'></img></p>
        <p>3. To add to a speicific location:</p>
        <p>3a. Add to your html file:</p>
        <p><img src={getStarted3} alt='code'></img></p>
        <p>3b. Add a grouped bar to that location: </p>
        <p><img src={getStarted4} alt='code'></img></p>
        <p>Enjoy!</p>

      </div>
    </div >
  )
}

export default GetStart;

