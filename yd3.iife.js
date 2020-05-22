var yd3 = (function (exports, d3) {
  'use strict';

  function author() {
    /**
   * This library aims to provide the simplest but very powerful and flexible way to draw a graph.
   * One only needs to provide data in a 2d array format and an optional object contains all the figure options.
   * Every single option was carefully thought to provide the best possible user experience.
   * 
   * This library uses 2d array as data input instead of array of objects for two reasons:
   * 1. 2d array looks more structurized and easier to visually perceive.
   * 2. The order of key value pair in objects is not reliable in Javascript.
   */

    let copyright = 'Copyright ' + (new Date).getFullYear() + ' Yalin Chen';
    let info = `***yd3, an easy to use data visualization javascript library build on top of d3js
  @author Yalin Chen yc.about@gmail.com
  ${copyright}***`;
    return info
  }

  /**
   * This function parses the command options for a graph.
   * @param {object=} options An option object contains options for a graph. 
   * @return [] an array of the options.
   */
  function getOption(options = {}) {
    //set up individual optional options so no need to feed options in a way none or all
    options.size ? true : options.size = { width: 400, height: 300 };
    options.margin ? true : options.margin = { left: 50, top: 30, right: 20, bottom: 50 };
    options.location ? true : options.location = 'body';

    function makeError(msg) {
      throw new Error(msg)
    }

    //validate format
    typeof options.size !== 'object' ? makeError('Option size need to be an object!') : true;
    typeof options.margin !== 'object' ? makeError('Option margin need to be an object!') : true;
    typeof options.location !== 'string' ? makeError('Option location need to be a string!') : true;

    //parse float just in case and get parameters
    let width = +options.size.width;
    let height = +options.size.height;
    let top = +options.margin.top;
    let left = +options.margin.left;
    let bottom = +options.margin.bottom;
    let right = +options.margin.right;
    let innerWidth = width - left - right;
    let innerHeight = height - top - bottom;
    let location = options.location;

    return [width, height, top, left, bottom, right, innerWidth, innerHeight, location]
  }


  /**
   * This function set the data point object to be shown on mouseover for a graph.
   * @return {string} a string format of dataPointDisplay object ID to be selected.
   */
  function setDataPoint() {

    let dataPointDisplayId = 'yd3DataPointDisplay999999';

    //add it if there is no such element, so there is only one per page
    if (!d3.select('#' + dataPointDisplayId).node()) {
      // add mouse over text
      d3.select('body')
        .append('div')
        .attr('id', dataPointDisplayId)
        .style("position", "absolute")
        .style("background", "white")
        .style("padding-left", "5px")  //somehow padding only cause blinking
        .style("padding-right", "5px")
        .style("border-radius", "6px")
        .style("display", "none")
        .attr('font-size', '1.5em');
    }

    return dataPointDisplayId;
  }

  /**
   * This function draws a horizontal bar graph (y represents continuous value) using d3 and svg.  
   * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
   * @param {object=} options An optional object contains following objects:  
   *                          size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
   *                          margin, describing the margin inside the svg in the format of `margin: { left: 40, top: 40, right: 40, bottom: 40 }`.  
   *                          location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
   *                          colors, describing the colors used for positive bars and negative bars in the format of `colors: ['steelblue', '#CC2529']`.  
   * @return {string}         append a graph to html and returns the graph id.  
   */
  function bar(data, options = {}) {
    //set up graph specific option
    options.colors ? true : options.colors = ['steelblue', '#CC2529'];
    //validate format
    if (typeof options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }

    //validate data format
    if (!Array.isArray(data) || !data.every((row) => Array.isArray(row))) {
      throw new Error('data need to be a 2d array!')
    }

    // set all the common options
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options);

    // take first column as x name label, second column as y name label, of the first object
    let xDataName = data[0][0];
    let yDataName = data[0][1];

    // get ride of column name, does not modify origin array
    let dataValue = data.slice(1);
    
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
        .attr("d", d3.line()([[0, yScale(0)], [innerWidth, yScale(0)]]));
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
  function histogram(data, options = {}) {
    //set up graph specific option
    options.nBins ? true : options.nBins = 50;
    //validate format
    if (typeof options.nBins !== 'number') { throw new Error('Option nBins need to be an array object!') }

    //validate data format
    if (!Array.isArray(data) || !data.every((row) => Array.isArray(row))) {
      throw new Error('data need to be a 2d array!')
    }

    // set all the common options
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options);

    let xDataName = data[0][0];

    // get ride of column name, does not modify origin array
    let dataValue = data.slice(1);
    
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
    let portion = (maxData - minData) / options.nBins;
    let thresholdArray = [];
    for (let i = 0; i < options.nBins; i++) {
      thresholdArray.push(minData + i * portion);
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
      .domain([0, d3.max(bins, d => d.length)]);

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
          .text('[' + d.x0 + '-' + d.x1 + '] : ' + d.length);
      })
      .on('mousemove', (d) => {
        d3.select('#' + dataPointDisplayId)
          .style('display', null)
          .style('top', (d3.event.pageY - 20) + 'px')
          .style('left', (d3.event.pageX + 'px'))
          .text('[' + d.x0 + '-' + d.x1 + '] : ' + d.length);
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
      .attr("transform", "translate(" + -left / 3 * 2 + "," + innerHeight / 2 + ") rotate(-90)")  // centre at margin left 1/3
      .text('Frequency');

    return graphID;
    
  }

  /**
   * This function draws a line with dot graph (y represents continuous value) using d3 and svg.  
   * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnY1Name', 'columnY2Name'],['a', n1, n2],['b', n3, n4]]`.  
   * @param {object=} options An optional object contains following objects:  
   *                          size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
   *                          margin, describing the margin inside the svg in the format of `margin: { left: 50, top: 40, right: 20, bottom: 50 }`.  
   *                          location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
   *                          dotRadius, dot radius describing the radius of the dot in the format of `dotRadius: 4`.  
   *                          colors: describing the colors used for difference lines in the format of `colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']`.  
   * @return {string}         append a graph to html and returns the graph id.  
   */
  function lineDot(data, options = {}) {
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
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options);

    // take first column as x name label, second column as y name label, of the first object
    let xDataName = data[0][0];
    //more than one y data columns
    let yDataNames = data[0].slice(1);

    // get ride of column name, does not modify origin array
    let dataValue = data.slice(1);

    // x data positions
    let xDataIndex = 0;

    // generate a highly likely unique ID
    let graphID = 'yd3linedot' + Math.floor(Math.random() * 1000000).toString();

    let svg = d3.select(location)
      .append('svg')
      .attr('id', graphID)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${left},${top})`);

    //scalePoint can use padding but not scaleOrdinal
    let xScale = d3.scalePoint()
      .domain(dataValue.map((element) => element[xDataIndex]))
      .range([0, innerWidth])
      .padding(0.2);

    //get max and min data for each y columns
    let maxYArray = [];
    let minYArray = [];
    for (let j = 0; j < yDataNames.length; j++) {
      maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
      minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
    }

    let ySetback = (d3.max(maxYArray) - d3.min(minYArray)) * 0.05;  //5% of data range

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

    // draw each y data
    for (let i = 0; i < yDataNames.length; i++) {
      // draw a line
      svg.append("path")
        .datum(dataValue)
        .attr("fill", "none")
        .attr("stroke", colorScale(yDataNames[i]))
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(function (element) { return xScale(element[xDataIndex]) })
          .y(function (element) { return yScale(element[i + 1]) })
        );

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
      if (legendx + yDataNames[i].length * 8 + 24 > innerWidth) {
        legendy += 16;    // start a new line
        legendx = 0;
      }

      svg
        .append('path')
        .attr("stroke", colorScale(yDataNames[i]))
        .attr("stroke-width", 2)
        .attr("d", d3.line()([[legendx, -legendy], [legendx + 20, -legendy]]));

      svg
        .append("circle")
        .attr("cx", legendx + 10)
        .attr("cy", -legendy)
        .attr("r", 3)
        .attr("fill", colorScale(yDataNames[i]));

      svg
        .append('text')
        .attr("alignment-baseline", "middle")  // transform is applied to the middle anchor
        .attr("transform", "translate(" + (legendx + 24) + "," + -legendy + ")")  // evenly across inner width, at margin top 2/3
        .attr('fill', colorScale(yDataNames[i]))
        .text(yDataNames[i]);

      // set up next legend x and y
      legendx += yDataNames[i].length * 8 + 32;
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
  function scatter(data, options = {}) {
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
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options);

    // take first column as x name label, second and after columns as y name label, of the first array
    let xDataName = data[0][0];
    //more than one y data columns
    let yDataNames = data[0].slice(1);

    // get ride of column name, does not modify origin array
    let dataValue = data.slice(1);

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

  /**
   * This function draws a horizontal sortable bar graph (y represents continuous value) using d3 and svg.  
   * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
   * @param {object=} options An optional object contains following objects:  
   *                          size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
   *                          margin, describing the margin inside the svg in the format of `margin: { left: 40, top: 40, right: 40, bottom: 40 }`.  
   *                          location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
   *                          colors, describing the colors used for positive bars and negative bars in the format of `colors: ['steelblue', '#CC2529']`.  
  * @return {string}          append a graph to html and returns the graph id.  
   */
  function sortableBar(data, options = {}) {
    //set up graph specific option
    options.colors ? true : options.colors = ['steelblue', '#CC2529'];
    //validate format
    if (typeof options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }

    //validate data format
    if (!Array.isArray(data) || !data.every((row) => Array.isArray(row))) {
      throw new Error('data need to be a 2d array!')
    }

    // set all the common options
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options);

    // take first column as x name label, second column as y name label, of the first object
    let xDataName = data[0][0];
    let yDataName = data[0][1];

    // get ride of column name, does not modify origin array
    let dataValue = data.slice(1);

    // x y data positions
    let xDataIndex = 0;
    let yDataIndex = 1;

    // generate a highly likely unique ID
    let graphID = 'yd3bar' + Math.floor(Math.random() * 1000000).toString();

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

      // when all data are negative, choose 0 as max data
      let yMax = Math.max(d3.max(innerData, element => element[yDataIndex]), 0);

      // for set up y domain when y is negative, make tallest bar approximately 15% range off x axis
      let dataMin = d3.min(innerData, element => element[yDataIndex]);
      let yMin = 0;
      if (dataMin < 0) {
        let ySetback = (yMax - dataMin) * 0.15;
        yMin = dataMin - ySetback;
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
          .attr("d", d3.line()([[0, yScale(0)], [innerWidth, yScale(0)]]));
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
      .attr("transform", "translate(" + -left / 3 * 2 + "," + innerHeight / 2 + ") rotate(-90)")  // centre at margin left 1/3
      .text(yDataName);

    selection
      .on('change', function () {
        draw(dataValue, svg, this.value);
      });

    return graphID;
  }

  exports.author = author;
  exports.bar = bar;
  exports.histogram = histogram;
  exports.lineDot = lineDot;
  exports.scatter = scatter;
  exports.sortableBar = sortableBar;

  return exports;

}({}, d3));
