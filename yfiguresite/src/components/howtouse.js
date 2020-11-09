import React from 'react';

function HowToUse() {
  return (
    <div className="container text-left">
      <p>1. Add the YFigure library to your html: </p>
      <p>
        <code>&lt;script src='&lt;yourpath&gt;'/yfigure.js&gt;&lt;script&gt;</code>
      </p>
      <p>2. Use it in Javascript (write anywhere below 1.).</p>
      <p>E.g., add a figure to the html body: </p>
      <p>
        <div><code>&lt;script&gt;</code></div>
        <div><code>let dataBar = [["group", "score"], [1, 50], [2, 80], [3, -30], [4, -80], [5, 40]];</code></div>
        <div><code>let bar1 = new yf.Bar(dataBar, &#123; //key:value options&#125;);</code></div>
        <div><code>&lt;script&gt;</code></div>
      </p>
      <p>3. To add to a speicific location:</p>
      <p>3a. Add to your html file:</p>
      <p>
        <div><code>&lt;div id='awesomeYFigure1'&gt;&lt;/div&gt;</code></div>
      </p>
      <p>3b. Add a grouped bar to that location: </p>
      <p>
        <div><code>&lt;script&gt;</code></div>
        <div><code>let tech = [['Quarter', 'MSFT', 'APPL', 'AMZN'], ['1st', 91, 84, 88],['2nd', 103, 91, 93], ['3rd', 106, 101, 86], ['4th', 120, 131, 92]];</code></div>
        <div><code>let groupBar = new yf.Bar(tech, &#123;location: '#awesomeYFigure1'&#125;);</code></div>
        <div><code>&lt;script&gt;</code></div>
      </p>
    </div>
  )
}

export default HowToUse;