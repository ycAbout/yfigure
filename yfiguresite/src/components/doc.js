import React from 'react';
import Nav from './nav';
import './home.css';
import Header from './header';
import Footer from './footer';
import HowtoUse from './howtouse';

function DocIndex() {
  return (
    <aside id='docIndex'>
      <a className='text-dark' href="#top">&#x2191;Top</a>
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
          <li><a className='text-dark' href='#apiLine'>Line</a></li>
          <ul>
            <li><a className='text-dark' href='#apiLine'>Line</a></li>
            <li><a className='text-dark' href='#apiLineDot'>Line Dot</a></li>
          </ul>
          <li><a className='text-dark' href='#apiScatter'>Scatter</a></li>
          <li><a className='text-dark' href='#apiCommon'>Common options</a></li>
          <li><a className='text-dark' href='#apiAxis'>axis options</a></li>
        </ul>
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
          There are plenty figure libraries, but yfigure aims to provide an easier to use but very flexible tool to draw a figure in html.
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
          <p><code>* @param [[2d array]] data</code></p>
          <p>
            A 2d array in the format of <code>[[column1Name, column2Name],[Row1Column1Value, Row1Column2Value],[Row2Column1Value, Row2Column2Value]...]</code>. Column1 is the category name of the data, column2 is the value, e.g., <code>[["group", "score"], [1, 50], [2, 80], [3, -30], [4, -80]]</code>
          </p>
          <p><code>* @param &#123;object=&#125; options</code></p>
          <p>An optional object contains all figure options in the format of key value
            pairs <code>&#123; option1Name: option1Value, option2Name: option2Value, ...&#125;</code>,
            e.g., <code>&#123;width:'400', height: '300'&#125;</code>
          </p>

          <p>General options:</p>
          <p> -- see <a href='#apiCommon'>Common options</a> and <a href='#apiAxis'>Axis options</a></p>
          <p>Figure specific options:</p>
          <table className='table table-sm'>
            <thead>
              <tr>
                <th>key</th>
                <th>value (default/example)</th>
                <th>comments</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>withinGroupPadding</td><td>0</td><td>for grouped figures, the padding of bars within a group</td></tr>
              <tr><td>stacked</td><td>false</td><td>whether a stacked bar figure</td></tr>
              <tr><td>horizontal</td><td>false</td><td>whether a horizontal bar figure</td></tr>
              <tr><td>legendX</td><td>0.18</td><td>the x position of legend // value from 0-1</td></tr>
              <tr><td>legendY</td><td>0.12</td><td>the y position of legend // value from 0-1</td></tr>
              <tr><td>legendWidth</td><td>600</td><td>the width of the legends section, use a small number (e.g., 10) if you want vertical legends</td></tr>              <tr><td>legendFont</td><td>'10px sans-serif'</td><td>legend font</td></tr>
              <tr><td>legendOn</td><td>true</td><td>whether you want to show legend or not</td></tr>
              <tr><td>scaleStart</td><td>0</td><td>starting point for the y scale</td></tr>
            </tbody>
          </table>
          <h4 id='apiGroupedBar'>- Grouped Bar</h4>
          <p>Simply include more than two columns in data, e.g., </p>
          <p>
            <code>
              let techData = [['Quarter', 'MSFT', 'APPL', 'AMZN'], ['1st', 91, 84, 88],['2nd', 103, 91, 93], ['3rd', 106, 101, 86], ['4th', 120, 131, 92]]
              <div>let myfigure = new yf.Bar( techData, &#123; /*key:value options (optional)*/ &#125;);</div>
            </code>
          </p>
          <h4 id='apiSimpleBar'>- Simple Bar</h4>
          <p>Simply include only two columns in data, e.g., </p>
          <p>
            <code>
              let techData = [['Quarter', 'APPL'], ['1st', 84],['2nd', 91], ['3rd', 101], ['4th', 131]]
              <div>let myfigure = new yf.Bar( techData, &#123; /*key:value options (optional)*/ &#125;);</div>
            </code>
          </p>
          <h4 id='apiStackedBar'>- Stacked Bar</h4>
          <p>Simply include `stacked: true` in options, e.g., </p>
          <p>
            <code>
              let techData = [['Company', '1st', '2nd', '3rd'], ['MSFT', 91, 103, 106, 120],['APPL', 84, 91, 101, 131], ['AMZN', 88, 93, 86, 92]]
              <div>let myfigure = new yf.Bar( techData, &#123; stacked: true &#125;);</div>
            </code>
          </p>

          <h4 id='apiHorizontalBar'>- Horizontal Bar</h4>
          <p>Simply include `horizontal: true` in options, e.g., </p>
          <p>
            <code>
              let techData = [['Quarter', 'APPL'], ['1st', 84],['2nd', 91], ['3rd', 101], ['4th', 131]]
              <div>let myfigure = new yf.Bar( techData, &#123; horizontal: true &#125;);</div>            </code>
          </p>

          <h3 id='apiSortableBar'>yf.SortableBar(data, options = &#123;&#125;)</h3>
          <p>the same as the simple bar, but is sortable, e.g., </p>
          <p><code>* @param [[2d array]] data</code></p>
          <p>
            A 2d array in the format of <code>[[column1Name, column2Name],[Row1Column1Value, Row1Column2Value],[Row2Column1Value, Row2Column2Value]...]</code>. Column1 is the category name of the data, column2 is the value, e.g., <code>[["group", "score"], [1, 50], [2, 80], [3, -30], [4, -80]]</code>
          </p>
          <p><code>* @param &#123;object=&#125; options</code></p>
          <p>An optional object contains all figure options in the format of key value
            pairs <code>&#123; option1Name: option1Value, option2Name: option2Value, ...&#125;</code>,
            e.g., <code>&#123;width:'400', height: '300'&#125;</code>
          </p>

          <p>General options:</p>
          <p> -- see <a href='#apiCommon'>Common options</a> and <a href='#apiAxis'>Axis options</a></p>
          <p>Figure specific options:</p>
          <table className='table table-sm'>
            <thead>
              <tr>
                <th>key</th>
                <th>value (default/example)</th>
                <th>comments</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>horizontal</td><td>false</td><td>whether a horizontal sortable bar figure</td></tr>
            </tbody>
          </table>

          <p>
            <code>
              let techData = [['Company', '1st', '2nd', '3rd'], ['MSFT', 91, 103, 106, 120],['APPL', 84, 91, 101, 131], ['AMZN', 88, 93, 86, 92]]
              <div>let myfigure = new yf.SortableBar( techData, &#123; /*key:value options (optional)*/ &#125;);</div>
            </code>
          </p>


          <h3 id='apiHistogram'>yf.Histogram(data, options = &#123;&#125;)</h3>
          <p>
            <code>
              * @param [[2d array]] data
            </code>
          </p>
          <p>
            A 2d array in the format of <code>[[columnName],[Row1Value],[Row2Value]...], e.g., [['value'], [0.1], [2.62], [-0.8], [-0.55], [-1.41], [0.95]]</code>
          </p>
          <p><code>* @param &#123;object=&#125; options</code></p>
          <p>An optional object contains all figure options in the format of key value
            pairs <code>&#123; option1Name: option1Value, option2Name: option2Value, ...&#125;</code>,
            e.g., <code>&#123;width:'400', height: '300'&#125;</code>
          </p>

          <p>General options:</p>
          <p> -- see <a href='#apiCommon'>Common options</a> and <a href='#apiAxis'>Axis options</a></p>
          <p>Figure specific options:</p>
          <table className='table table-sm'>
            <thead>
              <tr>
                <th>key</th>
                <th>value (default/example)</th>
                <th>comments</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>nBins</td><td>50</td><td>number of bins for the histogram</td></tr>
              <tr><td>horizontal</td><td>false</td><td>whether a horizontal sortable bar figure</td></tr>
            </tbody>
          </table>
          <p>
            Example,
          </p>
          <p>
            <code>
              let normalDistribution = [['value'], [0.1], [2.62], [-0.8], [-0.55], [-1.41], [0.95], [-1.29], [1.06], [-0.78], [-1.36], [0.66], [1.11], [0.51],
              [-1.83], [-1.78], [-0.92], [-1.1], [-0.63], [-1.19], [1.18], [0.18], [-1.09], [1.03], [0.48], [-1.11], [0.18], [1.18], [-0.69],
              [-0.17], [1.38], [0.6], [0.31], [-0.53], [2.01], [0.49], [0.01], [0.07], [-0.25], [0.93], [-0.41], [1.54], [-0.36], [-2.4], [-0.65],
              [-0.3], [-1], [1.71], [0.15], [0.3], [-0.47], [0.05], [-0.29], [1.6], [0.76], [-0.16], [-0.37], [0.2], [0.83], [-0.71]]
              <div>let myfigure = new yf.new yf.Histogram(normalDistribution, &#123; /*key:value options (optional)*/ &#125;);</div>
            </code>
          </p>


          <h3 id='apiLine'>yf.Line(data, options = &#123;&#125;)</h3>
          <p><code>* @param [[2d array]] data</code></p>
          <p>
            A 2d array in the format of <code>[[column1Name, column2Name],[Row1Column1Value, Row1Column2Value],[Row2Column1Value, Row2Column2Value]...]</code>. Column1 is the category name of the data, column2 is the value, e.g., <code>[["group", "score"], [1, 50], [2, 80], [3, -30], [4, -80]]</code>
          </p>
          <p><code>* @param &#123;object=&#125; options</code></p>
          <p>An optional object contains all figure options in the format of key value
            pairs <code>&#123; option1Name: option1Value, option2Name: option2Value, ...&#125;</code>,
            e.g., <code>&#123;width:'400', height: '300'&#125;</code>
          </p>

          <p>General options:</p>
          <p> -- see <a href='#apiCommon'>Common options</a> and <a href='#apiAxis'>Axis options</a></p>
          <p>Figure specific options:</p>
          <table className='table table-sm'>
            <thead>
              <tr>
                <th>key</th>
                <th>value (default/example)</th>
                <th>comments</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>dotRadius</td><td>0</td><td>setup the dot size of the line / lineDot figure</td></tr>
              <tr><td>lineStrokeWidth</td><td>2</td><td>setup the line width</td></tr>
              <tr><td>horizontal</td><td>false</td><td>whether a horizontal figure</td></tr>
              <tr><td>legendX</td><td>0.18</td><td>the x position of legend // value from 0-1</td></tr>
              <tr><td>legendY</td><td>0.12</td><td>the y position of legend // value from 0-1</td></tr>
              <tr><td>legendWidth</td><td>600</td><td>the width of the legends section, use a small number (e.g., 10) if you want vertical legends</td></tr>
              <tr><td>legendFont</td><td>'10px sans-serif'</td><td>legend font</td></tr>
            </tbody>
          </table>

          <h4 id='apiLine'>- Line </h4>
          <p>
            By default.
          </p>
          <p>
            For a single line figure,
          </p>
          <p>
            <code>
              let gdpRate = [
              ['year', 'US'],
              ['2015', 2.86],
              ['2016', 1.49],
              ['2017', 2.27],
              ['2018', 2.80],
              ]
            <div>let myfigure = new yf.Line(gdpRate, &#123; /*key:value options (optional)*/ &#125;);</div>
            </code>
          </p>
          <p>
            For a multiple line figure,
          </p>
          <p>
            <code>
              let gdpRate = [
              ['year', 'China', 'US', 'Malaysia', 'Israel'],
              ['2015', 6.90, 2.86, 5.03, 3.04],
              ['2016', 6.70, 1.49, 4.22, 4.09],
              ['2017', 6.90, 2.27, 5.90, 3.33],
              ['2018', 6.50, 2.80, 4.70, 3.50],
              ]
              <div>let myfigure = new yf.Line(gdpRate, &#123; /*key:value options (optional)*/ &#125;);</div>
            </code>
          </p>


          <h4 id='apiLineDot'>- Line Dot</h4>
          <p>
            Simply include `dotRadius: 4` or other numbers in options, e.g.,
          </p>
          <p>
            <code>
              let gdpGrowth = [['year', 'Vietnam', 'Egypt', 'Canada'],['2016', 6.21, 4.35, 1.41,],['2017', 6.81, 4.18, 3.05,],['2018', 6.60, 5.30, 2.00,],    ]
              <div>let myfigure = new yf.Line(gdpGrowth, &#123; dotRadius: 4 &#125;);</div>
            </code>
          </p>

          <h3 id='apiScatter'>yf.Scatter(data, options = &#123;&#125;)</h3>
          <p><code>* @param [[2d array]] data</code></p>
          <p>
            A 2d array in the format of <code>[[column1Name, column2Name],[Row1Column1Value, Row1Column2Value],[Row2Column1Value, Row2Column2Value]...]</code>. Column1 is the category name of the data, column2 is the value. The first column is also numeric, e.g.,
            <code>[['mathScore', 'readingScore'], [72, 72], [69, 90], [90, 95], [71, 83]]</code>
          </p>
          <p><code>* @param &#123;object=&#125; options</code></p>
          <p>An optional object contains all figure options in the format of key value
            pairs <code>&#123; option1Name: option1Value, option2Name: option2Value, ...&#125;</code>,
            e.g., <code>&#123;width:'400', height: '300'&#125;</code>
          </p>

          <p>General options:</p>
          <p> -- see <a href='#apiCommon'>Common options</a> and <a href='#apiAxis'>Axis options</a></p>
          <p>Figure specific options:</p>
          <table className='table table-sm'>
            <thead>
              <tr>
                <th>key</th>
                <th>value (default/example)</th>
                <th>comments</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>dotRadius</td><td>4</td><td>setup the dot size of the line / lineDot figure</td></tr>
              <tr><td>lineStrokeWidth</td><td>2</td><td>setup the line width</td></tr>
              <tr><td>horizontal</td><td>false</td><td>whether a horizontal figure</td></tr>
              <tr><td>legendX</td><td>0.18</td><td>the x position of legend // value from 0-1</td></tr>
              <tr><td>legendY</td><td>0.12</td><td>the y position of legend // value from 0-1</td></tr>
              <tr><td>legendWidth</td><td>600</td><td>the width of the legends section, use a small number (e.g., 10) if you want vertical legends</td></tr>
              <tr><td>legendFont</td><td>'10px sans-serif'</td><td>legend font</td></tr>
            </tbody>
          </table>
          <p>
            Example,
          </p>
          <p>
            <code>
              let pseudoScatterData = [
              ['data1', 'data2', 'data3', 'data4'], [1, 0, 4, 8], [1, 0, 4, 8], [2, 1, 5, 9], [2, -1, 3, 7], [3, 2, 6, 10], [3, -2, 2, 6], [4, 3, 7, 11],
              [4, -3, 1, 5], [5, 4, 8, 12], [5, -4, 0, 4], [6, 5, 9, 13], [6, -5, -1, 3], [7, 6, 10, 14], [7, -6, -2, 2], [8, 7, 11, 15], [8, -7, -3, 1],
              [9, 8, 12, 16], [9, -8, -4, 0], [10, 9, 13, 17], [10, -9, -5, -1], [11, 9, 13, 17], [11, -9, -5, -1], [12, 8, 12, 16], [12, -8, -4, 0],
              [13, 7, 11, 15], [13, -7, -3, 1], [14, 6, 10, 14], [14, -6, -2, 2], [15, 5, 9, 13], [15, -5, -1, 3], [16, 4, 8, 12], [16, -4, 0, 4],
              [17, 3, 7, 11], [17, -3, 1, 5], [18, 2, 6, 10], [18, -2, 2, 6], [19, 1, 5, 9], [19, -1, 3, 7], [20, 0, 4, 8], [20, 0, 4, 8], [22, 1, 4, 6],
              [24, 2, 4, 4], [26, 3, 4, 2], [28, 4, 4, 0], [30, 5, 4, -1], [32, 6, 4, -2], [34, 7, 4, -3], [36, 8, 4, -4], [38, 9, 4, -5], [40, 10, 4, -6],
              [42, 11, 4, -7], [44, 12, 4, -8], [46, 13, 4, -9], [48, 14, 4, -10], [50, 15, 4, -11],];
              <div>let myfigure = new yf.Scatter(pseudoScatterData, &#123; /*key:value options (optional)*/ &#125;);</div>
            </code>
          </p>
        </article>
        <article>
          <h3 id='apiCommon'> Common options:</h3>
          <p>Those options are the common options that goes in to the options parameter in the format of key value
            pairs <code>&#123; option1Name: option1Value, option2Name: option2Value, ...&#125;</code>,
            e.g., <code>&#123;width:'400', height: '300'&#125;</code>
          </p>

          <table className='table table-sm'>
            <thead>
              <tr>
                <th>key</th>
                <th>value (default/example)</th>
                <th>comments</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>width</td><td>400</td><td> Sets width of the svg</td></tr>
              <tr><td>height</td><td>300</td><td> Sets height of the svg</td></tr>
              <tr><td>margin</td><td>25</td><td>Sets all the margin properties in one declaration, individual margin settings override it.</td></tr>
              <tr><td>marginLeft</td><td>25</td><td>Sets inside margin</td></tr>
              <tr><td>marginTop</td><td>25</td><td>Sets inside margin</td></tr>
              <tr><td>marginRight</td><td>25</td><td>Sets inside margin</td></tr>
              <tr><td>marginBottom</td><td>25</td><td>Sets inside margin</td></tr>
              <tr><td>frame</td><td>25</td><td>Sets all the frame properties in one declaration, individual frame settings override it. frame is to hold axises.</td></tr>
              <tr><td>frameLeft</td><td>25</td><td>Sets inside frame</td></tr>
              <tr><td>frameTop</td><td>25</td><td>Sets inside frame</td></tr>
              <tr><td>frameRight</td><td>25</td><td>Sets inside frame</td></tr>
              <tr><td>frameBottom</td><td>25</td><td>Sets inside frame</td></tr>
              <tr><td>location</td><td>'body'</td><td>Sets the html location where to put the graph // for id, use location: '#ID'</td></tr>
              <tr><td>id</td><td>'graph123456'</td><td>  Sets the id of graph</td></tr>
              <tr><td>colors</td><td>['#396AB1', '#CC2529', '#DA7C30', '#3E9651', '#535154', '#6B4C9A', '#922428', '#948B3D']</td><td>Sets colors</td></tr>
              <tr><td>backgroundColor</td><td>''</td><td>Sets the background color of the figure</td></tr>
              <tr><td>title</td><td>''</td><td>Sets figure title</td></tr>
              <tr><td>titleFont</td><td>'20px sans-serif'</td><td>Sets figure title properties</td></tr>
              <tr><td>titleColor</td><td>'black'</td><td>Sets figure title properties</td></tr>
              <tr><td>titleX</td><td>0.5</td><td>Sets figure title  properties  // 0 - 1 from left to right</td></tr>
              <tr><td>titleY</td><td>0</td><td>Sets figure title  properties  // 0 - 1  from top to bottom</td></tr>
              <tr><td>titleRotate</td><td>0</td><td>Sets figure title properties // needs to between (-45 to 45)</td></tr>
            </tbody>
          </table>
        </article>
        <article>
          <h3 id='apiAxis'> axis options: </h3>
          <p>Those options are the common axis options that goes in to the options parameter in the format of key value
            pairs <code>&#123; option1Name: option1Value, option2Name: option2Value, ...&#125;</code>,
            e.g., <code>&#123; xAxisPostion: ['bottom', 'top'], yAxisPosition: ['left', 'right'] &#125;</code>
          </p>

          <table className='table table-sm'>
            <thead>
              <tr>
                <th>key</th>
                <th>value (default/example)</th>
                <th>comments</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>xAxisPosition</td><td>['bottom']</td><td> Sets axis location   // for none or both, e.g., xAxisPosition: [], xAxisPosition: ['bottom', 'top']</td></tr>
              <tr><td>yAxisPosition</td><td>['left']</td><td> Sets axis location    // for none or both, e.g., yAxisPosition: [], yAxisPosition: ['left', 'right']</td></tr>
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
              <tr><td>axisColor</td><td>''</td><td>Sets axises (and ticks), labels, and titles color in one declaration, individual settings override it.</td></tr>
              <tr><td>xAxisColor</td><td>'black'</td><td>Set individual color</td></tr>
              <tr><td>yAxisColor</td><td>'black'</td><td>Set individual color</td></tr>
              <tr><td>xTitleColor</td><td>'black'</td><td>Set individual color</td></tr>
              <tr><td>yTitleColor</td><td>'black'</td><td>Set individual color</td></tr>
              <tr><td>xTickLabelColor</td><td>'black'</td><td>Set individual color</td></tr>
              <tr><td>yTickLabelColor</td><td>'black'</td><td>Set individual color</td></tr>
              <tr><td>axisStrokeWidth</td><td>1</td><td>Sets axis (and ticks) line width in one declaration, individual settings override it.</td></tr>
              <tr><td>xAxisStrokeWidth</td><td>1</td><td>Sets individual line width</td></tr>
              <tr><td>yAxisStrokeWidth</td><td>1</td><td>Sets individual line width</td></tr>
              <tr><td>xTickStrokeWidth</td><td>1</td><td>Sets individual line width</td></tr>
              <tr><td>yTickStrokeWidth</td><td>1</td><td>Sets individual line width</td></tr>
              <tr><td>tickLabelHide</td><td>[]</td><td>Sets which axis tick label to hide // example values`['top 0 2 4', 'bottom 1 3 5', 'left 0 2 4', 'right 1 3 5']`</td></tr>
              <tr><td>axisLineRemove</td><td>[]</td><td>Sets which axis line to be removed, keep ticks // possible values`['top', 'bottom', 'left', 'right']`</td></tr>
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
            </tbody>
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