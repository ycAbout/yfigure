import * as d3 from 'd3';
import { getOption } from './helper.js';
import { setDataPoint } from './helper.js';

/**
 * This function draws a histogram graph (y represents frequency) using d3 and svg.
 * @param {object} data     A data object array in the format of [{ columnX: n1 },{columnX: n2 }].
 * @param {object=} options An optional object contains four objects.
 *                          size, describing the svg size in the format of size: { width: 400, height: 300 }.
 *                          margin, describing the margin inside the svg in the format of margin: { left: 50, top: 20, right: 20, bottom: 50 }.
 *                          location, describing where to put the graph in the format of location: 'body', or '#<ID>'.
 *                          nBins, describing how many bins to put the data in the format of nBins: 70.
 * @return {} append a graph to html.
 */
export function histogram(data, options = {}) {
  //set up graph specific option
  options.nBins ? true : options.nBins = 50;
  //validate format
  if (typeof options.nBins !== 'number') { throw new Error('Option nBins need to be an array object!') }

  //validate data format
  if (!Array.isArray(data) || !data.every((row) => typeof row === 'object')) {
    throw new Error('data need to be an array of objects!')
  }

  // set all the common options
  let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options)

  let xDataName = Object.keys(data[0])[0];

  // generate a highly likely unique ID
  let graphID = xDataName + 'Histogram' + Math.floor(Math.random() * 100000).toString();

  d3.select(location)
    .append('span')       //non-block container
    .attr('id', graphID);

  let svg = d3.select('#' + graphID)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${left},${top})`);

  let maxData = d3.max(data, d => d[xDataName]);
  let minData = d3.min(data, d => d[xDataName]);
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
    .value(d => d[xDataName])
    .domain(xScale.domain())
    .thresholds(thresholdArray); // split data into bins

  // to get the bins
  let bins = histogram(data);

  let yScale = d3.scaleLinear()
    .range([innerHeight, 0])
    .domain([0, d3.max(bins, d => d.length)]);

  // add dataPoint object to be shown on mouseover
  let dataPoint = setDataPoint()

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
      dataPoint
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text('[' + d.x0 + '-' + d.x1 + '] : ' + d.length);
    })
    .on('mousemove', (d) => {
      dataPoint
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text('[' + d.x0 + '-' + d.x1 + '] : ' + d.length);
    })
    .on('mouseout', () => dataPoint.style('display', 'none'));

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
    .attr("transform", "translate(" + -left / 3 * 2 + "," + innerHeight / 2 + ") rotate(-90)")  // centre at margin left 1/3
    .text('Frequency');
}
