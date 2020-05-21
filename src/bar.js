import * as d3 from 'd3';
import { getOption } from './helper.js';
import { setDataPoint } from './helper.js';

/**
 * This function draws a horizontal bar graph (y represents continuous value) using d3 and svg.
 * @param {object} data    A data object array in the format of [{ columnX: 'a', columnY: n1 },{columnX: 'b', columnY: n2 }].
 * @param {object=} options An optional object contains following objects. 
 *                          size, describing the svg size in the format of size: { width: 400, height: 300 }. 
 *                          margin, describing the margin inside the svg in the format of margin: { left: 40, top: 40, right: 40, bottom: 40 }.
 *                          location, describing where to put the graph in the format of location: 'body', or '#<ID>'.  
 *                          colors, describing the colors used for positive bars and negative bars in the format of colors: ['steelblue', '#CC2529'].  
 * @return {} append a bar graph to html.
 */
export function bar(data, options = {}) {
  //set up graph specific option
  options.colors ? true : options.colors = ['steelblue', '#CC2529'];
  //validate format
  if (typeof options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }

  //validate data format
  if (!Array.isArray(data) || !data.every((row) => typeof row === 'object')) {
    throw new Error('data need to be an array of objects!')
  }

  // set all the common options
  let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options)

  // take first column as x name label, second column as y name label, of the first object
  let xDataName = Object.keys(data[0])[0];
  let yDataName = Object.keys(data[0])[1];

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
    .domain(data.map((element) => element[xDataName]))
    .range([0, innerWidth])
    .padding(0.1);

  // when all data are negative, choose 0 as max data
  let yMax = Math.max(d3.max(data, element => element[yDataName]), 0);

  // for set up y domain when y is negative, make tallest bar approximately 15% range off x axis
  let dataMin = d3.min(data, element => element[yDataName]);
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
    .data(data)
    .join('rect')
    .attr('x', element => xScale(element[xDataName]))
    .attr('width', xScale.bandwidth())
    .attr('y', element => yScale(Math.max(element[yDataName], 0)))       // if negative, use y(0) as starting point
    .attr('height', element => Math.abs(yScale(element[yDataName]) - yScale(0)))  // height = distance to y(0)
    .attr('fill', element => element[yDataName] > 0 ? options.colors[0] : options.colors[1])
    .on('mouseover', (element) => {
      d3.select('#' + dataPointDisplayId)
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text(element[xDataName] + ': ' + element[yDataName]);
    })
    .on('mousemove', (element) => {
      d3.select('#' + dataPointDisplayId)
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text(element[xDataName] + ': ' + element[yDataName]);
    })
    .on('mouseout', () => d3.select('#' + dataPointDisplayId).style('display', 'none'));

  //x axis
  svg
    .append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale));

  //y axis
  svg
    .append('g')
    .call(d3.axisLeft(yScale));

  // add line at y = 0 when there is negative data
  if (dataMin < 0) {
    svg.append("path")
      .attr("stroke", 'black')
      .attr("d", d3.line()([[0, yScale(0)], [innerWidth, yScale(0)]]))
  }

  //x axis title
  svg
    .append("text")
    .attr("text-anchor", "middle")  // transform is applied to the middle anchor
    .attr("transform", "translate(" + innerWidth / 2 + "," + (innerHeight + (bottom / 4) * 3) + ")")  // centre at margin bottom 1/4
    .text(xDataName);

  //y axis title
  svg
    .append("text")
    .attr("text-anchor", "middle")  // transform is applied to the middle anchor
    .attr("transform", "translate(" + -left / 3 * 2 + "," + innerHeight / 2 + ") rotate(-90)")  // centre at margin left 1/3
    .text(yDataName);

  return graphID;
  
}