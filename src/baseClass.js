/**
 * A base class used for simple and grouped graph with axises, such as bar, line, and scatter.
 */
class BaseSimpleGroupAxis {
  /**
   * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
   * @param {object=} options  An optional object contains following key value pairs:
   *                              common option key values pairs
   *                              graph specific key value pairs:
   *                                colors, describing the colors used for positive bars and negative bars in the format of `colors: ['steelblue', '#CC2529']`.   
   */
  constructor(data, options) {
    this._options = options;    //_ does not have any real effect, just visually indicate private variables.
    this._data = data;
    this._brand = 'yfigure';
  }

  /**
   * This function parses the command options for a graph.
   * @param {object} options An option object contains key value pair describing the options of a graph.
   *         common options (see yfigure opitons documentation)
   * @return {array} an array of each individual option.
   */
  _getCommonOption(options) {

    // set defaul values so no need to feed options in a way none or all
    options.location ? true : options.location = 'body';
    options.id ? true : options.id = this._brand + 'id' + Math.floor(Math.random() * 1000000).toString();
    options.width ? true : options.width = 400;
    options.height ? true : options.height = 300;

    let location = options.location;
    let id = options.id;
    let width = parseInt(options.width);
    let height = parseInt(options.height);

    let marginTop, marginLeft, marginBottom, marginRight;

    function makeError(msg) {
      throw new Error(msg)
    }

    // make margin short cut for all margin
    if (options.margin) {

      (typeof options.margin !== 'string' && typeof options.margin !== 'number') ? makeError('Option margin needs to be a string or number!') : true;

      marginTop = marginLeft = marginBottom = marginRight = parseInt(options.margin);

      // any one of the margin is set
    } else if (options['marginLeft'] || options['marginTop'] || options['marginRight'] || options['marginBottom']) {

      options['marginLeft'] ? true : options['marginLeft'] = 25;
      options['marginTop'] ? true : options['marginTop'] = 25;
      options['marginRight'] ? true : options['marginRight'] = 25;
      options['marginBottom'] ? true : options['marginBottom'] = 25;

      //validate format
      (typeof options['marginLeft'] !== 'string' && typeof options['marginLeft'] !== 'number') ? makeError('Option marginLeft needs to be a string or number!') : true;
      (typeof options['marginTop'] !== 'string' && typeof options['marginTop'] !== 'number') ? makeError('Option marginTop needs to be a string or number!') : true;
      (typeof options['marginRight'] !== 'string' && typeof options['marginRight'] !== 'number') ? makeError('Option marginRight needs to be a string or number!') : true;
      (typeof options['marginBottom'] !== 'string' && typeof options['marginBottom'] !== 'number') ? makeError('Option marginBottom needs to be a string or number!') : true;

      marginLeft = parseInt(options['marginLeft']);
      marginTop = parseInt(options['marginTop']);
      marginRight = parseInt(options['marginRight']);
      marginBottom = parseInt(options['marginBottom']);

    } else {
      options.margin = 25;
      marginTop = marginLeft = marginBottom = marginRight = options.margin;
    }


    let frameTop, frameLeft, frameBottom, frameRight;

    // make margin short cut for all margin
    if (options.frame) {

      (typeof options.frame !== 'string' && typeof options.frame !== 'number') ? makeError('Option frame needs to be a string or number!') : true;

      frameTop = frameLeft = frameBottom = frameRight = parseInt(options.frame);


      // any one of the margin is set
    } else if (options.frameLeft || options.frameTop || options.frameRight || options.frameBottom) {
      options.frameLeft ? true : options.frameLeft = 30;
      options.frameTop ? true : options.frameTop = 30;
      options.frameRight ? true : options.frameRight = 30;
      options.frameBottom ? true : options.frameBottom = 30;

      //validate format
      (typeof options.frameLeft !== 'string' && typeof options.frameLeft !== 'number') ? makeError('Option frameLeft needs to be a string or number!') : true;
      (typeof options.frameTop !== 'string' && typeof options.frameTop !== 'number') ? makeError('Option frameTop needs to be a string or number!') : true;
      (typeof options.frameRight !== 'string' && typeof options.frameRight !== 'number') ? makeError('Option frameRight needs to be a string or number!') : true;
      (typeof options.frameBottom !== 'string' && typeof options.frameBottom !== 'number') ? makeError('Option frameBottom needs to be a string or number!') : true;

      frameLeft = parseInt(options.frameLeft);
      frameTop = parseInt(options.frameTop);
      frameRight = parseInt(options.frameRight);
      frameBottom = parseInt(options.frameBottom);

    } else {
      options.frame = 30;
      frameTop = frameLeft = frameBottom = frameRight = options.frame;
    }

    //validate format
    (typeof options.width !== 'string' && typeof options.width !== 'number') ? makeError('Option width needs to be a string or number!') : true;
    (typeof options.height !== 'string' && typeof options.height !== 'number') ? makeError('Option height needs to be a string or number!') : true;
    typeof options.location !== 'string' ? makeError('Option location needs to be a string or number!') : true;
    typeof options.id !== 'string' ? makeError('Option id needs to be a string or number!') : true;

    //parse float just in case and get parameters
    let innerWidth = width - marginLeft - marginRight - frameLeft - frameRight;
    let innerHeight = height - marginTop - marginBottom - frameTop - frameBottom;

    return [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
      innerWidth, innerHeight, location, id]
  }


