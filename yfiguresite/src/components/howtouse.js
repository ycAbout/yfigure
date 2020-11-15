import React from 'react';

function HowToUse() {
  return (
    <div className="container text-left">
      <p>1. Add the YFigure library to your html: </p>
      <p>
        <code>&lt;script src='&lt;yourpath&gt;'/yfigure.min.js&gt;&lt;script&gt;</code>
      </p>
      <p>2a. Add a figure to the html body (write anywhere below 1.): </p>
      <div>
        <p>
          <code>
            &lt;script&gt;
            <div>let dataBar = [["group", "score"], [1, 50], [2, 80], [3, -30], [4, -80], [5, 40]];</div>
            <br />
            <div>let bar1 = new yf.Bar( dataBar, &#123; //key:value options (optional) &#125;);</div>
            &lt;script&gt;
        </code>
        </p>
      </div>
      <h6>To add to a speicific location:</h6>
      <p>2b.1. Add to your html file:</p>
      <p>
        <code>&lt;div id='awesomeYFigure1'&gt;&lt;/div&gt;</code>
      </p>
      <p>2b.2. Add a grouped bar to that location: </p>
      <div>
        <p>
          <code>
            &lt;script&gt;
            <div>let tech = [['Quarter', 'MSFT', 'APPL', 'AMZN'], ['1st', 91, 84, 88],['2nd', 103, 91, 93], ['3rd', 106, 101, 86], ['4th', 120, 131, 92]];</div>
            <br/>
            <div>let groupBar = new yf.Bar(tech, &#123; location: '#awesomeYFigure1' &#125;);</div>
            <div>&lt;script&gt;</div>
          </code>
        </p>
      </div>
    </div>
  )
}

export default HowToUse;