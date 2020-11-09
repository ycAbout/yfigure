import React, { useState, useEffect } from 'react';
import Nav from './nav';
import './home.css';
import Header from './header';
import Footer from './footer';
import HowtoUse from './howtouse';

function DocIndex() {
  return (
    <aside id='docIndex'>
      <ul>
        <li><a className='text-dark' href="#introduction">Introduction</a></li>
        <li><a className='text-dark' href="#howToUse">How to use</a></li>
        <li><a className='text-dark' href="#classAPIReference">Class API reference</a></li>
        <ul>
          <li><a className='text-dark' href='#apiBar'>Bar</a></li>
          <ul>
            <li><a className='text-dark' href='#apiGroupedBar'>Grouped Bar</a></li>
            <li><a className='text-dark' href='#apiSimpleBar'>Simple Bar</a></li>
            <li><a className='text-dark' href='#apiStackedBar'>Stacked Bar</a></li>
            <li><a className='text-dark' href='#apiHorizontalBar'>Horizontal Bar</a></li>
          </ul>
          <li><a className='text-dark' href='#apiSortableBar'>SortableBar</a></li>
          <li><a className='text-dark' href='#apiHistogram'>Histogram</a></li>
          <li><a className='text-dark' href='#apiLineDot'>LineDot</a></li>
          <ul>
            <li><a className='text-dark' href='#apiLineDot'>Line Dot</a></li>
            <li><a className='text-dark' href='#apiLine'>Line</a></li>
          </ul>
          <li><a className='text-dark' href='#apiScatter'>Scatter</a></li>
        </ul>
        <li><a className='text-dark' href='#apiCommon'>Common options</a></li>
        <li><a className='text-dark' href='#apiAxis'>axis options</a></li>
      </ul>
    </aside>
  )
}

