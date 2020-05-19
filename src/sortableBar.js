import * as d3 from 'd3';
import { getOption } from './helper.js';
import { setDataPoint } from './helper.js';

/**
 * This function draws a horizontal sortable bar graph (y represents continuous value) using d3 and svg.
 * @param {object} data     A data object array in the format of e.g., [{columnX: 'a', columnY: n1 },{columnX: 'b', columnY: n2 }].
 * @param {object=} options An optional object contains following objects. 
 *                          size, describing the svg size in the format of size: { width: 400, height: 300 }. 
 *                          margin, describing the margin inside the svg in the format of margin: { left: 40, top: 40, right: 40, bottom: 40 }.
 *                          location, describing where to put the graph in the format of location: 'body', or '#<ID>'.  
 *                          colors, describing the colors used for positive bars and negative bars in the format of colors: ['steelblue', '#CC2529'].  
 * @return {} append a sortable bar graph to html.
 */
export function sortableBar(data, options = {}) {
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
  let graphID = xDataName + yDataName + Math.floor(Math.random() * 100000).toString();

  let selection = d3.select(location)
    .append('span')       //non-block container
    .attr('style', `display:inline-block; width: ${width}px`)        //px need to be specified, otherwise not working
    .attr('id', graphID)
    .append('div')   // make it on top of figure
    .attr('style', `margin: ${top}px 0 0 ${left}px; width: ${width - left}px`)        //px need to be specified, otherwise not working
    .text('Sort by: ')
    .append('select');

  selection.selectAll("option")
    .data(['default', 'descending', 'ascending'])
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  let svg = d3.select('#' + graphID)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${left},${top})`);

  // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
  let dataPointDisplayId = setDataPoint();

  function draw(data, svg, order) {
    let innerData;
    switch (order) {
      case 'descending':
        // this creates a deep copy of data so the original data can be preserved
        innerData = JSON.parse(JSON.stringify(data));
        innerData.sort((a, b) => b[yDataName] - a[yDataName]);
        break;
      case 'ascending':
        innerData = JSON.parse(JSON.stringify(data));
        innerData.sort((a, b) => a[yDataName] - b[yDataName]);
        break;
      default:
        innerData = data;
    }

    // when all data are negative, choose 0 as max data
    let yMax = Math.max(d3.max(innerData, element => element[yDataName]), 0);

    // for set up y domain when y is negative, make tallest bar approximately 15% range off x axis
    let dataMin = d3.min(innerData, element => element[yDataName]);
    let yMin = 0;
    if (dataMin < 0) {
      let ySetback = (yMax - dataMin) * 0.15;
      yMin = dataMin - ySetback;
    }

    //x and y scale inside function for purpose of update (general purpose, not necessary but no harm in this case)
    let xScale = d3.scaleBand()
      .domain(innerData.map((element) => element[xDataName]))
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

    // remove the x and y axis if exist
    d3.select('#' + graphID + 'x')
      .remove();
    d3.select('#' + graphID + 'y')
      .remove();
    d3.select('#' + graphID + 'y0')
      .remove();

    svg
      .append('g')
      .attr('id', graphID + 'x')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));

    svg
      .append('g')
      .attr('id', graphID + 'y')
      .call(d3.axisLeft(yScale));

    // add line at y = 0 when there is negative data
    if (dataMin < 0) {
      svg.append("path")
        .attr('id', graphID + 'y0')
        .attr("stroke", 'black')
        .attr("d", d3.line()([[0, yScale(0)], [innerWidth, yScale(0)]]))
    }
  }

  //initialize
  draw(data, svg, 'default');

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

  selection
    .on('change', function () {
      draw(data, svg, this.value)
    });

}