  /**
   * This function parses the axis options for a graph.
   * @param {object} options An option object contains key value pair describing the axis options of a graph.
   *         axis options
   * @return {array} an array of each individual axis option.
   */
  _getAxisOption(options) {

    let xAxisPositionSet = false // for whether user supplied values
    // set defaul values so no need to feed options in a way none or all
    options.xAxisPosition ? xAxisPositionSet = true : options.xAxisPosition = ['bottom'];  // for none or both xAxisPosition = [], yAxisPosition = ['left', 'right']
    options.yAxisPosition ? true : options.yAxisPosition = ['left'];
    options.xTitlePosition ? true : options.xTitlePosition = ['bottom'];
    options.yTitlePosition ? true : options.yTitlePosition = ['left'];
    options.yTitle ? true : options.yTitle = '';             // for grouped figures where y title can not acuqired from data
    options.xAxisFont ? true : options.xAxisFont = '10px sans-serif';
    options.yAxisFont ? true : options.yAxisFont = '10px sans-serif';
    options.xTitleFont ? true : options.xTitleFont = '14px sans-serif';
    options.yTitleFont ? true : options.yTitleFont = '14px sans-serif';
    options.xTickLabelRotate ? true : options.xTickLabelRotate = 0;
    options.xTicks ? true : options.xTicks = null;
    options.yTicks ? true : options.yTicks = null;
    options.axisColor ? true : options.axisColor = 'black';
    options.axisStrokeWidth ? true : options.axisStrokeWidth = 1;
    options.tickInward ? true : options.tickInward = [];
    options.tickLabelRemove ? true : options.tickLabelRemove = [];
    options.axisLongLineRemove ? true : options.axisLongLineRemove = [];
    options.gridColor ? true : options.gridColor = '';
    options.gridDashArray ? true : options.gridDashArray = '';
    options.gridStrokeWidth ? true : options.gridStrokeWidth = 0;
    options.line0 === false ? true : options.line0 = true;

    function makeError(msg) {
      throw new Error(msg)
    }

    function validateArray(arrayToBe, errorString) {
      !Array.isArray(arrayToBe) ? makeError(`Option ${errorString} needs to be an array!`) : true;
    }

    //validate array format
    validateArray(options.xAxisPosition, 'xAxisPosition');
    validateArray(options.yAxisPosition, 'yAxisPosition');
    validateArray(options.xTitlePosition, 'xTitlePosition');
    validateArray(options.yTitlePosition, 'yTitlePosition');

    validateArray(options.tickInward, 'tickInward');
    validateArray(options.tickLabelRemove, 'tickLabelRemove');
    validateArray(options.axisLongLineRemove, 'axisLongLineRemove');

    function validateString(stringToBe, errorString) {
      typeof stringToBe !== 'string' ? makeError(`Option ${errorString} needs to be an array!`) : true;
    }

    validateString(options.xAxisFont, 'xAxisFont');
    validateString(options.yAxisFont, 'yAxisFont');
    validateString(options.xTitleFont, 'xTitleFont');
    validateString(options.yTitleFont, 'yTitleFont');

    validateString(options.axisColor, 'axisColor');
    validateString(options.gridColor, 'gridColor');
    validateString(options.gridDashArray, 'gridDashArray');


    (typeof options.xTickLabelRotate !== 'string' && typeof options.xTickLabelRotate !== 'number') ? makeError('Option xTickLabelRotate needs to be a string or number between -90 to 90 degree!') : true;
    !(parseInt(options.xTickLabelRotate) <= 90 && parseInt(options.xTickLabelRotate) >= -90) ? makeError('Option xTickLabelRotate needs to be between -90 to 90 degree!') : true;

    (typeof options.xTicks !== 'number' && options.xTicks !== null) ? makeError('Option xTicks needs to be a number!') : true;
    (typeof options.yTicks !== 'number' && options.yTicks !== null) ? makeError('Option yTicks needs to be a number!') : true;

    typeof options.axisStrokeWidth !== 'number' ? makeError('Option axisStrokeWidth needs to be a number!') : true;

    typeof options.gridStrokeWidth !== 'number' ? makeError('Option gridStrokeWidth needs to be a number!') : true;

    (options.line0 !== true && options.line0 !== false) ? makeError('Option line0 needs to be a boolean!') : true;

    //parse float just in case and get parameters
    let xAxisPosition = options.xAxisPosition;
    let yAxisPosition = options.yAxisPosition;
    let xTitlePosition = options.xTitlePosition;
    let yTitlePosition = options.yTitlePosition;
    let yTitle = options.yTitle;
    let xAxisFont = options.xAxisFont;
    let yAxisFont = options.yAxisFont;
    let xTitleFont = options.xTitleFont;
    let yTitleFont = options.yTitleFont;
    let xTickLabelRotate = parseInt(options.xTickLabelRotate);
    let xTicks = options.xTicks;
    let yTicks = options.yTicks;
    let axisColor = options.axisColor;
    let axisStrokeWidth = options.axisStrokeWidth;
    let tickInward = options.tickInward;
    let tickLabelRemove = options.tickLabelRemove;
    let axisLongLineRemove = options.axisLongLineRemove;
    let gridColor = options.gridColor;
    let gridDashArray = options.gridDashArray;
    let gridStrokeWidth = options.gridStrokeWidth;
    let line0 = options.line0;

    return [xAxisPosition, xAxisPositionSet, yAxisPosition, xTitlePosition, yTitlePosition, yTitle, xAxisFont, yAxisFont, xTitleFont, yTitleFont,
      xTickLabelRotate, xTicks, yTicks, axisColor, axisStrokeWidth, tickInward, tickLabelRemove, axisLongLineRemove, gridColor, gridDashArray, gridStrokeWidth, line0]
  }

