import * as d3 from 'd3';
import { getOption } from './helper.js';
import { setDataPoint } from './helper.js';


/**
 * This function draws a scatter plot (x, y represents continuous value) using d3 and svg.  
 * @param {array} data      A 2d array data in the format of `[['columnXName',  'columnY1Name', 'columnY2Name'],['a', n1, n2],['b', n3, n4]]`.  
 * @param {object=} options An optional object contains the following objects:  
 *                          size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
 *                          margin, describing the margin inside the svg in the format of `margin: { left: 50, top: 40, right: 20, bottom: 50 }`.  
 *                          location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
 *                          dotRadius, dot radius describing the radius of the dot in the format of `dotRadius: 4`.  
 *                          colors: describing the colors used for different lines in the format of `colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']`.  
* @return {string}          append a graph to html and returns the graph id.  
 */
export function scatter(data, options = {}) {
  //set up graph specific option
  options.colors ? true : options.colors = ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'];
  options.dotRadius ? true : options.dotRadius = 4;
  //validate format
  if (typeof options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }
  if (typeof options.dotRadius !== 'number') { throw new Error('Option dotRadius need to be a number!') }

  //validate data format
  if (!Array.isArray(data) || !data.every((row) => Array.isArray(row))) {
    throw new Error('data need to be a 2d array!')
  }

  // set all the common options
  let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options)

  // take first column as x name label, second and after columns as y name label, of the first array
  let xDataName = data[0][0];
  //more than one y data columns
  let yDataNames = data[0].slice(1);

  // get ride of column name, does not modify origin array
  let dataValue = data.slice(1)

  // x data positions
  let xDataIndex = 0;

  // generate a highly likely unique ID, can be optimized
  let graphID = 'yd3linedot' + Math.floor(Math.random() * 1000000).toString();

  let svg = d3.select(location)
    .append('svg')
    .attr('id', graphID)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${left},${top})`);

  // set up x scale, make data points approximately 2% off axis
  let xMax = d3.max(dataValue, element => element[xDataIndex]);
  let xMin = d3.min(dataValue, element => element[xDataIndex]);
  let xSetback = (xMax - xMin) * 0.02;

  let xScale = d3.scaleLinear()
    .domain([xMin - xSetback, xMax])  // data points off axis
    .range([0, innerWidth]);

  //get max and min data for each y columns
  let maxYArray = [];
  let minYArray = [];
  for (let j = 0; j < yDataNames.length; j++) {
    maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
    minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
  }

  let ySetback = (d3.max(maxYArray) - d3.min(minYArray)) * 0.02;  //2% of data range

  let yScale = d3.scaleLinear()
    .domain([d3.min(minYArray) - ySetback, d3.max(maxYArray)])  // data points off axis
    .range([innerHeight, 0]);

  //colors for difference lines
  let colorScale = d3.scaleOrdinal()
    .domain(yDataNames)
    .range(options.colors);

  // initialize legend position
  let legendx = 0;
  let legendy = 12;

  // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
  let dataPointDisplayId = setDataPoint();

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
      .attr("r", options.dotRadius)
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

    // Add legend
    // if add current legend spill over innerWidth
    if (legendx + yDataNames[i].length * 8 + 10 > innerWidth) {
      legendy += 16;    // start a new line
      legendx = 0;
    }

    svg
      .append("circle")
      .attr("cx", legendx + 3)
      .attr("cy", -legendy)
      .attr("r", 3)
      .attr("fill", colorScale(yDataNames[i]));

    svg
      .append('text')
      .attr("alignment-baseline", "middle")  // transform is applied to the middle anchor
      .attr("transform", "translate(" + (legendx + 10) + "," + -legendy + ")")  // evenly across inner width, at margin top 2/3
      .attr('fill', colorScale(yDataNames[i]))
      .text(yDataNames[i]);

    // set up next legend x and y
    legendx += yDataNames[i].length * 8 + 18;
  }

  //x axis
  svg
    .append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale));

  //y axis
  svg
    .append('g')
    .call(d3.axisLeft(yScale));

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
    .text('');

  return graphID;

}
