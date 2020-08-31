import React from 'react';
import { Link } from 'react-router-dom';

function GetStart () {
    return (
        <div>
          <div className="container text-left small">
            <br />
            <div className="btn-group">
             <Link to="#" className="btn btn-success"><h4>Buy Licence</h4></Link>

             <Link to="#" className="btn btn-secondary"><h4>Download</h4></Link>
           </div>
            <hr/>
            <h4 className="text-left">Get start</h4>
          </div>
        </div>
      )
}

export default GetStart;