function DocContent() {
  return (
    <main className="docMain">
      <section id='introduction'>
        <h2>Introduction</h2>
        <p>Copyright 2020 Yalin Chen yc.about@gmail.com </p>
        <p>
          There are plenty figure libraries, but yfigure aims to provide an easier to use but very powerful and flexible tool to draw a figure in html.
          </p>
      </section>
      <section id='howToUse'>
        <h2>How to use</h2>
        <article>
          <HowtoUse />
        </article>
      </section>
      <section id='classAPIReference'>
        <h2>Class API reference</h2>
        <article>
          <h3 id='apiBar'>yf.Bar(data, options = &#123;&#125;)</h3>
          <div><code>* @param [[2d array]] data</code></div>
          <p>A 2d array in the format of [[column1Name, column2Name],[Row1Column1Value, Row1Column2Value],[Row2Column1Value, Row2Column2Value]...]`.
        Column1 is the category name of the data, column2 is the value.</p>
          <p>E.g.,
          <code>[["group", "score"], [1, 50], [2, 80], [3, -30], [4, -80]]</code>
          </p>
          <div><code>* @param &#123;object=&#125; options</code></div>
          <p>
            An optional object contains all figure options in the format of key value pairs
            <code>&#123; option1Name: option1Value, option2Name: option2Value, ...&#125;</code>,
            e.g. <code>&#123;width:'400', height: '300'&#125;</code>
          </p>
          <h4 id='apiGroupedBar'>- Grouped Bar</h4>
          <p>simply include more than two columns in data.</p>
          <p>E.g.,</p>
          <code>
            let techData = [['Quarter', 'MSFT', 'APPL', 'AMZN'], ['1st', 91, 84, 88],['2nd', 103, 91, 93], ['3rd', 106, 101, 86], ['4th', 120, 131, 92]]
        </code>
          <h4 id='apiSimpleBar'>- Simple Bar</h4>
          <p>simply include only two columns in data.</p>
        E.g.,
        let techData = [['Quarter', 'APPL'], ['1st', 84],['2nd', 91], ['3rd', 101], ['4th', 131]]
        <h4 id='apiStackedBar'>- Stacked Bar</h4>
          <p>simply include `stacked: true` in options.</p>

          <h4 id='apiHorizontalBar'>- Horizontal Bar</h4>
          <p>simply include `horizontal: true` in options.</p>
          <h3 id='apiSortableBar'>yf.SortableBar(data, options = &#123;&#125;)</h3>
          <p>the same as the simple bar, but is sortable.</p>

          <h3 id='apiHistogram'>yf.Histogram(data, options = &#123;&#125;)</h3>
          <div><code>* @param [[2d array]] data</code></div>
        A 2d array in the format of `[[column1Name],[Row1Column1Value],[Row2Column1Value]...]`.
        Column1 is value of the data
        <div><code>* @param &#123;object=&#125; options</code></div>
        same as bar.

        <h3 id='apiLineDot'>yf.LineDot(data, options = &#123;&#125;)</h3>
          <div><code>* @param [[2d array]] data</code></div>
        same as bar.
        <div><code>* @param &#123;object=&#125; options</code></div>
        same as bar.

        <h4 id='apiLineDot'>- Line Dot</h4>
        * by default.
        <h4 id='apiLine'>- Line</h4>
        * simply include `dotRadius: 1` or a half of `lineStrokeWidth` in options.

        <h3 id='apiScatter'>yf.Scatter(data, options = &#123;&#125;)</h3>
          <div><code>* @param [[2d array]] data</code></div>
        same as bar, except first column is numeric.
        <div><code>* @param &#123;object=&#125; options</code></div>
        same as bar.

        </article>
        <article>
          <h3 id='apiCommon'> Common options:</h3>
          <table className='table table-sm'>
            <tr>
              <th>key</th>
              <th>value (default/example)</th>
              <th>comments</th>
            </tr>
            <tr><td>width</td> <td>400</td> <td> Sets width of the svg</td></tr>
            <tr><td>height</td> <td>300</td> <td> Sets height of the svg</td></tr>
            <tr><td>margin</td> <td>25</td> <td>Sets all the margin properties in one declaration, overrides individual margin settings.</td></tr>
            <tr><td>marginLeft</td> <td>25</td> <td>Sets inside margin</td></tr>
            <tr><td>marginTop</td> <td>25</td> <td>Sets inside margin</td></tr>
            <tr><td>marginRight</td> <td>25</td> <td>Sets inside margin</td></tr>
            <tr><td>marginBottom</td> <td>25</td> <td>Sets inside margin</td></tr>
            <tr><td>frame</td> <td>25</td> <td>Sets all the frame properties in one declaration, overrides individual frame settings. frame is to hold axises.</td></tr>
            <tr><td>frameLeft</td> <td>25</td> <td>Sets inside frame</td></tr>
            <tr><td>frameTop</td> <td>25</td> <td>Sets inside frame</td></tr>
            <tr><td>frameRight</td> <td>25</td> <td>Sets inside frame</td></tr>
            <tr><td>frameBottom</td> <td>25</td> <td>Sets inside frame</td></tr>
            <tr><td>location</td> <td>'body'</td> <td>Sets the html location where to put the graph // for id, use location: '#ID'</td></tr>
            <tr><td>id</td> <td>'graph123456'</td> <td>  Sets the id of graph</td></tr>
            <tr><td>colors</td><td>['#396AB1', '#CC2529', '#DA7C30', '#3E9651', '#535154', '#6B4C9A', '#922428', '#948B3D']</td> <td>Sets colors</td></tr>
            <tr><td>backgroundColor</td> <td>''</td> <td>Sets the background color of the figure</td></tr>
            <tr><td>title</td> <td>''</td> <td>Sets figure title</td></tr>
            <tr><td>titleFont</td> <td>'20px sans-serif'</td> <td>Sets figure title properties</td></tr>
            <tr><td>titleColor</td> <td>'black'</td> <td>Sets figure title properties</td></tr>
            <tr><td>titleX</td> <td>0.5</td> <td>Sets figure title  properties  // 0 - 1 from left to right</td></tr>
            <tr><td>titleY</td> <td>0</td> <td>Sets figure title  properties  // 0 - 1  from top to bottom</td></tr>
            <tr><td>titleRotate</td> <td>0</td> <td>Sets figure title properties // needs to between (-45 to 45)</td></tr>
          </table>
        </article>
        <article>
          <h3 id='apiAxis'> axis options: </h3>
          <table className='table table-sm'>
            <tr>
              <th>key</th>
              <th>value (default/example)</th>
              <th>comments</th>
            </tr>
            <tr><td>xAxisPosition</td><td>['bottom']</td><td> Sets axis location   // for none or both, e.g., xAxisPosition: [], xAxisPosition: ['left',   'right']</td></tr>
            <tr><td>yAxisPosition</td><td>['left']</td><td> Sets axis location    // for none or both, e.g., yAxisPosition: [], yAxisPosition: ['left',   'right']</td></tr>
            <tr><td>xTitlePosition</td><td>['bottom']</td><td>Sets axis title location    // for none or both, e.g., xTitlePosition: [], xTitlePosition: ['left', 'right']</td></tr>
            <tr><td>yTitlePosition</td><td>['left']</td><td>Sets axis title location    // for none or both, e.g., yTitlePosition: [], yTitlePosition: ['left', 'right']</td></tr>
            <tr><td>xTitle</td><td>''</td><td>Sets the x axis title, override xDataName, use space string ' 'to remove it</td></tr>
            <tr><td>yTitle</td><td>''</td><td>Sets the y axis title, override yDataName, use space string ' 'to remove it</td></tr>
            <tr><td>xPadding</td><td>0.1</td><td>Sets the x data padding on axis</td></tr>
            <tr><td>yPadding</td><td>0.1</td><td>Sets the y data padding on axis</td></tr>
            <tr><td>xAxisFont</td><td>'10px sans-serif'</td><td>Sets axis tick font</td></tr>
            <tr><td>yAxisFont</td><td>'10px sans-serif'</td><td>Sets axis tick font</td></tr>
            <tr><td>xTitleFont</td><td>'10px sans-serif'</td><td>Sets axis title font</td></tr>
            <tr><td>yTitleFont</td><td>'10px sans-serif'</td><td>Sets axis title font</td></tr>
            <tr><td>xTicks</td><td>null</td><td>Sets axis tick number  // approximate</td></tr>
            <tr><td>yTicks</td><td>null</td><td>Sets axis tick number  // approximate</td></tr>
            <tr><td>xTickSize</td><td>6</td><td>? Sets axis tick size, negative number changes direction</td></tr>
            <tr><td>yTickSize</td><td>6</td><td>? Sets axis tick size, negative number changes direction</td></tr>
            <tr><td>axisColor</td><td>''</td><td>Sets axises (and ticks), labels, and titles color in one declaration, overrides individual settings.</td></tr>
            <tr><td>xAxisColor</td><td>'black'</td><td>Set individual color</td></tr>
            <tr><td>yAxisColor</td><td>'black'</td><td>Set individual color</td></tr>
            <tr><td>xTitleColor</td><td>'black'</td><td>Set individual color</td></tr>
            <tr><td>yTitleColor</td><td>'black'</td><td>Set individual color</td></tr>
            <tr><td>xTickLabelColor</td><td>'black'</td><td>Set individual color</td></tr>
            <tr><td>yTickLabelColor</td><td>'black'</td><td>Set individual color</td></tr>
            <tr><td>axisStrokeWidth</td><td>1</td><td>Sets axis (and ticks) line width in one declaration, overrides individual settings.</td></tr>
            <tr><td>xAxisStrokeWidth</td><td>1</td><td>Sets individual line width</td></tr>
            <tr><td>yAxisStrokeWidth</td><td>1</td><td>Sets individual line width</td></tr>
            <tr><td>xTickStrokeWidth</td><td>1</td><td>Sets individual line width</td></tr>
            <tr><td>yTickStrokeWidth</td><td>1</td><td>Sets individual line width</td></tr>
            <tr><td>tickLabelHide</td><td>[]</td><td>Sets which axis tick label to hide // example values`['top 0 2 4', 'bottom 1 3 5', 'left 0 2 4', 'right 1 3 5']`</td></tr>
            <tr><td>axisLongLineRemove</td><td>[]</td><td>Sets which axis long line to removal // possible values`['top', 'bottom', 'left', 'right']`</td></tr>
            <tr><td>xTickLabelRotate</td><td>0</td><td>Sets x axis tick label rotating // needs to between (-90 to 90)</td></tr>
            <tr><td>xGridColor</td><td>''</td><td>Sets the x grid line color</td></tr>
            <tr><td>xGridDashArray</td><td>''</td><td>Sets the x grid line properties  // example values `'4 1'`</td></tr>
            <tr><td>xGridStrokeWidth</td><td>0</td><td>Sets the x grid line properties, 0 no show, change to 1 to show</td></tr>
            <tr><td>yGridColor</td><td>''</td><td>Sets the x grid line color</td></tr>
            <tr><td>yGridDashArray</td><td>''</td><td>Sets the x grid line properties  // example values `'4 1'`</td></tr>
            <tr><td>yGridStrokeWidth</td><td>0</td><td>Sets the x grid line properties, 0 no show, change to 1 to show</td></tr>
            <tr><td>line0</td><td>true</td><td>Sets whether line 0 (on x or y) will show if there is positive and negative data</td></tr>
            <tr><td>line0Stroke</td><td>'black'</td><td>Sets line0 properties</td></tr>
            <tr><td>line0StrokeWidth</td><td>1</td><td>Sets line0 properties   // 0 also no show</td></tr>
            <tr><td>line0DashArray</td><td>''</td><td>Sets line0 properties</td></tr>
          </table>
        </article>
      </section>
    </main>
  )
}

function Doc() {
  return (
    <div>
      <header>
        <Header />
      </header>
      <nav>
        <Nav />
        <br />
      </nav>
      <div id='docMajorContent'>
        <DocIndex />
        <DocContent />
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Doc;