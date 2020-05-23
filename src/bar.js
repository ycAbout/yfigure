import * as d3 from 'd3';
import { getOption } from './helper.js';
import { setDataPoint } from './helper.js';

/**
 * This function draws a horizontal bar graph (y represents continuous value) using d3 and svg.  
 * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
 * @param {object=} options An optional object contains following key value pairs:
 *                          common option key values pairs
 *                          graph specific key value pairs:
 *                            colors, describing the colors used for positive bars and negative bars in the format of `colors: ['steelblue', '#CC2529']`.  
 * @return {string}         append a graph to html and returns the graph id.  
 */
export function bar(data, options = {}) {
  //set up graph specific option
  options.colors ? true : options.colors = ['steelblue', '#CC2529'];
  //validate format
  if (typeof options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }

  //validate data format
  if (!Array.isArray(data) || !data.every((row) => Array.isArray(row))) {
    throw new Error('data need to be a 2d array!')
  }

  // set all the common options
  let [width, height, top, left, bottom, right, innerWidth, innerHeight, location, xPosition, yPosition,
    xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont] = getOption(options);

  // take first column as x name label, second column as y name label, of the first object
  let xDataName = data[0][0];
  let yDataName = data[0][1];

  // get ride of column name, does not modify origin array
  let dataValue = data.slice(1)

  // x y data positions
  let xDataIndex = 0;
  let yDataIndex = 1;

  // generate a highly likely unique ID
  let graphID = 'yd3bar' + Math.floor(Math.random() * 1000000).toString();

  let svg = d3.select(location)
    .append('svg')
    .attr('id', graphID)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${left},${top})`);

  let xScale = d3.scaleBand()
    .domain(dataValue.map((element) => element[xDataIndex]))
    .range([0, innerWidth])
    .padding(0.1);

  // when all data are negative, choose 0 as max data
  let yMax = Math.max(d3.max(dataValue, element => element[yDataIndex]), 0);

  // for set up y domain when y is negative, make tallest bar approximately 15% range off x axis
  let dataMin = d3.min(dataValue, element => element[yDataIndex]);
  let yMin = 0;
  if (dataMin < 0) {
    let ySetback = (yMax - dataMin) * 0.15;
    yMin = dataMin - ySetback;
  }

  let yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([innerHeight, 0]);

  // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
  let dataPointDisplayId = setDataPoint();

  svg
    .append('g')
    .selectAll('rect')
    .data(dataValue)
    .join('rect')
    .attr('x', element => xScale(element[xDataIndex]))
    .attr('width', xScale.bandwidth())
    .attr('y', element => yScale(Math.max(element[yDataIndex], 0)))       // if negative, use y(0) as starting point
    .attr('height', element => Math.abs(yScale(element[yDataIndex]) - yScale(0)))  // height = distance to y(0)
    .attr('fill', element => element[yDataIndex] > 0 ? options.colors[0] : options.colors[1])
    .on('mouseover', (element) => {
      d3.select('#' + dataPointDisplayId)
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text(element[xDataIndex] + ': ' + element[yDataIndex]);
    })
    .on('mousemove', (element) => {
      d3.select('#' + dataPointDisplayId)
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text(element[xDataIndex] + ': ' + element[yDataIndex]);
    })
    .on('mouseout', () => d3.select('#' + dataPointDisplayId).style('display', 'none'));

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
      .attr("transform", `translate(${yTitlePosition[i] == 'right' ? innerWidth + right / 4 * 3 : -left / 4 * 3}, ${innerHeight / 2}) rotate(-90)`)  // centre at margin left/right 1/4
      .text(yDataName);
  }

  // add line at y = 0 when there is negative data
  if (dataMin < 0) {
    svg.append("path")
      .attr("stroke", 'black')
      .attr("d", d3.line()([[0, yScale(0)], [innerWidth, yScale(0)]]))
  }

  return graphID;

}