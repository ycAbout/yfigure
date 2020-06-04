import * as d3 from 'd3';
import { BaseSimpleGroupAxis } from './baseClass.js';

//to do, each bar each color(maybe group bar with 1 group?), line0 x y axis color, tickInward to tickSize, commerical copyright, error bar, vertical bar


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
    this._options.stacked === true ? true : this._options.stacked = false;

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
    let stacked = options.stacked;

    // set all the common options
    let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
      innerWidth, innerHeight, location, id] = this._getCommonOption(options);

    // set all the axis options
    let [xAxisPosition, xAxisPositionSet, yAxisPosition, xTitlePosition, yTitlePosition, yTitle, xAxisFont, yAxisFont, xTitleFont, yTitleFont,
      xTickLabelRotate, xTicks, yTicks, axisStroke, axisStrokeWidth, tickInward, tickLabelRemove, axisLongLineRemove, gridStroke, gridDashArray, gridLineWidth, line0] = this._getAxisOption(options);

    // set data parameters
    let [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin, dataMaxSum, dataMinSum] = this._setDataParameters(data);

    // if user specified yTitle
    if (yTitle !== '') yDataName = yTitle;

    // make data plot approximately 10% range off the range
    let ySetback = (dataMax - dataMin) * 0.1;

    let ySetbackStack = (dataMaxSum - dataMinSum) * 0.1;

    // if there is negative data, set y min. Otherwise choose 0 as default y min
    let yMin = stacked ? (dataMinSum < 0 ? dataMinSum - ySetbackStack : 0) : (dataMin < 0 ? dataMin - ySetback : 0);
    // when there is postive data, set y max. Otherwsie choose 0 as default y max
    let yMax = stacked ? (dataMaxSum > 0 ? dataMaxSum + ySetbackStack : 0) : (dataMax > 0 ? dataMax + ySetback : 0);

    let svg = d3.select(location)
      .append('svg')
      .attr('id', id)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

    let xScale = d3.scaleBand()
      .domain(dataValue.map((element) => element[xDataIndex]))
      .range([0, innerWidth])
      .padding(barPadding);

    let xSubScale = d3.scaleBand()
      .domain(stacked ? ['stack'] : yDataNames)
      .range([0, xScale.bandwidth()])
      .padding(0.03);

    let yScale = d3.scaleLinear()
      .domain([yMin, yMax])
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

    let lastPositive = [];
    let lastNegative = [];
    lastPositive.length = lastNegative.length = dataValue.length;
    lastPositive.fill(0);
    lastNegative.fill(0);

    // draw each y data
    for (let i = 0; i < yDataNames.length; i++) {

      svg
        .append('g')
        .selectAll('rect')
        .data(dataValue)
        .join('rect')
        .attr("transform", element => `translate(${xScale(element[xDataIndex])}, 0)`)
        .attr('x', stacked ? xSubScale('stack') : xSubScale(yDataNames[i]))
        .attr('width', xSubScale.bandwidth())
        .attr('y', (element, index) => {
          if (stacked) {
            let baseline;
            if (element[i + 1] >= 0) {
              baseline = lastPositive[index];
              lastPositive[index] += element[i + 1];    //update
            } else {
              baseline = lastNegative[index];
              lastNegative[index] += element[i + 1];
            }
            return yScale(Math.max(baseline + element[i + 1], baseline));
          } else {
            return yScale(Math.max(element[i + 1], 0))
          }
        })       // if negative, use y(0) as starting point
        .attr('height', element => Math.abs(yScale(element[i + 1]) - yScale(0)))  // height = distance to y(0)
        .attr('fill', element => {
          if (yDataNames.length == 1) {
            return element[i + 1] > 0 ? colors[0] : colors[1]       //only one y, positive vs. negative
          } else {
            return colorScale(yDataNames[i])              // two and more ys, no postive vs. negative
          }
        })
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
      xTicks, yTicks, axisStroke, axisStrokeWidth, tickInward, tickLabelRemove, axisLongLineRemove, gridStroke, gridDashArray, gridLineWidth, drawLine0]);

    return id;
  }
}

export { Bar }