  /**
   * This function validates 2d array data format
   * @param {2darray} data  A 2d array data for the graph, in the format of `[['xName', 'y1Name', 'y2Name'...],['xValue', 'y1Value', 'y2Value'...]]`.  
   */
  _validate2dArray(data) {
    //validate 2d array data format
    if (!Array.isArray(data) || !data.every((row) => Array.isArray(row))) {
      throw new Error('data needs to be a 2d array!')
    }
  }

  /**
   * This function parses the data parameters for a graph.
   * @param {2darray} data A 2d array data for the graph, such as [['xName', 'y1Name', 'y2Name'...],['xValue', 'y1Value', 'y2Value'...]].
   * @return {array} an array of each individual parameter.
   */
  _setDataParameters(data) {
    // take first column as x name label, of the first object
    let xDataName = data[0][0];
    let xDataIndex = 0;

    //more than one y data columns
    let yDataNames = data[0].slice(1);

    let yDataName = (yDataNames.length == 1 ? data[0][1] : '');

    // get ride of column name, does not modify origin array
    let dataValue = data.slice(1)

    //get max and min data for each y columns
    let maxYArray = [];
    let minYArray = [];
    for (let j = 0; j < yDataNames.length; j++) {
      maxYArray.push(d3.max(dataValue, d => +d[j + 1]))  //parse float
      minYArray.push(d3.min(dataValue, d => +d[j + 1]))  //parse float
    }

    let dataMax = d3.max(maxYArray);
    let dataMin = d3.min(minYArray);

    function sumArray(numberArray) {
      let sumNegative = 0;
      let sumPostive = 0;

      for (let i = 0; i < numberArray.length; i++) {
        if (numberArray[i] < 0) {
          sumNegative += numberArray[i];
        } else {
          sumPostive += numberArray[i];
        }
      }

      return [sumPostive, sumNegative];
    }

    let dataMaxSum = sumArray(maxYArray)[0]
    let dataMinSum = sumArray(minYArray)[1]

    return [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin, dataMaxSum, dataMinSum]
  }

