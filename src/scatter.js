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
    let [xAxisPosition, xAxisPositionSet, yAxisPosition, xTitlePosition, yTitlePosition, yTitle, xAxisFont, yAxisFont, xTitleFont, yTitleFont,
      xTickLabelRotate, xTicks, yTicks, axisStroke, axisStrokeWidth, tickInward, tickLabelRemove, axisLongLineRemove, gridColor, gridDashArray, gridLineWidth, line0] = this._getAxisOption(options);

    // set data parameters
    let [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin] = this._setDataParameters(data);

    // if user specified yTitle
    if (yTitle !== '') yDataName = yTitle;

    // make highest number approximately 10% range off the range
    let ySetback = (dataMax - dataMin) * 0.1;  //10% of data range

    let yMin = dataMin - ySetback;
    let yMax = dataMax + ySetback;

    // set up x scale, make data points approximately 2% off axis
    let xMax = d3.max(dataValue, element => element[xDataIndex]);
    let xMin = d3.min(dataValue, element => element[xDataIndex]);
    let xSetback = (xMax - xMin) * 0.02;

    let svg = d3.select(location)
      .append('svg')
      .attr('id', id)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

    let xScale = d3.scaleLinear()
      .domain([xMin - xSetback, xMax])  // data points off axis
      .range([0, innerWidth]);

    let yScale = d3.scaleLinear()
      .domain([yMin, yMax])  // data points off axis
      .range([innerHeight, 0]);

    //colors for difference lines
    let colorScale = d3.scaleOrdinal()
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

    // default x Axis position
    if (!xAxisPositionSet) {
      // set default x axis to top if y max is 0
      if (yMax == 0 && xAxisPosition.length == 1 && xAxisPosition[0] == 'bottom') xAxisPosition = ['top'];
      // set default x axisTitle to top if y max is 0
      if (yMax == 0 && xTitlePosition.length == 1 && xTitlePosition[0] == 'bottom') xTitlePosition = ['top'];
    }

    // add line at y = 0 when there is negative data
    let drawLine0 = (line0 && ((yMin < 0 && yMax > 0) || ((yMin == 0 && !xAxisPosition.includes('bottom')) || (yMax == 0 && !xAxisPosition.includes('top')))))

    this._drawAxis(...[svg, xScale, yScale, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, xDataName, yDataName,
      xAxisPosition, yAxisPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont, xTickLabelRotate,
      xTicks, yTicks, axisStroke, axisStrokeWidth, tickInward, tickLabelRemove, axisLongLineRemove, gridColor, gridDashArray, gridLineWidth, drawLine0]);

    return id;

  }
}

export { Scatter }