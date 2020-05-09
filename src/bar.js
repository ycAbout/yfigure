import * as d3 from 'd3';

/**
 * This function draws a horizontal bar graph (y represents continuous value) using d3 and svg.
 * @param {object} data    A data object array in the format of [{ columnX: 'a', columnY: n1 },{columnX: 'b', columnY: n2 }].
 * @param {object=} options An optional object contains following objects. 
 *                          size, describing the svg size in the format of size: { width: 400, height: 300 }. 
 *                          margin, describing the margin inside the svg in the format of margin: { left: 40, top: 40, right: 40, bottom: 40 }.
 *                          location, describing where to put the graph in the format of location: 'body', or '#<ID>'
 * @return {} append a bar graph to html.
 */
export function bar(data, options = {}) {
  //set up individual optional options so no need to feed options in a way non or all
  options.size ? true : options.size = { width: 400, height: 300 };
  options.margin ? true : options.margin = { left: 50, top: 20, right: 20, bottom: 50 };
  options.location ? true : options.location = 'body';

  //validate data format
  if (!Array.isArray(data) || !data.every((row) => typeof row === 'object') || typeof options.size !== 'object' || typeof options.margin !== 'object' || typeof options.location !== 'string') {
    throw 'options format error!'
  }

  //parse float just in case and get parameters
  let width = +options.size.width;
  let height = +options.size.height;
  let top = +options.margin.top;
  let left = +options.margin.left;
  let bottom = +options.margin.bottom;
  let right = +options.margin.right;

  let innerWidth = width - left - right;
  let innerHeight = height - top - bottom;

  // take first column as x name label, second column as y name label, of the first object
  let xDataName = Object.keys(data[0])[0];
  let yDataName = Object.keys(data[0])[1];

  // generate a highly likely unique ID
  let graphID = xDataName + yDataName + Math.floor(Math.random() * 100000).toString();

  d3.select(options.location)
    .append('span')       //non-block container
    .attr('id', graphID);

  let svg = d3.select('#' + graphID)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${left},${top})`);

  let xScale = d3.scaleBand()
    .domain(data.map((element) => element[xDataName]))
    .range([0, innerWidth])
    .padding(0.1);

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(data.map((element) => element[yDataName]))])
    .range([innerHeight, 0]);

  svg
    .append('g')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', element => xScale(element[xDataName]))
    .attr('width', xScale.bandwidth())
    .attr('y', element => yScale(element[yDataName]))
    .attr('height', element => innerHeight - yScale(element[yDataName]))
    .attr('fill', 'steelblue');

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
    .text(yDataName);
}