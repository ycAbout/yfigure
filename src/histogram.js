import * as d3 from 'd3';
import { getOption } from './helper.js';
import { setDataPoint } from './helper.js';

/**
 * This function draws a histogram graph (y represents frequency) using d3 and svg.  
 * @param {array} data      A 2d array data in the format of `[['columnX'], [n1], [n2]]`.  
 * @param {object=} options An optional object contains four objects:  
 *                          size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
 *                          margin, describing the margin inside the svg in the format of `margin: { left: 50, top: 20, right: 20, bottom: 50 }`.  
 *                          location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
 *                          nBins, describing how many bins to put the data in the format of `nBins: 70`.  
* @return {string}          append a graph to html and returns the graph id.  
 */
export function histogram(data, options = {}) {
  //set up graph specific option
  options.nBins ? true : options.nBins = 50;
  //validate format
  if (typeof options.nBins !== 'number') { throw new Error('Option nBins need to be an array object!') }

  //validate data format
  if (!Array.isArray(data) || !data.every((row) => Array.isArray(row))) {
    throw new Error('data need to be a 2d array!')
  }

  // set all the common options
  let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options)

  let xDataName = data[0][0];

  // get ride of column name, does not modify origin array
  let dataValue = data.slice(1)

  // x y data positions
  let xDataIndex = 0;

  // generate a highly likely unique ID
  let graphID = 'yd3histogram' + Math.floor(Math.random() * 1000000).toString();

  let svg = d3.select(location)
    .append('svg')
    .attr('id', graphID)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${left},${top})`);

  let maxData = d3.max(dataValue, d => d[xDataIndex]);
  let minData = d3.min(dataValue, d => d[xDataIndex]);

  // X axis scale
  let xScale = d3.scaleLinear()
    .domain([minData, maxData])
    .range([0, innerWidth]);

  //evenly generate an array of thresholds, each value = min + nthPortion*(max-min)/nBins
  let portion = (maxData - minData) / options.nBins
  let thresholdArray = [];
  for (let i = 0; i < options.nBins; i++) {
    thresholdArray.push(minData + i * portion)
  }

  // set the parameters for the histogram
  let histogram = d3.histogram()
    .value(d => d[xDataIndex])
    .domain(xScale.domain())
    .thresholds(thresholdArray); // split data into bins

  // to get the bins
  let bins = histogram(dataValue);

  let yScale = d3.scaleLinear()
    .range([innerHeight, 0])
    .domain([0, d3.max(bins, d => d.length*1.1)]);

  // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
  let dataPointDisplayId = setDataPoint();

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.x0))
    .attr("y", d => yScale(d.length))
    .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
    .attr("height", d => innerHeight - yScale(d.length))
    .style("fill", "steelblue")
    .on('mouseover', (d) => {
      d3.select('#' + dataPointDisplayId)
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text('[' + Math.round((d.x0 + Number.EPSILON) * 100) / 100 + '-' + Math.round((d.x1 + Number.EPSILON) * 100) / 100 + '] : ' + d.length);
    })
    .on('mousemove', (d) => {
      d3.select('#' + dataPointDisplayId)
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text('[' + Math.round((d.x0 + Number.EPSILON) * 100) / 100 + '-' + Math.round((d.x1 + Number.EPSILON) * 100) / 100 + '] : ' + d.length);
    })
    .on('mouseout', () => d3.select('#' + dataPointDisplayId).style('display', 'none'));

  svg.append("g")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(d3.axisBottom(xScale));
  svg.append("g")
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
    .attr("transform", "translate(" + -left / 4 * 3 + "," + innerHeight / 2 + ") rotate(-90)")  // centre at margin left 1/4
    .text('Frequency');

  return graphID;

}
