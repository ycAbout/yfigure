/**
 * This function draws a horizontal sortable bar graph (y represents continuous value) using d3 and svg.
 * @param {object} data     A data object array in the format of e.g., [{columnX: 'a', columnY: n1 },{columnX: 'b', columnY: n2 }].
 * @param {object=} options An optional object contains following objects. 
 *                          size, describing the svg size in the format of size: { width: 400, height: 300 }. 
 *                          margin, describing the margin inside the svg in the format of margin: { left: 40, top: 40, right: 40, bottom: 40 }.
 *                          location, describing where to put the graph in the format of location: 'body', or '#<ID>'
 * @return {} append a sortable bar graph to html.
 */
export function sortableBar(data, options = {}) {
  //set up individual optional options so no need to feed options in a way non or all
  options.size ? true : options.size = { width: 400, height: 300 };
  options.margin ? true : options.margin = { left: 50, top: 20, right: 20, bottom: 50 };
  options.location ? true : options.location = 'body';

  //validate data format
  if (!Array.isArray(data) || !data.every((row) => typeof row === 'object') || typeof options.size !== 'object' || typeof options.margin !== 'object' || typeof options.location !== 'string') {
    throw 'options format error!';
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

  let selection = d3.select(options.location)
    .append('g')
    .attr('id', graphID)
    .append('div')   // make it on top of figure
    .attr('style', `margin: ${top}px 0 0 ${left}px; width: ${width - left}px`)        //px need to be specified, otherwise not working
    .text('Sort by: ')
    .append('select');

  selection.selectAll("option")
    .data(['default', 'descending', 'ascending'])
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  let svg = d3.select('#' + graphID)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${left},${top})`);

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

    //x and y scale inside function for purpose of update (general purpose)
    let xScale = d3.scaleBand()
      .domain(innerData.map((element) => element[xDataName]))
      .range([0, innerWidth])
      .padding(0.1);

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(innerData.map((element) => element[yDataName]))])
      .range([innerHeight, 0]);

    //draw graph, update works with select rect
    let rect = svg
      .selectAll('rect')
      .data(innerData)
      .join(
        enter => enter.append('rect'),
        update => update
      )
      .attr('x', element => xScale(element[xDataName]))
      .attr('width', xScale.bandwidth())
      .attr('y', element => yScale(element[yDataName]))
      .attr('height', element => innerHeight - yScale(element[yDataName]))
      .attr('fill', 'steelblue');

    svg
      .append('g')
      .attr('id', graphID + 'x')
      .attr('transform', `translate(0, ${innerHeight})`);

    svg
      .append('g')
      .attr('id', graphID + 'y');

    //have to do this in case of update
    d3.select('#' + graphID + 'x')
      .call(d3.axisBottom(xScale));

    d3.select('#' + graphID + 'y')
      .call(d3.axisLeft(yScale));
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