  _drawAxis(...[svg, xScale, yScale, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, xDataName, yDataName,
    xAxisPosition, yAxisPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont, xTickLabelRotate,
    xTicks, yTicks, axisColor, axisStrokeWidth, tickInward, tickLabelRemove, axisLongLineRemove, gridColor, gridDashArray, gridStrokeWidth, drawLine0]) {

    //x axis
    for (let i = 0; i < Math.min(xAxisPosition.length, 2); i++) {
      let xAxis = svg
        .append('g')
        .attr("color", axisColor)
        .style("font", xAxisFont)
        .attr('transform', `translate(0, ${xAxisPosition[i] == 'top' ? 0 : innerHeight})`)
        .call(xAxisPosition[i] == 'top' ? d3.axisTop(xScale).ticks(xTicks) : d3.axisBottom(xScale).ticks(xTicks))
        .attr("stroke-width", axisStrokeWidth);

      xAxis
        .selectAll("text")
        .attr("y", (9 - 9 / 90 * Math.abs(xTickLabelRotate)) * (xAxisPosition[i] == 'top' ? -1 : 1))   // d3 default off y 9. Max 90 degrees to 0
        .attr("dy", `${0.355 + (0.355 - 0.355 / 90 * Math.abs(xTickLabelRotate)) * (xAxisPosition[i] == 'top' ? -1 : 1)}em`)   // d3 default off y 0.71em. Max 90 degrees to 0.355em
        .attr("x", (9 / 90 * Math.abs(xTickLabelRotate)) * (xAxisPosition[i] == 'top' ? -1 : 1) * (xTickLabelRotate < 0 ? -1 : 1))   // d3 default off x 0. Max 90 degrees to 9
        .style("text-anchor", xTickLabelRotate != 0 ? (xTickLabelRotate < 0 ? (xAxisPosition[i] == 'top' ? 'start' : 'end') : (xAxisPosition[i] == 'top' ? 'end' : 'start')) : 'middle')
        .attr("transform", `rotate(${xTickLabelRotate})`);

      if (tickInward.includes(xAxisPosition[i])) {
        xAxis
          .selectAll("line")
          .attr("y2", xAxisPosition[i] == 'top' ? 6 : -6)
      }

      if (tickLabelRemove.includes(xAxisPosition[i])) {
        xAxis
          .selectAll("text")
          .remove();
      }

      if (axisLongLineRemove.includes(xAxisPosition[i])) {
        xAxis
          .select("path")
          .remove();
      }
    }

    //x axis title
    for (let i = 0; i < Math.min(xTitlePosition.length, 2); i++) {
      svg
        .append("text")
        .style('font', xTitleFont)
        .style('fill', axisColor)
        .attr("text-anchor", "middle")  // transform is applied to the middle anchor
        .attr("dominant-baseline", xTitlePosition[i] == 'top' ? "baseline" : "hanging")   //text vertical reference point
        .attr("transform", `translate(${innerWidth / 2}, ${xTitlePosition[i] == 'top' ? -frameTop : innerHeight + frameBottom})`)  // centre at margin bottom/top
        .text(xDataName);
    }

    //y axis
    for (let i = 0; i < Math.min(yAxisPosition.length, 2); i++) {
      let yAxis = svg
        .append('g')
        .style("color", axisColor)
        .style("font", yAxisFont)
        .attr('transform', `translate(${yAxisPosition[i] == 'right' ? innerWidth : 0}, 0)`)
        .call(yAxisPosition[i] == 'right' ? d3.axisRight(yScale).ticks(yTicks) : d3.axisLeft(yScale).ticks(yTicks))
        .attr("stroke-width", axisStrokeWidth);

      if (tickInward.includes(yAxisPosition[i])) {
        yAxis
          .selectAll("line")
          .attr("x2", yAxisPosition[i] == 'left' ? 6 : -6)
      }

      if (tickLabelRemove.includes(yAxisPosition[i])) {
        yAxis
          .selectAll("text")
          .remove();
      }

      if (axisLongLineRemove.includes(yAxisPosition[i])) {
        yAxis
          .select("path")
          .remove();
      }

    }

    //y axis title
    for (let i = 0; i < Math.min(yTitlePosition.length, 2); i++) {
      svg
        .append("text")
        .style('font', yTitleFont)
        .style('fill', axisColor)
        .attr("text-anchor", "middle")  // transform is applied to the middle anchor
        .attr("dominant-baseline", yTitlePosition[i] == 'right' ? "hanging" : "baseline")   //text vertical reference point
        .attr("transform", `translate(${yTitlePosition[i] == 'right' ? innerWidth + frameRight : -frameLeft}, ${innerHeight / 2}) rotate(-90)`)  // centre at margin left/right
        .text(yDataName);
    }

    if (drawLine0) {
      svg.append("line")
        .attr("x1", 0)
        .attr("y1", yScale(0) + 0.5)
        .attr("x2", innerWidth)
        .attr("y2", yScale(0))
        .style('stroke', axisColor)
    }

    // add x gridlines
    svg.append("g")
      .style("color", gridColor)
      .style("stroke-dasharray", gridDashArray)
      .style("stroke-width", gridStrokeWidth)
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .ticks(xTicks)
        .tickSize(-innerHeight)
        .tickFormat("")
      )
      .select("path")
      .remove();

