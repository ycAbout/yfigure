var yd3 = (function (exports, d3) {
  'use strict';

  function author() {
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

    //validate format
    if (typeof options.size !== 'object' || typeof options.margin !== 'object' || typeof options.location !== 'string') {
      throw 'Graph options format error!';    // throw error terminates function
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
    let location = options.location;

    return [width, height, top, left, bottom, right, innerWidth, innerHeight, location]
  }

  /**
   * This function draws a horizontal bar graph (y represents continuous value) using d3 and svg.
   * @param {object} data    A data object array in the format of [{ columnX: 'a', columnY: n1 },{columnX: 'b', columnY: n2 }].
   * @param {object=} options An optional object contains following objects. 
   *                          size, describing the svg size in the format of size: { width: 400, height: 300 }. 
   *                          margin, describing the margin inside the svg in the format of margin: { left: 40, top: 40, right: 40, bottom: 40 }.
   *                          location, describing where to put the graph in the format of location: 'body', or '#<ID>'
   * @return {} append a bar graph to html.
   */
  function bar(data, options = {}) {
    //validate data format
    if (!Array.isArray(data) || !data.every((row) => typeof row === 'object')) {
      throw 'data format error!';    // throw error terminates function
    }
   
    // set all the common options
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options);
    
    // take first column as x name label, second column as y name label, of the first object
    let xDataName = Object.keys(data[0])[0];
    let yDataName = Object.keys(data[0])[1];

    // generate a highly likely unique ID
    let graphID = xDataName + yDataName + Math.floor(Math.random() * 100000).toString();

    // when all data are negative, choose 0 as max data
    let yMax = Math.max(d3.max(data, element => element[yDataName]), 0);

    // for set up y domain when y is negative, make tallest bar approximately 15% range off x axis
    let dataMin = d3.min(data, element => element[yDataName]);
    let yMin = 0;
    if (dataMin < 0) {
      let ySetback = (yMax - dataMin) * 0.15;
      yMin = dataMin - ySetback;
    }

    d3.select(location)
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
      .domain([yMin, yMax])
      .range([innerHeight, 0]);

    // add mouse over text
    let dataPoint = d3.select('body')
      .append('div')
      .style("position", "absolute")
      .style("background", "white")
      .style("padding-left", "5px")  //somehow padding only cause blinking
      .style("padding-right", "5px")
      .style("border-radius", "6px")
      .style("display", "none")
      .attr('font-size', '1.5em');

    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', element => xScale(element[xDataName]))
      .attr('width', xScale.bandwidth())
      .attr('y', element => yScale(Math.max(element[yDataName], 0)))       // if negative, use y(0) as starting point
      .attr('height', element => Math.abs(yScale(element[yDataName]) - yScale(0)))  // height = distance to y(0)
      .attr('fill', element => element[yDataName] < 0 ? '#CC2529' : 'steelblue')
      .on('mouseover', (element) => {
        dataPoint
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text(element[xDataName] + ': ' + element[yDataName]);
      })
      .on('mousemove', (element) => {
        dataPoint
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text(element[xDataName] + ': ' + element[yDataName]);
       })
      .on('mouseout', () => dataPoint.style('display', 'none'));

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
  }

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
  function histogram(data, options = {}) {
    //set up graph specific option
    options.nBins ? true : options.nBins = 50;

    //validate data format
    if (!Array.isArray(data) || !data.every((row) => typeof row === 'object') || typeof options.nBins !== 'number') {
      throw 'Parameter format error!';     // throw error terminates function
    }

    // set all the common options
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options);

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
    let portion = (maxData - minData) / options.nBins;
    let thresholdArray = [];
    for (let i = 0; i < options.nBins; i++) {
      thresholdArray.push(minData + i * portion);
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

    // add mouse over text
    let dataPoint = d3.select('body')
      .append('div')
      .style("position", "absolute")
      .style("background", "white")
      .style("padding-left", "5px")  //somehow padding only cause blinking
      .style("padding-right", "5px")
      .style("border-radius", "6px")
      .style("display", "none")
      .attr('font-size', '1.5em');

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
        .text('['+ d.x0 + '-' + d.x1 + '] : ' + d.length);
      })
      .on('mousemove', (d) => {
        dataPoint
        .style('display', null)
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('left', (d3.event.pageX + 'px'))
        .text('['+ d.x0 + '-' + d.x1 + '] : ' + d.length);
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

  /**
   * This function draws a line with dot graph (y represents continuous value) using d3 and svg.
   * @param {object} data     A data object array in the format of [{columnX: 'a', columnY: n1 },{columnX: 'b', columnY: n2}].
   * @param {object=} options An optional object contains following objects.
   *                          size, describing the svg size in the format of size: { width: 400, height: 300 }.
   *                          margin, describing the margin inside the svg in the format of margin: { left: 50, top: 40, right: 20, bottom: 50 }.
   *                          location, describing where to put the graph in the format of location: 'body', or '#<ID>'.
   *                          dotRadius, dot radius describing the radius of the dot in the format of dotRadius: 4
   *                          colors: describing the colors used for difference lines in the format of colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']
   * @return {} append a graph to html.
   */
  function lineDot(data, options = {}) {
    //set up graph specific option
    options.colors ? true : options.colors = ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'];
    options.dotRadius ? true : options.dotRadius = 4;

    //validate data format
    if (!Array.isArray(data) || !data.every((row) => typeof row === 'object') || typeof options.colors !== 'object' || typeof options.dotRadius !== 'number') {
      throw 'Parameter format error!';     // throw error terminates function
    }

    // set all the common options
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options);

    // take first column as x name label, second column as y name label, of the first object
    let xDataName = Object.keys(data[0])[0];

    //more than one y data columns
    let yDataNames = Object.keys(data[0]);
    // has to do this separate, shift() returns the shifted element
    yDataNames.shift();

    // generate a highly likely unique ID
    let graphID = xDataName + 'Line' + Math.floor(Math.random() * 100000).toString();

    d3.select(location)
      .append('span')       //non-block container
      .attr('id', graphID);

    let svg = d3.select('#' + graphID)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${left},${top})`);

    //scalePoint can use padding but not scaleOrdinal
    let xScale = d3.scalePoint()
      .domain(data.map((element) => element[xDataName]))
      .range([0, innerWidth])
      .padding(0.2);

    //get max and min data for each y columns
    let maxYArray = [];
    let minYArray = [];
    for (let j = 0; j < yDataNames.length; j++) {
      maxYArray.push(d3.max(data, d => +d[yDataNames[j]]));  //parse float
      minYArray.push(d3.min(data, d => +d[yDataNames[j]]));  //parse float
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

    // add mouse over text
    let dataPoint = d3.select('body')
      .append('div')
      .style("position", "absolute")
      .style("background", "white")
      .style("padding-left", "5px")  //somehow padding only cause blinking
      .style("padding-right", "5px")
      .style("border-radius", "6px")
      .style("display", "none")
      .attr('font-size', '1.5em');

    // draw each y data
    for (let i = 0; i < yDataNames.length; i++) {
      // draw a line
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", colorScale(yDataNames[i]))
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(function (element) { return xScale(element[xDataName]) })
          .y(function (element) { return yScale(element[yDataNames[i]]) })
        );

      // Add the points
      svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (element) { return xScale(element[xDataName]) })
        .attr("cy", function (element) { return yScale(element[yDataNames[i]]) })
        .attr("r", options.dotRadius)
        .attr("fill", colorScale(yDataNames[i]))
        .on('mouseover', (element) => {
          dataPoint
          .style('display', null)
          .style('top', (d3.event.pageY - 20) + 'px')
          .style('left', (d3.event.pageX + 'px'))
          .text(element[xDataName] + ': ' + element[yDataNames[i]]);
        })
        .on('mousemove', (element) => {
          dataPoint
          .style('display', null)
          .style('top', (d3.event.pageY - 20) + 'px')
          .style('left', (d3.event.pageX + 'px'))
          .text(element[xDataName] + ': ' + element[yDataNames[i]]);
         })
        .on('mouseout', () => dataPoint.style('display', 'none'));

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

  }

  /**
   * This function draws a scatter plot (x, y represents continuous value) using d3 and svg.
   * @param {object} data     A data object array in the format of [{columnX: n1, columnY: n2},{columnX: n3, columnY: n4}].
   * @param {object=} options An optional object contains the following objects.
   *                          size, describing the svg size in the format of size: { width: 400, height: 300 }.
   *                          margin, describing the margin inside the svg in the format of margin: { left: 50, top: 40, right: 20, bottom: 50 }.
   *                          location, describing where to put the graph in the format of location: 'body', or '#<ID>'.
   *                          dotRadius, dot radius describing the radius of the dot in the format of dotRadius: 4
   *                          colors: describing the colors used for different lines in the format of colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']
   * @return {} appends a graph to html.
   */
  function scatter(data, options = {}) {
    //set up graph specific option
    options.colors ? true : options.colors = ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'];
    options.dotRadius ? true : options.dotRadius = 4;

    //validate data format
    if (!Array.isArray(data) || !data.every((row) => typeof row === 'object') || typeof options.colors !== 'object' || typeof options.dotRadius !== 'number') {
      throw 'Parameter format error!';      // throw error terminates function
    }

    // set all the common options
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options);

    // take first column name as x name label, second column name as y name label, of the first object
    let xDataName = Object.keys(data[0])[0];

    //more than one y data columns
    let yDataNames = Object.keys(data[0]);
    // has to do this separate from above, shift() returns the shifted element
    yDataNames.shift();

    // generate a highly likely unique ID, can be optimized
    let graphID = xDataName + 'Line' + Math.floor(Math.random() * 100000).toString();

    d3.select(location)
      .append('span')       //non-block container
      .attr('id', graphID);

    let svg = d3.select('#' + graphID)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${left},${top})`);

    // set up x scale, make data points approximately 2% off axis
    let xMax = d3.max(data, element => element[xDataName]);
    let xMin = d3.min(data, element => element[xDataName]);
    let xSetback = (xMax - xMin) * 0.02;

    let xScale = d3.scaleLinear()
      .domain([xMin - xSetback, xMax])  // data points off axis
      .range([0, innerWidth]);

    //get max and min data for each y columns
    let maxYArray = [];
    let minYArray = [];
    for (let j = 0; j < yDataNames.length; j++) {
      maxYArray.push(d3.max(data, d => +d[yDataNames[j]]));  //parse float
      minYArray.push(d3.min(data, d => +d[yDataNames[j]]));  //parse float
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

    // add mouse over text
    let dataPoint = d3.select('body')
      .append('div')
      .style("position", "absolute")
      .style("background", "white")
      .style("padding-left", "5px")  //somehow padding only cause blinking
      .style("padding-right", "5px")
      .style("border-radius", "6px")
      .style("display", "none")
      .attr('font-size', '1.5em');

    // draw each y
    for (let i = 0; i < yDataNames.length; i++) {

      // Add the points
      svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (element) { return xScale(element[xDataName]) })
        .attr("cy", function (element) { return yScale(element[yDataNames[i]]) })
        .attr("r", options.dotRadius)
        .attr("fill", colorScale(yDataNames[i]))
        .on('mouseover', (element) => {
          dataPoint
            .style('display', null)
            .style('top', (d3.event.pageY - 20) + 'px')
            .style('left', (d3.event.pageX + 'px'))
            .text(element[xDataName] + ': ' + element[yDataNames[i]]);
        })
        .on('mousemove', (element) => {
          dataPoint
            .style('display', null)
            .style('top', (d3.event.pageY - 20) + 'px')
            .style('left', (d3.event.pageX + 'px'))
            .text(element[xDataName] + ': ' + element[yDataNames[i]]);
        })
        .on('mouseout', () => dataPoint.style('display', 'none'));

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
  }

  /**
   * This function draws a horizontal sortable bar graph (y represents continuous value) using d3 and svg.
   * @param {object} data     A data object array in the format of e.g., [{columnX: 'a', columnY: n1 },{columnX: 'b', columnY: n2 }].
   * @param {object=} options An optional object contains following objects. 
   *                          size, describing the svg size in the format of size: { width: 400, height: 300 }. 
   *                          margin, describing the margin inside the svg in the format of margin: { left: 40, top: 40, right: 40, bottom: 40 }.
   *                          location, describing where to put the graph in the format of location: 'body', or '#<ID>'
   * @return {} append a sortable bar graph to html.
   */
  function sortableBar(data, options = {}) {

    //validate data format
    if (!Array.isArray(data) || !data.every((row) => typeof row === 'object') ) {
      throw 'Data format error!';      // throw error terminates function
    }

    // set all the common options
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location] = getOption(options);

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

      // when all data are negative, choose 0 as max data
      let yMax = Math.max(d3.max(innerData, element => element[yDataName]), 0);

      // for set up y domain when y is negative, make tallest bar approximately 15% range off x axis
      let dataMin = d3.min(innerData, element => element[yDataName]);
      let yMin = 0;
      if (dataMin < 0) {
        let ySetback = (yMax - dataMin) * 0.15;
        yMin = dataMin - ySetback;
      }

      //x and y scale inside function for purpose of update (general purpose)
      let xScale = d3.scaleBand()
        .domain(innerData.map((element) => element[xDataName]))
        .range([0, innerWidth])
        .padding(0.1);

      let yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([innerHeight, 0]);

    // add mouse over text
    let dataPoint = d3.select('body')
      .append('div')
      .style("position", "absolute")
      .style("background", "white")
      .style("padding-left", "5px")  //somehow padding only cause blinking
      .style("padding-right", "5px")
      .style("border-radius", "6px")
      .style("display", "none")
      .attr('font-size', '1.5em');

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
        .attr('y', element => yScale(Math.max(element[yDataName], 0)))       // if negative, use y(0) as starting point
        .attr('height', element => Math.abs(yScale(element[yDataName]) - yScale(0)))  // height = distance to y(0)
        .attr('fill', element => element[yDataName] < 0 ? '#CC2529' : 'steelblue')
        .on('mouseover', (element) => {
          dataPoint
          .style('display', null)
          .style('top', (d3.event.pageY - 20) + 'px')
          .style('left', (d3.event.pageX + 'px'))
          .text(element[xDataName] + ': ' + element[yDataName]);
        })
        .on('mousemove', (element) => {
          dataPoint
          .style('display', null)
          .style('top', (d3.event.pageY - 20) + 'px')
          .style('left', (d3.event.pageX + 'px'))
          .text(element[xDataName] + ': ' + element[yDataName]);
         })
        .on('mouseout', () => dataPoint.style('display', 'none'));

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

      // add line at y = 0 when there is negative data
      if (dataMin < 0) {
        svg.append("path")
          .attr("stroke", 'black')
          .attr("d", d3.line()([[0, yScale(0)], [innerWidth, yScale(0)]]));
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
        draw(data, svg, this.value);
      });

  }

  exports.author = author;
  exports.bar = bar;
  exports.histogram = histogram;
  exports.lineDot = lineDot;
  exports.scatter = scatter;
  exports.sortableBar = sortableBar;

  return exports;

}({}, d3));
