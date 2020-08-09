import * as d3 from 'd3';
import { BaseSimpleGroupAxis } from './baseClass.js';

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
   */
  constructor(data, options = {}) {
    super(data, options);

    //set up graph specific option
    this._options.dotRadius ? true : this._options.dotRadius = 4;
    (this._options.legendX || parseInt(this._options.legendX) === 0) ? true : this._options.legendX = 0.18;
    (this._options.legendY || parseInt(this._options.legendY) === 0) ? true : this._options.legendY = 0.12;
    this._options.legendWidth ? true :this._options.legendWidth = 600;
    this._options.legendFont ? true : this._options.legendFont = '10px sans-serif';

    //validate format
    if (typeof this._options.dotRadius !== 'number') { throw new Error('Option dotRadius need to be a number!') }

    function validateNumStr(numStrToBe, errorString) {
      (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
    }
    validateNumStr(this._options.legendX, 'legendX');
    validateNumStr(this._options.legendY, 'legendY');
    validateNumStr(this._options.legendWidth, 'legendWidth');

    typeof this._options.legendFont !== 'string' ? makeError(`Option legendFont needs to be a string!`) : true;

    this._validate2dArray(this._data);
    this._draw(this._data, this._options);
  }

  /**
   * This function draws a scatter plot (x, y represents continuous value) using d3 and svg.  
   * @return {string}         append a graph to html and returns the graph id.  
   */
  _draw(data, options) {

    let dotRadius = options.dotRadius;

    let legendX = Math.min(parseFloat(options.legendX), 0.98);
    let legendY = Math.min(parseFloat(options.legendY), 0.98);
    let legendWidth = parseFloat(options.legendWidth);
    let legendFont = options.legendFont;


    // set all the common options
    let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
      innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

    // set all the axis options
    let axisOptionArray = this._getAxisOption(options);

    let xPadding = options.xPadding;
    let yPadding = options.yPadding;

    // set data parameters
    let [xDataName, xDataIndex, yDataNames, yDataName, dataValue] = this._setDataParameters(data);

    let svg = d3.select(location)
      .append('svg')
      .attr('id', id)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', backgroundColor)
      .append('g')
      .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

    //colors for difference lines
    let colorScale = d3.scaleOrdinal()
      .domain(yDataNames)
      .range(colors);

    // initialize legend position
    let legendx = legendX * width;
    let legendy = legendY * height;

    // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
    let dataPointDisplayId = this._setDataPoint();

    // to hold legend click status, the y data selection status
    let legendState = new Array(yDataNames.length).fill(1);

    const drawModule = () => {

      let yNamesSelected = yDataNames.filter((name, index) => legendState[index] == 1);

      //get max and min data for each y columns
      let maxYArray = [];
      let minYArray = [];
      for (let j = 0; j < yDataNames.length; j++) {
        if (yNamesSelected.length === 0) {         // no data selected, normal
          maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
          minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
        } else if (legendState[j]) {               // some data selected, only for selected data
          maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
          minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
        }
      }

      let dataMax = d3.max(maxYArray);
      let dataMin = d3.min(minYArray);

      // make highest number approximately 10% range off the range
      let ySetback = (dataMax - dataMin) * yPadding;  //10% of data range

      let yMin = dataMin - ySetback;
      let yMax = dataMax + ySetback;

      // set up x scale, make data points approximately 2% off axis
      let xMax = d3.max(dataValue, element => element[xDataIndex]);
      let xMin = d3.min(dataValue, element => element[xDataIndex]);
      let xSetback = (xMax - xMin) * xPadding;

      let xScale = d3.scaleLinear()
        .domain([xMin - xSetback, xMax])  // data points off axis
        .range([0, innerWidth]);

      let yScale = d3.scaleLinear()
        .domain([yMin, yMax])  // data points off axis
        .range([innerHeight, 0]);


      // remove old content group if exist and draw a new one
      if (svg.select('#' + id + 'sky999all').node()) {
        svg.select('#' + id + 'sky999all').remove();
      }

      //set the bar group, assign svg to content because there need something on the same level to make remove then add work, don't know why
      let content = svg
        .append('g')
        .attr('id', id + 'sky999all');

      // draw each y
      for (let i = 0; i < yDataNames.length; i++) {
        // if legend is unclicked
        if (legendState[i]) {
          // Add the points
          content
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
              d3.select('#' + dataPointDisplayId)
                .style('display', null)
                .style('top', (d3.event.pageY - 20) + 'px')
                .style('left', (d3.event.pageX + 'px'))
                .text(element[xDataIndex] + ': ' + element[i + 1]);
            })
            .on('mousemove', (element) => {
              d3.select('#' + dataPointDisplayId)
                .style('display', null)
                .style('top', (d3.event.pageY - 20) + 'px')
                .style('left', (d3.event.pageX + 'px'))
                .text(element[xDataIndex] + ': ' + element[i + 1]);
            })
            .on('mouseout', () => d3.select('#' + dataPointDisplayId).style('display', 'none'));
        }
      }

      content = content
        .append('g')
        .attr('id', id + 'xyl999');

      let horizontal = false;
      this._drawAxis(...[content, xScale, yScale, yMin, yMax, xDataName, yDataName, innerWidth, innerHeight,
        frameTop, frameBottom, frameRight, frameLeft, horizontal], ...axisOptionArray);

    }

    // first draw
    drawModule();

    // Add legend
    if (yDataNames.length > 1) {
      let legend = svg
        .append("g")
        .attr("transform", `translate(${-(frameLeft + marginLeft)}, ${-(frameTop + marginTop)})`);  // move to the beginning
      // draw each y legend
      for (let i = 0; i < yDataNames.length; i++) {
        let legendText = legend
          .append('text')
          .style('font', legendFont)
          .attr("transform", `translate(${legendx + 12}, ${legendy})`)
          .attr("dy", "0.8em")
          .attr('fill', colorScale(yDataNames[i]))
          .text(yDataNames[i])
          .attr("key", i)
          .on("click", function () {
            let position = parseInt(this.getAttribute('key'));
            legendState[position] = 1 - legendState[position];
            this.setAttribute("opacity", Math.max(legendState[position], 0.5));
            drawModule();
          });

        let textWidth = legendText.node().getBBox().width;
        let textHeight = legendText.node().getBBox().height;

        legend
          .append("circle")
          .attr("transform", `translate(${legendx + 4}, ${legendy + 4 + (textHeight - 12) / 2})`)
          .attr("r", 4)
          .attr("fill", colorScale(yDataNames[i]));

        // set up next legend x and y
        legendx += 12 + textWidth + 8;

        // if there is another
        if (i + 1 < yDataNames.length) {
          //test bbox for next one
          let nextLegendText = legend
            .append('text')
            .text(yDataNames[i + 1]);
          let nextTextWidth = nextLegendText.node().getBBox().width;
          nextLegendText.remove();

          // if add next legend spill over innerWidth
          if (legendx + 12 + nextTextWidth > Math.min(legendX * width + legendWidth, width)) {
            legendy += textHeight + 2;    // start a new line
            legendx = legendX * width;
          }
        }
      }
    }

    this._drawTitle(...[svg, width, height, marginLeft, marginTop, frameTop, frameLeft, title, titleFont, titleColor, titleX, titleY, titleRotate]);

    return id;
  }
}

export { Scatter }