    // add y gridlines
    svg.append("g")
      .style("color", gridColor)
      .style("stroke-dasharray", gridDashArray)
      .style("stroke-width", gridStrokeWidth)
      .call(d3.axisLeft(yScale)
        .ticks(yTicks)
        .tickSize(-innerWidth)
        .tickFormat("")
      )
      .select("path")
      .remove();
  }


  /**
   * This function set the data point object to be shown on mouseover for a graph.
   * @return {string} a string format of dataPointDisplay object ID to be selected.
   */
  _setDataPoint() {

    let dataPointDisplayId = this._brand + 'DataPointDisplay999sky999sky999sky';

    //add it if there is no such element, so there is only one per page
    if (!d3.select('#' + dataPointDisplayId).node()) {
      // add mouse over text
      d3.select('body')
        .append('p')
        .attr('id', dataPointDisplayId)
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "5px")
        .style("border-radius", "6px")
        .style("display", "none")
        .style('font-size', '1.2em')
    }

    return dataPointDisplayId;
  }

  // update the graph by drawing a new one
  update(data, options = {}) {
    //remove old graph
    d3.select('#' + this._options.id).remove();
    //merge new options with old
    let newOptions = { ...this._options, ...options };
    // totally re-draw a graph
    this._draw(data, newOptions);
  }

}

export { BaseSimpleGroupAxis }