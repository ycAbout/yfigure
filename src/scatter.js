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
   *                            dotRadius, dot radius describing the radius of the dot in the format of `dotRadius: 4`.  
   *                            colors: describing the colors used for different lines in the format of `colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']`.  
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
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location, id] = this._getCommonOption(options);

    // set all the axis options
    let [xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont] = this._getAxisOption(options);

    // set data parameters
    let [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin] = this._setDataParameters(data);

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
      .attr('transform', `translate(${left},${top})`);

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

    //x axis
    for (let i = 0; i < Math.min(xPosition.length, 2); i++) {
      // set default x axis to top if y max is 0
      if (yMax == 0 && xPosition.length == 1 && xPosition[i] == 'bottom') xPosition[i] = 'top';
      svg
        .append('g')
        .style("font", xAxisFont)
        .attr('transform', `translate(0, ${xPosition[i] == 'top' ? 0 : innerHeight})`)
        .call(xPosition[i] == 'top' ? d3.axisTop(xScale) : d3.axisBottom(xScale));
    }

    //x axis title
    for (let i = 0; i < Math.min(xTitlePosition.length, 2); i++) {
      // set default x axis to top if y max is 0
      if (yMax == 0 && xTitlePosition.length == 1 && xTitlePosition[i] == 'bottom') xTitlePosition[i] = 'top';
      svg
        .append("text")
        .style('font', xTitleFont)
        .attr("text-anchor", "middle")  // transform is applied to the middle anchor
        .attr("transform", `translate(${innerWidth / 2}, ${xTitlePosition[i] == 'top' ? -top / 4 * 3 : innerHeight + bottom / 4 * 3})`)  // centre at margin bottom/top 1/4
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
        .attr("transform", `translate(${yTitlePosition[i] == 'right' ? innerWidth + right / 4 * 3 : -left / 4 * 3}, ${innerHeight / 2}) rotate(270)`)  // centre at margin left/right 1/4
        .text(yDataName);
    }

    // add line at y = 0 when there is negative data
    if (yMin <= 0 && yMax >= 0) {
      svg.append("path")
        .attr("stroke", 'black')
        .attr("d", d3.line()([[0, yScale(0)], [innerWidth, yScale(0)]]))
    }

    return id;

  }
}

export { Scatter }