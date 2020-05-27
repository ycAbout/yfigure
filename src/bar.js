import * as d3 from 'd3';
import { BaseSimpleGroupAxis } from './baseClass.js';

/**
* A Bar class for a horizontal bar graph (y represents continuous value).
*/
class Bar extends BaseSimpleGroupAxis {
  /**
   * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
   * @param {object=} options  An optional object contains following key value pairs:
   *                              common option key values pairs
   *                              graph specific key value pairs:
   *                                colors, describing the colors used for positive bars and negative bars in the format of `colors: ['steelblue', '#CC2529']`.   
   */
  constructor(data, options = {}) {
    super(data, options);

    //set up graph specific option
    this._options.colors ? true : this._options.colors = ['#396AB1', '#CC2529', '#DA7C30', '#3E9651', '#535154', '#6B4C9A', '#922428', '#948B3D'];
    //validate format
    if (typeof this._options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }

    this._validate2dArray(this._data);
  }

  /**
* This function draws a horizontal bar graph (y represents continuous value) using d3 and svg.  
* @return {string}         append a graph to html and returns the graph id.  
*/
  plot() {

    let colors = this._options.colors;

    // set all the common options
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location, id] = this._getCommonOption(this._options);

    // set all the axis options
    let [xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont] = this._getAxisOption(this._options);

    // set data parameters
    let [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin] = this._setDataParameters(this._data);

    // make data plot approximately 10% range off the range
    let ySetback = (dataMax - dataMin) * 0.1;

    // if there is negative data, set y min. Otherwise choose 0 as default y min
    let yMin = (dataMin < 0 ? dataMin - ySetback : 0);
    // when there is postive data, set y max. Otherwsie choose 0 as default y max
    let yMax = (dataMax > 0 ? dataMax + ySetback : 0);

    let svg = d3.select(location)
      .append('svg')
      .attr('id', id)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${left},${top})`);

    let xScale = d3.scaleBand()
      .domain(dataValue.map((element) => element[xDataIndex]))
      .range([0, innerWidth])
      .padding(0.1);

    let xSubScale = d3.scaleBand()
      .domain(yDataNames)
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
          legendx = 0;
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
    if (yMin != 0 && yMax != 0) {
      svg.append("path")
        .attr("stroke", 'black')
        .attr("d", d3.line()([[0, yScale(0)], [innerWidth, yScale(0)]]))
    }

    return id;

  }
}

export { Bar }