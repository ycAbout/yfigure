import * as d3 from 'd3';
import { getCommonOption } from './function.bak/helper.js';
import { getAxisOption } from './function.bak/helper.js';
import { validate2dArray } from './function.bak/helper.js';
import { setDataPoint } from './function.bak/helper.js';

/**
 * This function draws a horizontal sortable bar graph (y represents continuous value) using d3 and svg.  
 * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
 * @param {object=} options An optional object contains following key value pairs:
 *                          common option key values pairs
 *                          graph specific key value pairs:
 *                            colors, describing the colors used for positive bars and negative bars in the format of `colors: ['steelblue', '#CC2529']`.  
 * @return {string}         append a graph to html and returns the graph id.  
 */
export function sortableBar(data, options = {}) {
  //set up graph specific option
  options.colors ? true : options.colors = ['steelblue', '#CC2529'];
  //validate format
  if (typeof options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }

  let colors = options.colors;

  validate2dArray(data);

  // set all the common options
  let [width, height, top, left, bottom, right, innerWidth, innerHeight, location, id] = getCommonOption(options);

  // set all the axis options
  let [xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont] = getAxisOption(options);

  // take first column as x name label, second column as y name label, of the first object
  let xDataName = data[0][0];
  let yDataName = data[0][1];
  // x y data positions
  let xDataIndex = 0;
  let yDataIndex = 1;

  // get ride of column name, does not modify origin array
  let dataValue = data.slice(1)

  let selection = d3.select(location)
    .append('span')       //non-block container
    .attr('style', `display:inline-block; width: ${width}px`)        //px need to be specified, otherwise not working
    .attr('id', id)
    .append('div')   // make it on top of figure
    .attr('style', `margin: ${top}px 0 0 ${left}px; width: ${width - left}px`)        //px need to be specified, otherwise not working
    .text('Sort by: ')
    .append('select');

  selection.selectAll("option")
    .data(['default', 'descending', 'ascending'])
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  let svg = d3.select('#' + id)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${left},${top})`);

  // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
  let dataPointDisplayId = setDataPoint();

  function draw(dataValue, svg, order) {
    let innerData;
    switch (order) {
      case 'descending':
        // this creates a deep copy of data so the original data can be preserved
        innerData = JSON.parse(JSON.stringify(dataValue));
        innerData.sort((a, b) => b[yDataIndex] - a[yDataIndex]);
        break;
      case 'ascending':
        innerData = JSON.parse(JSON.stringify(dataValue));
        innerData.sort((a, b) => a[yDataIndex] - b[yDataIndex]);
        break;
      default:
        innerData = dataValue;
    }

    let dataMax = d3.max(innerData, element => element[yDataIndex]);
    let dataMin = d3.min(innerData, element => element[yDataIndex]);

    // make tallest bar approximately 10% range off the range
    let ySetback = (dataMax - dataMin) * 0.1;

    // choose 0 as default y min
    let yMin = 0;

    // if there is negative data, set y min
    if (dataMin < 0) {
      yMin = dataMin - ySetback;
    }

    // choose 0 as default y max
    let yMax = 0;
    // when there is postive data, set y max
    if (dataMax > 0) {
      yMax = dataMax + ySetback;
    }

    //x and y scale inside function for purpose of update (general purpose, not necessary but no harm in this case)
    let xScale = d3.scaleBand()
      .domain(innerData.map((element) => element[xDataIndex]))
      .range([0, innerWidth])
      .padding(0.1);

    let yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);

    //draw graph, update works with select rect
    svg
      .selectAll('rect')
      .data(innerData)
      .join(
        enter => enter.append('rect'),
        update => update
      )
      .attr('x', element => xScale(element[xDataIndex]))
      .attr('width', xScale.bandwidth())
      .attr('y', element => yScale(Math.max(element[yDataIndex], 0)))       // if negative, use y(0) as starting point
      .attr('height', element => Math.abs(yScale(element[yDataIndex]) - yScale(0)))  // height = distance to y(0)
      .attr('fill', element => element[yDataIndex] > 0 ? colors[0] : colors[1])
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

    // remove the x and y axis if exist
    d3.select('#' + id + 'x')
      .remove();
    d3.select('#' + id + 'y')
      .remove();
    d3.select('#' + id + 'y0')
      .remove();

    svg
      .append('g')
      .attr('id', id + 'x')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));

    svg
      .append('g')
      .attr('id', id + 'y')
      .call(d3.axisLeft(yScale));

    // add line at y = 0 when there is negative data
    if (dataMin < 0) {
      svg.append("path")
        .attr('id', id + 'y0')
        .attr("stroke", 'black')
        .attr("d", d3.line()([[0, yScale(0)], [innerWidth, yScale(0)]]))
    }
  }

  //initialize
  draw(dataValue, svg, 'default');

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
    .attr("transform", "translate(" + -left / 4 * 3 + "," + innerHeight / 2 + ") rotate(270)")  // centre at margin left 1/4
    .text(yDataName);

  selection
    .on('change', function () {
      draw(dataValue, svg, this.value)
    });

  return id;
}