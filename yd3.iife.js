var yd3 = (function (exports, d3$1) {
  'use strict';

  function author() {
    /**
   * This library aims to provide the simplest but very powerful and flexible way to draw a graph on a web page.
   * One only needs to provide data in a 2d array format and an optional object contains all the figure options.
   * Every single option was carefully thought to provide the best possible user experience.
   * 
   * This library uses 2d array as data format instead of an array of objects for two reasons:
   * 1. 2d array looks more structurized and easier for visual perception.
   * 2. The order of key value pair in objects is not reliable in Javascript.
   */

    let copyright = 'Copyright ' + (new Date).getFullYear() + ' Yalin Chen';
    let info = `***yd3, an easy to use data visualization javascript library build on top of d3js
  @author Yalin Chen yc.about@gmail.com
  ${copyright}***`;
    return info
  }

  /**
   * A base class used for simple and grouped graph with axises, such as bar, line, and scatter.
   */
  class BaseSimpleGroupAxis {
    /**
     * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
     * @param {object=} options  An optional object contains following key value pairs:
     *                              common option key values pairs
     *                              graph specific key value pairs:
     *                                colors, describing the colors used for positive bars and negative bars in the format of `colors: ['steelblue', '#CC2529']`.   
     */
    constructor(data, options) {
      this._options = options;    //_ does not have any real effect, just visually indicate private variables.
      this._data = data;
      this._brand = 'yfigure';
    }

    /**
     * This function parses the command options for a graph.
     * @param {object} options An option object contains key value pair describing the options of a graph.
     *         common options (see yfigure opitons documentation)
     * @return {array} an array of each individual option.
     */
    _getCommonOption(options) {

      // set defaul values so no need to feed options in a way none or all
      options.location ? true : options.location = 'body';
      options.id ? true : options.id = this._brand + 'id' + Math.floor(Math.random() * 1000000).toString();
      options.width ? true : options.width = 400;
      options.height ? true : options.height = 300;

      let location = options.location;
      let id = options.id;
      let width = parseInt(options.width);
      let height = parseInt(options.height);

      let marginTop, marginLeft, marginBottom, marginRight;

      function makeError(msg) {
        throw new Error(msg)
      }

      // make margin short cut for all margin
      if (options.margin) {

        (typeof options.margin !== 'string' && typeof options.margin !== 'number') ? makeError('Option margin need to be an string or number!') : true;

        marginTop = marginLeft = marginBottom = marginRight = parseInt(options.margin);

        // any one of the margin is set
      } else if (options['marginLeft'] || ['marginTop'] || options['marginRight'] || options['marginBottom']) {
        options['marginLeft'] ? true : options['marginLeft'] = 25;
        options['marginTop'] ? true : options['marginTop'] = 25;
        options['marginRight'] ? true : options['marginRight'] = 25;
        options['marginBottom'] ? true : options['marginBottom'] = 25;

        //validate format
        (typeof options['marginLeft'] !== 'string' && typeof options['marginLeft'] !== 'number') ? makeError('Option marginLeft need to be an string or number!') : true;
        (typeof options['marginTop'] !== 'string' && typeof options['marginTop'] !== 'number') ? makeError('Option marginTop need to be an string or number!') : true;
        (typeof options['marginRight'] !== 'string' && typeof options['marginRight'] !== 'number') ? makeError('Option marginRight need to be an string or number!') : true;
        (typeof options['marginBottom'] !== 'string' && typeof options['marginBottom'] !== 'number') ? makeError('Option marginBottom need to be an string or number!') : true;

        marginLeft = parseInt(options['marginLeft']);
        marginTop = parseInt(options['marginTop']);
        marginRight = parseInt(options['marginRight']);
        marginBottom = parseInt(options['marginBottom']);

      } else {
        options.margin = 25;
        marginTop = marginLeft = marginBottom = marginRight = options.margin;
      }


      let frameTop, frameLeft, frameBottom, frameRight;

      // make margin short cut for all margin
      if (options.frame) {

        (typeof options.frame !== 'string' && typeof options.frame !== 'number') ? makeError('Option frame need to be an string or number!') : true;

        frameTop = frameLeft = frameBottom = frameRight = parseInt(options.frame);


        // any one of the margin is set
      } else if (options.frameLeft || options.frameTop || options.frameRight || options.frameBottom) {
        options.frameLeft ? true : options.frameLeft = 30;
        options.frameTop ? true : options.frameTop = 30;
        options.frameRight ? true : options.frameRight = 30;
        options.frameBottom ? true : options.frameBottom = 30;

        //validate format
        (typeof options.frameLeft !== 'string' && typeof options.frameLeft !== 'number') ? makeError('Option frameLeft need to be an string or number!') : true;
        (typeof options.frameTop !== 'string' && typeof options.frameTop !== 'number') ? makeError('Option frameTop need to be an string or number!') : true;
        (typeof options.frameRight !== 'string' && typeof options.frameRight !== 'number') ? makeError('Option frameRight need to be an string or number!') : true;
        (typeof options.frameBottom !== 'string' && typeof options.frameBottom !== 'number') ? makeError('Option frameBottom need to be an string or number!') : true;

        frameLeft = parseInt(options.frameLeft);
        frameTop = parseInt(options.frameTop);
        frameRight = parseInt(options.frameRight);
        frameBottom = parseInt(options.frameBottom);

      } else {
        options.frame = 30;
        frameTop = frameLeft = frameBottom = frameRight = parseInt(options.frame);
      }

      //validate format
      (typeof options.width !== 'string' && typeof options.width !== 'number') ? makeError('Option width need to be an string or number!') : true;
      (typeof options.height !== 'string' && typeof options.height !== 'number') ? makeError('Option height need to be an string or number!') : true;
      typeof options.location !== 'string' ? makeError('Option location need to be an string or number!') : true;
      typeof options.id !== 'string' ? makeError('Option id need to be an string or number!') : true;

      //parse float just in case and get parameters
      let innerWidth = width - marginLeft - marginRight - frameLeft - frameRight;
      let innerHeight = height - marginTop - marginBottom - frameTop - frameBottom;

      return [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id]
    }


    /**
     * This function parses the axis options for a graph.
     * @param {object} options An option object contains key value pair describing the axis options of a graph.
     *         axis options
     * @return {array} an array of each individual axis option.
     */
    _getAxisOption(options) {

      // set defaul values so no need to feed options in a way none or all
      options.xAxisPosition ? true : options.xAxisPosition = ['bottom'];  // for none or both xAxisPosition = [], yAxisPosition = ['left', 'right']
      options.yAxisPosition ? true : options.yAxisPosition = ['left'];
      options.xTitlePosition ? true : options.xTitlePosition = ['bottom'];
      options.yTitlePosition ? true : options.yTitlePosition = ['left'];

      options.xAxisFont ? true : options.xAxisFont = '10px sans-serif';
      options.yAxisFont ? true : options.yAxisFont = '10px sans-serif';
      options.xTitleFont ? true : options.xTitleFont = '14px sans-serif';
      options.yTitleFont ? true : options.yTitleFont = '14px sans-serif';

      function makeError(msg) {
        throw new Error(msg)
      }

      //validate format
      !Array.isArray(options.xAxisPosition) ? makeError('Option xAxisPosition need to be an array!') : true;
      !Array.isArray(options.yAxisPosition) ? makeError('Option yAxisPosition need to be an array!') : true;
      !Array.isArray(options.xTitlePosition) ? makeError('Option xTitlePosition need to be an array!') : true;
      !Array.isArray(options.yTitlePosition) ? makeError('Option yTitlePosition need to be an array!') : true;

      typeof options.xAxisFont !== 'string' ? makeError('Option xAxisFont need to be an string!') : true;
      typeof options.yAxisFont !== 'string' ? makeError('Option yAxisFont need to be an string!') : true;
      typeof options.xTitleFont !== 'string' ? makeError('Option xTitleFont need to be an string!') : true;
      typeof options.yTitleFont !== 'string' ? makeError('Option yTitleFont need to be an string!') : true;

      //parse float just in case and get parameters
      let xAxisPosition = options.xAxisPosition;
      let yAxisPosition = options.yAxisPosition;
      let xTitlePosition = options.xTitlePosition;
      let yTitlePosition = options.yTitlePosition;
      let xAxisFont = options.xAxisFont;
      let yAxisFont = options.yAxisFont;
      let xTitleFont = options.xTitleFont;
      let yTitleFont = options.yTitleFont;

      return [xAxisPosition, yAxisPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]
    }

    /**
     * This function validates 2d array data format
     * @param {2darray} data  A 2d array data for the graph, in the format of `[['xName', 'y1Name', 'y2Name'...],['xValue', 'y1Value', 'y2Value'...]]`.  
     */
    _validate2dArray(data) {
      //validate 2d array data format
      if (!Array.isArray(data) || !data.every((row) => Array.isArray(row))) {
        throw new Error('data need to be a 2d array!')
      }
    }

    /**
     * This function parses the data parameters for a graph.
     * @param {2darray} data A 2d array data for the graph, such as [['xName', 'y1Name', 'y2Name'...],['xValue', 'y1Value', 'y2Value'...]].
     * @return {array} an array of each individual parameter.
     */
    _setDataParameters(data) {
      // take first column as x name label, of the first object
      let xDataName = data[0][0];
      let xDataIndex = 0;

      //more than one y data columns
      let yDataNames = data[0].slice(1);

      let yDataName = (yDataNames.length == 1 ? data[0][1] : '');

      // get ride of column name, does not modify origin array
      let dataValue = data.slice(1);

      //get max and min data for each y columns
      let maxYArray = [];
      let minYArray = [];
      for (let j = 0; j < yDataNames.length; j++) {
        maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
        minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
      }

      let dataMax = d3.max(maxYArray);
      let dataMin = d3.min(minYArray);

      return [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin]
    }

    _drawAxis(...[svg, xScale, yScale, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, xDataName, yDataName,
      xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]) {
      //x axis
      for (let i = 0; i < Math.min(xPosition.length, 2); i++) {
        svg
          .append('g')
          .style("font", xAxisFont)
          .attr('transform', `translate(0, ${xPosition[i] == 'top' ? 0 : innerHeight})`)
          .call(xPosition[i] == 'top' ? d3.axisTop(xScale) : d3.axisBottom(xScale));
      }

      //x axis title
      for (let i = 0; i < Math.min(xTitlePosition.length, 2); i++) {
        svg
          .append("text")
          .style('font', xTitleFont)
          .attr("text-anchor", "middle")  // transform is applied to the middle anchor
          .attr("dominant-baseline", xTitlePosition[i] == 'top' ? "baseline" : "hanging")   //text vertical reference point
          .attr("transform", `translate(${innerWidth / 2}, ${xTitlePosition[i] == 'top' ? -frameTop : innerHeight + frameBottom})`)  // centre at margin bottom/top
          .text(xDataName);
      }

      //y axis
      for (let i = 0; i < Math.min(yPosition.length, 2); i++) {
        svg
          .append('g')
          .style("font", yAxisFont)
          .attr('transform', `translate(${yPosition[i] == 'right' ? innerWidth : 0}, 0)`)
          .call(yPosition[i] == 'right' ? d3.axisRight(yScale) : d3.axisLeft(yScale));
      }

      //y axis title
      for (let i = 0; i < Math.min(yTitlePosition.length, 2); i++) {
        svg
          .append("text")
          .style('font', yTitleFont)
          .attr("text-anchor", "middle")  // transform is applied to the middle anchor
          .attr("dominant-baseline", yTitlePosition[i] == 'right' ? "hanging" : "baseline")   //text vertical reference point
          .attr("transform", `translate(${yTitlePosition[i] == 'right' ? innerWidth + frameRight : -frameLeft}, ${innerHeight / 2}) rotate(-90)`)  // centre at margin left/right
          .text(yDataName);
      }
    }


    /**
     * This function set the data point object to be shown on mouseover for a graph.
     * @return {string} a string format of dataPointDisplay object ID to be selected.
     */
    _setDataPoint() {

      let dataPointDisplayId = this._brand + 'DataPointDisplay999sky999sky999sky';

      //add it if there is no such element, so there is only one per page
      if (!d3.select('#' + dataPointDisplayId).node()) {
        // add mouse over text
        d3.select('body')
          .append('p')
          .attr('id', dataPointDisplayId)
          .style("position", "absolute")
          .style("background", "white")
          .style("padding", "5px")
          .style("border-radius", "6px")
          .style("display", "none")
          .style('font-size', '1.2em');
      }

      return dataPointDisplayId;
    }

    // update the graph by drawing a new one
    update(data, options = {}) {
      //remove old graph
      d3.select('#' + this._options.id).remove();
      //merge new options with old
      let newOptions = { ...this._options, ...options };
      // totally re-draw a graph
      this._draw(data, newOptions);
    }

  }

  //to do, axis label show, lable rotate, each bar each color, 0 bar no show, grid, x title based on tick width


  /**
  * A Bar class for a horizontal simple or grouped bar graph (y represents continuous value).
  */
  class Bar extends BaseSimpleGroupAxis {
    /**
     * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
     * @param {object=} options  An optional object contains following key value pairs:
     *                              common option key values pairs
     *                              graph specific key value pairs:
     *                                `colors: ['steelblue', '#CC2529']` Sets color for positive or negative values, or colors for different y variables
     *                                `barPadding: 0.1` Sets bar paddings between the bar, or bar group
     */
    constructor(data, options = {}) {
      super(data, options);

      //set up graph specific option
      this._options.colors ? true : this._options.colors = ['#396AB1', '#CC2529', '#DA7C30', '#3E9651', '#535154', '#6B4C9A', '#922428', '#948B3D'];
      this._options.barPadding ? true : this._options.barPadding = 0.1;

      //validate format
      if (typeof this._options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }
      if (typeof this._options.barPadding !== 'number') { throw new Error('Option barPadding need to be a number!') }

      this._validate2dArray(this._data);
      this._draw(this._data, this._options);
    }

    /**
  * This function draws a horizontal bar graph (y represents continuous value) using d3 and svg.  
  * @return {string}         append a graph to html and returns the graph id.  
  */
    _draw(data, options) {

      let colors = options.colors;
      let barPadding = options.barPadding;

      // set all the common options
      let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id] = this._getCommonOption(options);

      // set all the axis options
      let [xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont] = this._getAxisOption(options);

      // set data parameters
      let [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin] = this._setDataParameters(data);

      // make data plot approximately 10% range off the range
      let ySetback = (dataMax - dataMin) * 0.1;

      // if there is negative data, set y min. Otherwise choose 0 as default y min
      let yMin = (dataMin < 0 ? dataMin - ySetback : 0);
      // when there is postive data, set y max. Otherwsie choose 0 as default y max
      let yMax = (dataMax > 0 ? dataMax + ySetback : 0);

      let svg = d3$1.select(location)
        .append('svg')
        .attr('id', id)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

      let xScale = d3$1.scaleBand()
        .domain(dataValue.map((element) => element[xDataIndex]))
        .range([0, innerWidth])
        .padding(barPadding);

      let xSubScale = d3$1.scaleBand()
        .domain(yDataNames)
        .range([0, xScale.bandwidth()])
        .padding(0.03);

      let yScale = d3$1.scaleLinear()
        .domain([yMin, yMax])
        .range([innerHeight, 0]);

      //colors for difference lines
      let colorScale = d3$1.scaleOrdinal()
        .domain(yDataNames)
        .range(colors);

      // initialize legend position
      let legendx = 8;
      let legendy = 8;

      // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
      let dataPointDisplayId = this._setDataPoint();

      // draw each y data
      for (let i = 0; i < yDataNames.length; i++) {

        svg
          .append('g')
          .selectAll('rect')
          .data(dataValue)
          .join('rect')
          .attr("transform", element => `translate(${xScale(element[xDataIndex])}, 0)`)
          .attr('x', xSubScale(yDataNames[i]))
          .attr('width', xSubScale.bandwidth())
          .attr('y', element => yScale(Math.max(element[i + 1], 0)))       // if negative, use y(0) as starting point
          .attr('height', element => Math.abs(yScale(element[i + 1]) - yScale(0)))  // height = distance to y(0)
          .attr('fill', element => {
            if (yDataNames.length == 1) {
              return element[i + 1] > 0 ? colors[0] : colors[1]
            } else {
              return colorScale(yDataNames[i])
            }
          })
          .on('mouseover', (element) => {
            d3$1.select('#' + dataPointDisplayId)
              .style('display', null)
              .style('top', (d3$1.event.pageY - 20) + 'px')
              .style('left', (d3$1.event.pageX + 'px'))
              .text(element[xDataIndex] + ': ' + element[i + 1]);
          })
          .on('mousemove', (element) => {
            d3$1.select('#' + dataPointDisplayId)
              .style('display', null)
              .style('top', (d3$1.event.pageY - 20) + 'px')
              .style('left', (d3$1.event.pageX + 'px'))
              .text(element[xDataIndex] + ': ' + element[i + 1]);
          })
          .on('mouseout', () => d3$1.select('#' + dataPointDisplayId).style('display', 'none'));

        if (yDataNames.length > 1) {
          // Add legend
          // if add current legend spill over innerWidth
          if (legendx + yDataNames[i].length * 8 + 12 > innerWidth) {
            legendy += 16;    // start a new line
            legendx = 8;
          }

          svg
            .append("rect")
            .attr("x", legendx)
            .attr("y", legendy)
            .attr("width", 8)
            .attr("height", 8)
            .attr("fill", colorScale(yDataNames[i]));

          svg
            .append('text')
            .attr("alignment-baseline", "middle")  // transform is applied to the middle anchor
            .attr("transform", "translate(" + (legendx + 12) + "," + (legendy + 4) + ")")  // evenly across inner width, at margin top 2/3
            .attr('fill', colorScale(yDataNames[i]))
            .text(yDataNames[i]);

          // set up next legend x and y
          legendx += yDataNames[i].length * 8 + 20;
        }
      }

      // set default x axis to top if y max is 0
      if (yMax == 0 && xPosition.length == 1 && xPosition[0] == 'bottom') xPosition = ['top'];
      // set default x axisTitle to top if y max is 0
      if (yMax == 0 && xTitlePosition.length == 1 && xTitlePosition[0] == 'bottom') xTitlePosition = ['top'];

      this._drawAxis(...[svg, xScale, yScale, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, xDataName, yDataName,
        xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]);  

      // add line at y = 0 when there is negative data
      if (yMin != 0 && yMax != 0) {
        svg.append("path")
          .attr("stroke", 'black')
          .attr("d", d3$1.line()([[0, yScale(0)], [innerWidth, yScale(0)]]));
      }
      return id;
    }
  }

  /**
  * A Histogram class for a histogram graph (y represents frequency).  
  */
  class Histogram extends BaseSimpleGroupAxis {
    /**
     * 
     * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
     * @param {object=} options  An optional object contains following key value pairs:
     *                          common option key values pairs
     *                          graph specific key value pairs:
     *                            `nBins: 70` Sets how many bins to put the data in
     *                            `color: 'steelblue'` Sets the colors used for bars 
     */
    constructor(data, options = {}) {
      super(data, options);
      //set up graph specific option
      this._options.nBins ? true : this._options.nBins = 50;
      this._options.color ? true : this._options.color = 'steelblue';

      //validate format
      if (typeof this._options.nBins !== 'number') { throw new Error('Option nBins need to be an array object!') }
      if (typeof this._options.color !== 'string') { throw new Error('Option color need to be a string!') }

      this._validate2dArray(this._data);
      this._draw(this._data, this._options);
    }

    /**
   * @return {string}          append a graph to html and returns the graph id.  
   */
    _draw(data, options) {

      // set all the common options
      let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id] = this._getCommonOption(options);

      // set all the axis options
      let [xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont] = this._getAxisOption(options);

      let nBins = options.nBins;
      let color = options.color;

      let xDataName = data[0][0];
      let xDataIndex = 0;
      let yDataName = 'Frequency';

      // get ride of column name, does not modify origin array
      let dataValue = data.slice(1);

      let dataMax = d3$1.max(dataValue, d => d[xDataIndex]);
      let dataMin = d3$1.min(dataValue, d => d[xDataIndex]);

      let svg = d3$1.select(location)
        .append('svg')
        .attr('id', id)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

      // X axis scale
      let xScale = d3$1.scaleLinear()
        .domain([dataMin, dataMax])
        .range([0, innerWidth]);

      //evenly generate an array of thresholds, each value = min + nthPortion*(max-min)/nBins
      let portion = (dataMax - dataMin) / nBins;
      let thresholdArray = [];
      for (let i = 0; i < nBins; i++) {
        thresholdArray.push(dataMin + i * portion);
      }

      // set the parameters for the histogram
      let histogram = d3$1.histogram()
        .value(d => d[xDataIndex])
        .domain(xScale.domain())
        .thresholds(thresholdArray); // split data into bins

      // to get the bins
      let bins = histogram(dataValue);

      let yScale = d3$1.scaleLinear()
        .range([innerHeight, 0])
        .domain([0, d3$1.max(bins, d => d.length * 1.1)]);

      // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
      let dataPointDisplayId = this._setDataPoint();

      // append the bar rectangles to the svg element
      svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
        .attr("height", d => innerHeight - yScale(d.length))
        .style("fill", color)
        .on('mouseover', (d) => {
          d3$1.select('#' + dataPointDisplayId)
            .style('display', null)
            .style('top', (d3$1.event.pageY - 20) + 'px')
            .style('left', (d3$1.event.pageX + 'px'))
            .text('[' + Math.round((d.x0 + Number.EPSILON) * 100) / 100 + '-' + Math.round((d.x1 + Number.EPSILON) * 100) / 100 + '] : ' + d.length);
        })
        .on('mousemove', (d) => {
          d3$1.select('#' + dataPointDisplayId)
            .style('display', null)
            .style('top', (d3$1.event.pageY - 20) + 'px')
            .style('left', (d3$1.event.pageX + 'px'))
            .text('[' + Math.round((d.x0 + Number.EPSILON) * 100) / 100 + '-' + Math.round((d.x1 + Number.EPSILON) * 100) / 100 + '] : ' + d.length);
        })
        .on('mouseout', () => d3$1.select('#' + dataPointDisplayId).style('display', 'none'));

      this._drawAxis(...[svg, xScale, yScale, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, xDataName, yDataName,
        xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]);

      return id;

    }

  }

  /**
   * A LineDot class for a line with dot graph (y represents continuous value).  
   */
  class LineDot extends BaseSimpleGroupAxis {
    /**
     * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnY1Name', 'columnY2Name'],['a', n1, n2],['b', n3, n4]]`.  
     * @param {object=} options An optional object contains following key value pairs:
     *                          common option key values pairs
     *                          graph specific key value pairs:
     *                            `dotRadius: 4` Sets the radius of the dot, value `1` produce a line graph.
     *                            `colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']`. Sets the colors for difference lines
     */
    constructor(data, options = {}) {
      super(data, options);

      //set up graph specific option
      this._options.colors ? true : this._options.colors = ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'];
      this._options.dotRadius ? true : this._options.dotRadius = 4;
      //validate format
      if (typeof this._options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }
      if (typeof this._options.dotRadius !== 'number') { throw new Error('Option dotRadius need to be a number!') }

      this._validate2dArray(this._data);
      this._draw(this._data, this._options);
    }

    /**
     * This function draws a single or multiple line with dot graph (y represents continuous value) using d3 and svg.  
     * @return {string}         append a graph to html and returns the graph id.  
     */
    _draw(data, options) {

      let colors = options.colors;
      let dotRadius = options.dotRadius;

      // set all the common options
      let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id] = this._getCommonOption(options);

      // set all the axis options
      let [xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont] = this._getAxisOption(options);

      // set data parameters
      let [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin] = this._setDataParameters(data);

      // make highest number approximately 10% range off the range
      let ySetback = (dataMax - dataMin) * 0.1;  //10% of data range

      let yMin = dataMin - ySetback;
      let yMax = dataMax + ySetback;

      let svg = d3$1.select(location)
        .append('svg')
        .attr('id', id)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

      //scalePoint can use padding but not scaleOrdinal
      let xScale = d3$1.scalePoint()
        .domain(dataValue.map((element) => element[xDataIndex]))
        .range([0, innerWidth])
        .padding(0.2);

      let yScale = d3$1.scaleLinear()
        .domain([yMin, yMax])  // data points off axis
        .range([innerHeight, 0]);

      //colors for difference lines
      let colorScale = d3$1.scaleOrdinal()
        .domain(yDataNames)
        .range(colors);

      // initialize legend position
      let legendx = 8;
      let legendy = 8;

      // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
      let dataPointDisplayId = this._setDataPoint();

      // draw each y data
      for (let i = 0; i < yDataNames.length; i++) {
        // draw a line
        svg.append("path")
          .datum(dataValue)
          .attr("fill", "none")
          .attr("stroke", colorScale(yDataNames[i]))
          .attr("stroke-width", 2)
          .attr("d", d3$1.line()
            .x(function (element) { return xScale(element[xDataIndex]) })
            .y(function (element) { return yScale(element[i + 1]) })
          );

        // Add the points
        svg
          .append("g")
          .selectAll("circle")
          .data(dataValue)
          .join("circle")
          .attr("cx", function (element) { return xScale(element[xDataIndex]) })
          .attr("cy", function (element) { return yScale(element[i + 1]) })
          .attr("r", dotRadius)
          .attr("fill", colorScale(yDataNames[i]))
          .on('mouseover', (element) => {
            d3$1.select('#' + dataPointDisplayId)
              .style('display', null)
              .style('top', (d3$1.event.pageY - 20) + 'px')
              .style('left', (d3$1.event.pageX + 'px'))
              .text(element[xDataIndex] + ': ' + element[i + 1]);
          })
          .on('mousemove', (element) => {
            d3$1.select('#' + dataPointDisplayId)
              .style('display', null)
              .style('top', (d3$1.event.pageY - 20) + 'px')
              .style('left', (d3$1.event.pageX + 'px'))
              .text(element[xDataIndex] + ': ' + element[i + 1]);
          })
          .on('mouseout', () => d3$1.select('#' + dataPointDisplayId).style('display', 'none'));

        if (yDataNames.length > 1) {
          // Add legend
          // if add current legend spill over innerWidth
          if (legendx + yDataNames[i].length * 8 + 24 > innerWidth) {
            legendy += 16;    // start a new line
            legendx = 8;
          }

          svg
            .append('path')
            .attr("stroke", colorScale(yDataNames[i]))
            .attr("stroke-width", 2)
            .attr("d", d3$1.line()([[legendx, legendy], [legendx + 20, legendy]]));

          svg
            .append("circle")
            .attr("cx", legendx + 10)
            .attr("cy", legendy)
            .attr("r", 3)
            .attr("fill", colorScale(yDataNames[i]));

          svg
            .append('text')
            .attr("alignment-baseline", "middle")  // transform is applied to the middle anchor
            .attr("transform", "translate(" + (legendx + 24) + "," + legendy + ")")  // evenly across inner width, at margin top 2/3
            .attr('fill', colorScale(yDataNames[i]))
            .text(yDataNames[i]);

          // set up next legend x and y
          legendx += yDataNames[i].length * 8 + 32;
        }
      }

      // set default x axis to top if y max is 0
      if (yMax == 0 && xPosition.length == 1 && xPosition[0] == 'bottom') xPosition = ['top'];

      // set default x axisTitle to top if y max is 0
      if (yMax == 0 && xTitlePosition.length == 1 && xTitlePosition[0] == 'bottom') xTitlePosition = ['top'];

      this._drawAxis(...[svg, xScale, yScale, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, xDataName, yDataName,
        xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]);

      // add line at y = 0 when there is negative data
      if (yMin <= 0 && yMax >= 0) {
        svg.append("path")
          .attr("stroke", 'black')
          .attr("d", d3$1.line()([[0, yScale(0)], [innerWidth, yScale(0)]]));
      }

      return id;

    }
  }

  /**
   * A Scatter class for a single or multiple scatter graph (x and y represent continuous values).  
   */
  class Scatter extends BaseSimpleGroupAxis {
    /**
     * @param {array} data      A 2d array data in the format of `[['columnXName',  'columnY1Name', 'columnY2Name'],['a', n1, n2],['b', n3, n4]]`.  
     * @param {object=} options An optional object contains following key value pairs:
     *                          common option key values pairs
     *                          graph specific key value pairs:
     *                            `dotRadius: 4` Sets the radius of the dot.
     *                            `colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']`. Sets the colors for difference lines.
     */
    constructor(data, options = {}) {
      super(data, options);

      //set up graph specific option
      this._options.colors ? true : this._options.colors = ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'];
      this._options.dotRadius ? true : this._options.dotRadius = 4;
      //validate format
      if (typeof this._options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }
      if (typeof this._options.dotRadius !== 'number') { throw new Error('Option dotRadius need to be a number!') }

      this._validate2dArray(this._data);
      this._draw(this._data, this._options);
    }

    /**
     * This function draws a scatter plot (x, y represents continuous value) using d3 and svg.  
     * @return {string}         append a graph to html and returns the graph id.  
     */
    _draw(data, options) {

      let colors = options.colors;
      let dotRadius = options.dotRadius;

      // set all the common options
      let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id] = this._getCommonOption(options);

      // set all the axis options
      let [xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont] = this._getAxisOption(options);

      // set data parameters
      let [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin] = this._setDataParameters(data);

      // make highest number approximately 10% range off the range
      let ySetback = (dataMax - dataMin) * 0.1;  //10% of data range

      let yMin = dataMin - ySetback;
      let yMax = dataMax + ySetback;

      // set up x scale, make data points approximately 2% off axis
      let xMax = d3$1.max(dataValue, element => element[xDataIndex]);
      let xMin = d3$1.min(dataValue, element => element[xDataIndex]);
      let xSetback = (xMax - xMin) * 0.02;

      let svg = d3$1.select(location)
        .append('svg')
        .attr('id', id)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

      let xScale = d3$1.scaleLinear()
        .domain([xMin - xSetback, xMax])  // data points off axis
        .range([0, innerWidth]);

      let yScale = d3$1.scaleLinear()
        .domain([yMin, yMax])  // data points off axis
        .range([innerHeight, 0]);

      //colors for difference lines
      let colorScale = d3$1.scaleOrdinal()
        .domain(yDataNames)
        .range(colors);

      // initialize legend position
      let legendx = 8;
      let legendy = 8;

      // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
      let dataPointDisplayId = this._setDataPoint();

      // draw each y
      for (let i = 0; i < yDataNames.length; i++) {

        // Add the points
        svg
          .append("g")
          .selectAll("circle")
          .data(dataValue)
          .enter()
          .append("circle")
          .attr("cx", function (element) { return xScale(element[xDataIndex]) })
          .attr("cy", function (element) { return yScale(element[i + 1]) })
          .attr("r", dotRadius)
          .attr("fill", colorScale(yDataNames[i]))
          .on('mouseover', (element) => {
            d3$1.select('#' + dataPointDisplayId)
              .style('display', null)
              .style('top', (d3$1.event.pageY - 20) + 'px')
              .style('left', (d3$1.event.pageX + 'px'))
              .text(element[xDataIndex] + ': ' + element[i + 1]);
          })
          .on('mousemove', (element) => {
            d3$1.select('#' + dataPointDisplayId)
              .style('display', null)
              .style('top', (d3$1.event.pageY - 20) + 'px')
              .style('left', (d3$1.event.pageX + 'px'))
              .text(element[xDataIndex] + ': ' + element[i + 1]);
          })
          .on('mouseout', () => d3$1.select('#' + dataPointDisplayId).style('display', 'none'));

        if (yDataNames.length > 1) {
          // Add legend
          // if add current legend spill over innerWidth
          if (legendx + yDataNames[i].length * 8 + 10 > innerWidth) {
            legendy += 16;    // start a new line
            legendx = 8;
          }

          svg
            .append("circle")
            .attr("cx", legendx + 3)
            .attr("cy", legendy)
            .attr("r", 3)
            .attr("fill", colorScale(yDataNames[i]));

          svg
            .append('text')
            .attr("alignment-baseline", "middle")  // transform is applied to the middle anchor
            .attr("transform", "translate(" + (legendx + 10) + "," + legendy + ")")  // evenly across inner width, at margin top 2/3
            .attr('fill', colorScale(yDataNames[i]))
            .text(yDataNames[i]);

          // set up next legend x and y
          legendx += yDataNames[i].length * 8 + 18;
        }
      }

      // set default x axis to top if y max is 0
      if (yMax == 0 && xPosition.length == 1 && xPosition[0] == 'bottom') xPosition = ['top'];
      // set default x axisTitle to top if y max is 0
      if (yMax == 0 && xTitlePosition.length == 1 && xTitlePosition[0] == 'bottom') xTitlePosition = ['top'];


      this._drawAxis(...[svg, xScale, yScale, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, xDataName, yDataName,
        xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]);

      // add line at y = 0 when there is negative data
      if (yMin <= 0 && yMax >= 0) {
        svg.append("path")
          .attr("stroke", 'black')
          .attr("d", d3$1.line()([[0, yScale(0)], [innerWidth, yScale(0)]]));
      }

      return id;

    }
  }

  /**
   * A SortableBar class for a sortable bar graph (y represent continuous values).  
   */
  class SortableBar extends BaseSimpleGroupAxis {
    /**
     * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
     * @param {object=} options An optional object contains following key value pairs:
     *                          common option key values pairs
     *                          graph specific key value pairs:
     *                             `colors: ['steelblue', '#CC2529']` Sets color for positive or negative values, or colors for different y variables
     *                             `barPadding: 0.1` Sets bar paddings between the bar, or bar group
     */
    constructor(data, options = {}) {
      super(data, options);

      //set up graph specific option
      this._options.colors ? true : this._options.colors = ['steelblue', '#CC2529'];
      this._options.barPadding ? true : this._options.barPadding = 0.1;
      //validate format
      if (typeof this._options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }
      if (typeof this._options.barPadding !== 'number') { throw new Error('Option barPadding need to be a number between 0 and 1!') }

      this._validate2dArray(this._data);
      this._draw(this._data, this._options);
    }

    /**
     * This function draws a horizontal sortable bar graph (y represents continuous value) using d3 and svg.  
     * @return {string}         append a graph to html and returns the graph id.  
     */
    _draw(data, options) {

      let colors = options.colors;
      let barPadding = options.barPadding;

      // set all the common options
      let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id] = this._getCommonOption(options);

      // set all the axis options
      let [xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont] = this._getAxisOption(options);

      // take first column as x name label, second column as y name label, of the first object
      let xDataName = data[0][0];
      let yDataName = data[0][1];
      // x y data positions
      let xDataIndex = 0;
      let yDataIndex = 1;

      // get ride of column name, does not modify origin array
      let dataValue = data.slice(1);

      let selection = d3$1.select(location)
        .append('span')       //non-block container
        .attr('style', `display:inline-block; width: ${width}px`)        //px need to be specified, otherwise not working
        .attr('id', id)
        .append('div')   // make it on top of figure
        .attr('style', `margin: ${marginTop}px 0 0 ${marginLeft}px`)        //px need to be specified, otherwise not working
        .text('Sort by: ')
        .append('select');

      selection.selectAll("option")
        .data(['default', 'descending', 'ascending'])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

      let svg = d3$1.select('#' + id)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

      // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
      let dataPointDisplayId = this._setDataPoint();
      
      // use arrow function to automatically bind this.
      const draw = (dataValue, svg, order) => {
        let innerData;
        switch (order) {
          case 'descending':
            // this creates a deep copy of data so the original data can be preserved
            innerData = JSON.parse(JSON.stringify(dataValue));
            innerData.sort((a, b) => b[yDataIndex] - a[yDataIndex]);
            break;
          case 'ascending':
            innerData = JSON.parse(JSON.stringify(dataValue));
            innerData.sort((a, b) => a[yDataIndex] - b[yDataIndex]);
            break;
          default:
            innerData = dataValue;
        }

        let dataMax = d3$1.max(innerData, element => element[yDataIndex]);
        let dataMin = d3$1.min(innerData, element => element[yDataIndex]);

        // make tallest bar approximately 10% range off the range
        let ySetback = (dataMax - dataMin) * 0.1;

        // if there is negative data, set y min. Otherwise choose 0 as default y min
        let yMin = (dataMin < 0 ? dataMin - ySetback : 0);
        // when there is postive data, set y max. Otherwsie choose 0 as default y max
        let yMax = (dataMax > 0 ? dataMax + ySetback : 0);

        //x and y scale inside function for purpose of update (general purpose, not necessary but no harm in this case)
        let xScale = d3$1.scaleBand()
          .domain(innerData.map((element) => element[xDataIndex]))
          .range([0, innerWidth])
          .padding(barPadding);

        let yScale = d3$1.scaleLinear()
          .domain([yMin, yMax])
          .range([innerHeight, 0]);

        //draw graph, update works with select rect
        svg
          .selectAll('rect')
          .data(innerData)
          .join(
            enter => enter.append('rect'),
            update => update
          )
          .attr('x', element => xScale(element[xDataIndex]))
          .attr('width', xScale.bandwidth())
          .attr('y', element => yScale(Math.max(element[yDataIndex], 0)))       // if negative, use y(0) as starting point
          .attr('height', element => Math.abs(yScale(element[yDataIndex]) - yScale(0)))  // height = distance to y(0)
          .attr('fill', element => element[yDataIndex] > 0 ? colors[0] : colors[1])
          .on('mouseover', (element) => {
            d3$1.select('#' + dataPointDisplayId)
              .style('display', null)
              .style('top', (d3$1.event.pageY - 20) + 'px')
              .style('left', (d3$1.event.pageX + 'px'))
              .text(element[xDataIndex] + ': ' + element[yDataIndex]);
          })
          .on('mousemove', (element) => {
            d3$1.select('#' + dataPointDisplayId)
              .style('display', null)
              .style('top', (d3$1.event.pageY - 20) + 'px')
              .style('left', (d3$1.event.pageX + 'px'))
              .text(element[xDataIndex] + ': ' + element[yDataIndex]);
          })
          .on('mouseout', () => d3$1.select('#' + dataPointDisplayId).style('display', 'none'));


        d3$1.select('#' + id + 'xyl999').remove();

        // set default x axis to top if y max is 0
        if (yMax == 0 && xTitlePosition.length == 1 && xTitlePosition[0] == 'bottom') xTitlePosition = ['top'];
        // set default x axisTitle to top if y max is 0
        if (yMax == 0 && xPosition.length == 1 && xPosition[0] == 'bottom') xPosition = ['top'];

        //set the axis group
        svg = svg
          .append('g')
          .attr('id', id + 'xyl999');

        this._drawAxis(...[svg, xScale, yScale, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, xDataName, yDataName,
          xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]);

        // add line at y = 0 when there is negative data
        if (yMin != 0 && yMax != 0) {
          svg.append("path")
            .attr("stroke", 'black')
            .attr("d", d3$1.line()([[0, yScale(0)], [innerWidth, yScale(0)]]));
        }

      };

      //initialize
      draw(dataValue, svg, 'default');

      selection
        .on('change', function () {
          draw(dataValue, svg, this.value);
        });

      return id;
    }
  }

  exports.Bar = Bar;
  exports.Histogram = Histogram;
  exports.LineDot = LineDot;
  exports.Scatter = Scatter;
  exports.SortableBar = SortableBar;
  exports.author = author;

  return exports;

}({}, d3));
