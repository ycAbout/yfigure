import * as d3 from 'd3';

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
    options.backgroundColor ? true : options.backgroundColor = '';

    options.title ? true : options.title = '';
    options.titleFont ? true : options.titleFont = 'bold 16px sans-serif';
    options.titleColor ? true : options.titleColor = 'black';
    options.titleX ? true : options.titleX = 0.5;   // 0 - 1
    options.titleY ? true : options.titleY = 0.02;   // 0 - 1
    options.titleRotate ? true : options.titleRotate = 0;

    function makeError(msg) {
      throw new Error(msg)
    }

    //validate format
    function validateString(stringToBe, errorString) {
      typeof stringToBe !== 'string' ? makeError(`Option ${errorString} needs to be an string!`) : true;
    }
    
    validateString(options.location, 'location');
    validateString(options.id, 'id');
    validateString(options.backgroundColor, 'backgroundColor');
    validateString(options.title, 'title');
    validateString(options.titleFont, 'titleFont');
    validateString(options.titleColor, 'titleColor');

    function validateNumStr(numStrToBe, errorString) {
      (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
    }

    validateNumStr(options.width, 'width');
    validateNumStr(options.height, 'height');

    validateNumStr(options.titleX, 'titleX');
    validateNumStr(options.titleY, 'titleY');
    validateNumStr(options.titleRotate, 'titleRotate');

    !(parseInt(options.titleX) <= 1 && parseInt(options.titleX) >= 0) ? makeError('Option titleX needs to be between 0 to 1!') : true;
    !(parseInt(options.titleY) <= 1 && parseInt(options.titleY) >= 0) ? makeError('Option titleY needs to be between 0 to 1!') : true;

    let location = options.location;
    let id = options.id;
    let width = parseInt(options.width);
    let height = parseInt(options.height);
    let backgroundColor = options.backgroundColor;

    let title = options.title;
    let titleFont = options.titleFont;
    let titleColor = options.titleColor;
    let titleX = parseFloat(options.titleX);
    let titleY = parseFloat(options.titleY);
    let titleRotate = parseInt(options.titleRotate);


    let marginTop, marginLeft, marginBottom, marginRight;

    // make margin short cut for all margin
    if (options.margin) {
      validateNumStr(options.margin, 'margin');
      marginTop = marginLeft = marginBottom = marginRight = parseInt(options.margin);
      // any one of the margin is set
    } else if (options['marginLeft'] || options['marginTop'] || options['marginRight'] || options['marginBottom']) {
      options['marginLeft'] ? true : options['marginLeft'] = 25;
      options['marginTop'] ? true : options['marginTop'] = 25;
      options['marginRight'] ? true : options['marginRight'] = 25;
      options['marginBottom'] ? true : options['marginBottom'] = 25;

      //validate format
      validateNumStr(options.marginLeft, 'marginLeft');
      validateNumStr(options.marginTop, 'marginTop');
      validateNumStr(options.marginRight, 'marginRight');
      validateNumStr(options.marginBottom, 'marginBottom');

      marginLeft = parseInt(options['marginLeft']);
      marginTop = parseInt(options['marginTop']);
      marginRight = parseInt(options['marginRight']);
      marginBottom = parseInt(options['marginBottom']);

    } else {
      options.margin = 25;
      marginTop = marginLeft = marginBottom = marginRight = options.margin;
    }

    let frameTop, frameLeft, frameBottom, frameRight;

    // make frame short cut for all frames
    if (options.frame) {
      validateNumStr(options.frame, 'frame');
      frameTop = frameLeft = frameBottom = frameRight = parseInt(options.frame);
      // any one of the frame is set
    } else if (options.frameLeft || options.frameTop || options.frameRight || options.frameBottom) {
      options.frameLeft ? true : options.frameLeft = 30;
      options.frameTop ? true : options.frameTop = 30;
      options.frameRight ? true : options.frameRight = 30;
      options.frameBottom ? true : options.frameBottom = 30;

      //validate format
      validateNumStr(options.frameLeft, 'frameLeft');
      validateNumStr(options.frameTop, 'frameTop');
      validateNumStr(options.frameRight, 'frameRight');
      validateNumStr(options.frameBottom, 'frameBottom');

      frameLeft = parseInt(options.frameLeft);
      frameTop = parseInt(options.frameTop);
      frameRight = parseInt(options.frameRight);
      frameBottom = parseInt(options.frameBottom);
    } else {
      options.frame = 30;
      frameTop = frameLeft = frameBottom = frameRight = options.frame;
    }

    //parse float just in case and get parameters
    let innerWidth = width - marginLeft - marginRight - frameLeft - frameRight;
    let innerHeight = height - marginTop - marginBottom - frameTop - frameBottom;

    return [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
      innerWidth, innerHeight, location, id, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate]
  }


  /**
   * This function parses the axis options for a graph.
   * @param {object} options An option object contains key value pair describing the axis options of a graph.
   *         axis options
   * @return {array} an array of each individual axis option.
   */
  _getAxisOption(options) {

    let xAxisPositionSet = false; // for whether user supplied values
    let xTitlePositionSet = false; // for whether user supplied values
    let yAxisPositionSet = false;
    let yTitlePositionSet = false;
    // set defaul values so no need to feed options in a way none or all
    options.xAxisPosition ? xAxisPositionSet = true : options.xAxisPosition = ['bottom'];  // for none or both xAxisPosition = [], yAxisPosition = ['left', 'right']
    options.yAxisPosition ? yAxisPositionSet = true : options.yAxisPosition = ['left'];
    options.xTitlePosition ? xTitlePositionSet = true : options.xTitlePosition = ['bottom'];
    options.yTitlePosition ? yTitlePositionSet = true : options.yTitlePosition = ['left'];
    options.xTitle ? true : options.xTitle = '';             // for user specified x title
    options.yTitle ? true : options.yTitle = '';             // for user sepcified y title
    options.xAxisFont ? true : options.xAxisFont = '10px sans-serif';
    options.yAxisFont ? true : options.yAxisFont = '10px sans-serif';
    options.xTitleFont ? true : options.xTitleFont = '12px sans-serif';
    options.yTitleFont ? true : options.yTitleFont = '12px sans-serif';
    options.xTickLabelRotate ? true : options.xTickLabelRotate = 0;
    options.xTicks ? true : options.xTicks = null;
    options.yTicks ? true : options.yTicks = null;
    options.xTickSize ? true : options.xTickSize = 6;
    options.yTickSize ? true : options.yTickSize = 6;
    options.tickLabelRemove ? true : options.tickLabelRemove = [];
    options.axisLongLineRemove ? true : options.axisLongLineRemove = [];
    options.xGridColor ? true : options.xGridColor = '';
    options.xGridDashArray ? true : options.xGridDashArray = '';
    options.xGridStrokeWidth ? true : options.xGridStrokeWidth = 0;
    options.yGridColor ? true : options.yGridColor = '';
    options.yGridDashArray ? true : options.yGridDashArray = '';
    options.yGridStrokeWidth ? true : options.yGridStrokeWidth = 0;
    options.line0 === false ? true : options.line0 = true;
    options.line0Stroke ? true : options.line0Stroke = 'black';
    options.line0StrokeWidth ? true : options.line0StrokeWidth = 1;
    options.line0DashArray ? true : options.line0DashArray = '';

    //****************** not returned, assigned in each individual function */
    options.xPadding ? options.xPadding = parseFloat(options.xPadding) : options.xPadding = 0.1;  // just set up, not returned in array
    options.yPadding ? options.yPadding = parseFloat(options.yPadding) : options.yPadding = 0.1;  // jsut set up, not returned in array

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
    validateArray(options.tickLabelRemove, 'tickLabelRemove');
    validateArray(options.axisLongLineRemove, 'axisLongLineRemove');

    function validateString(stringToBe, errorString) {
      typeof stringToBe !== 'string' ? makeError(`Option ${errorString} needs to be an string!`) : true;
    }

    validateString(options.xTitle, 'xTitle');
    validateString(options.yTitle, 'yTitle');
    validateString(options.xAxisFont, 'xAxisFont');
    validateString(options.yAxisFont, 'yAxisFont');
    validateString(options.xTitleFont, 'xTitleFont');
    validateString(options.yTitleFont, 'yTitleFont');
    validateString(options.xGridColor, 'xGridColor');
    validateString(options.xGridDashArray, 'xGridDashArray');
    validateString(options.yGridColor, 'yGridColor');
    validateString(options.yGridDashArray, 'yGridDashArray');
    validateString(options.line0Stroke, 'line0Stroke');
    validateString(options.line0DashArray, 'line0DashArray');

    function validateNumStr(numStrToBe, errorString) {
      (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
    }

    validateNumStr(options.xTickLabelRotate, 'xTickLabelRotate');
    validateNumStr(options.xTickSize, 'xTickSize');
    validateNumStr(options.yTickSize, 'yTickSize');
    validateNumStr(options.xGridStrokeWidth, 'xGridStrokeWidth');
    validateNumStr(options.yGridStrokeWidth, 'yGridStrokeWidth');
    validateNumStr(options.line0StrokeWidth, 'line0StrokeWidth');
    validateNumStr(options.xPadding, 'xPadding');
    validateNumStr(options.yPadding, 'yPadding');

    !(parseInt(options.xTickLabelRotate) <= 90 && parseInt(options.xTickLabelRotate) >= -90) ? makeError('Option xTickLabelRotate needs to be between -90 to 90 degree!') : true;

    (typeof options.xTicks !== 'number' && options.xTicks !== null) ? makeError('Option xTicks needs to be a number!') : true;
    (typeof options.yTicks !== 'number' && options.yTicks !== null) ? makeError('Option yTicks needs to be a number!') : true;

    (options.line0 !== true && options.line0 !== false) ? makeError('Option line0 needs to be a boolean!') : true;

    let xAxisColor, yAxisColor, xTitleColor, yTitleColor, xTickLabelColor, yTickLabelColor;

    // make axisColor shortcut for all axis related colors
    if (options.axisColor) {
      validateString(options.axisColor, 'axisColor')
      xAxisColor = yAxisColor = xTitleColor = yTitleColor = xTickLabelColor = yTickLabelColor = options.axisColor;
      // any one of the margin is set
    } else if (options['xAxisColor'] || options['yAxisColor'] || options['xTitleColor'] || options['yTitleColor'] || options['xTickLabelColor'] || options['yTickLabelColor ']) {
      options['xAxisColor'] ? true : options['xAxisColor'] = 'black';
      options['yAxisColor'] ? true : options['yAxisColor'] = 'black';
      options['xTitleColor'] ? true : options['xTitleColor'] = 'black';
      options['yTitleColor'] ? true : options['yTitleColor'] = 'black';
      options['xTickLabelColor'] ? true : options['xTickLabelColor'] = 'black';
      options['yTickLabelColor '] ? true : options['yTickLabelColor '] = 'black';

      //validate format
      validateString(options.xAxisColor, 'xAxisColor');
      validateString(options.yAxisColor, 'yAxisColor');
      validateString(options.xTitleColor, 'xTitleColor');
      validateString(options.yTitleColor, 'yTitleColor');
      validateString(options.xTickLabelColor, 'xTickLabelColor');
      validateString(options.yTickLabelColor, 'yTickLabelColor');

      xAxisColor = options['xAxisColor'];
      yAxisColor = options['yAxisColor'];
      xTitleColor = options['xTitleColor'];
      yTitleColor = options['yTitleColor'];
      xTickLabelColor = options['xTickLabelColor'];
      yTickLabelColor = options['yTickLabelColor '];

    } else {
      options.axisColor = 'black';
      xAxisColor = yAxisColor = xTitleColor = yTitleColor = xTickLabelColor = yTickLabelColor = options.axisColor;
    }


    let xAxisStrokeWidth, yAxisStrokeWidth, xTickStrokeWidth, yTickStrokeWidth;
    // make margin short cut for all margin
    if (options.axisStrokeWidth) {
      validateNumStr(options.axisStrokeWidth, 'axisStrokeWidth');
      xAxisStrokeWidth = yAxisStrokeWidth = xTickStrokeWidth = yTickStrokeWidth = ParseFloat(options.axisStrokeWidth);
      // any one of the margin is set
    } else if (options.xAxisStrokeWidth || options.yAxisStrokeWidth || options.xTickStrokeWidth || options.yTickStrokeWidth) {
      options.xAxisStrokeWidth ? true : options.xAxisStrokeWidth = 1;
      options.yAxisStrokeWidth ? true : options.yAxisStrokeWidth = 1;
      options.xTickStrokeWidth ? true : options.xTickStrokeWidth = 1;
      options.yTickStrokeWidth ? true : options.yTickStrokeWidth = 1;

      //validate format
      validateNumStr(options.xAxisStrokeWidth, 'xAxisStrokeWidth');
      validateNumStr(options.yAxisStrokeWidth, 'yAxisStrokeWidth');
      validateNumStr(options.xTickStrokeWidth, 'xTickStrokeWidth');
      validateNumStr(options.yTickStrokeWidth, 'yTickStrokeWidth');

      xAxisStrokeWidth = parseFloat(options.xAxisStrokeWidth);
      yAxisStrokeWidth = parseFloat(options.yAxisStrokeWidth);
      xTickStrokeWidth = parseFloat(options.xTickStrokeWidth);
      yTickStrokeWidth = parseFloat(options.yTickStrokeWidth);
    } else {
      options.axisStrokeWidth = 1;
      xAxisStrokeWidth = yAxisStrokeWidth = xTickStrokeWidth = yTickStrokeWidth = options.axisStrokeWidth;
    }

    //parse float just in case and get parameters
    let xAxisPosition = options.xAxisPosition;
    let yAxisPosition = options.yAxisPosition;
    let xTitlePosition = options.xTitlePosition;
    let yTitlePosition = options.yTitlePosition;
    let xTitle = options.xTitle;
    let yTitle = options.yTitle;
    let xAxisFont = options.xAxisFont;
    let yAxisFont = options.yAxisFont;
    let xTitleFont = options.xTitleFont;
    let yTitleFont = options.yTitleFont;
    let xTickLabelRotate = parseInt(options.xTickLabelRotate);
    let xTicks = options.xTicks;
    let yTicks = options.yTicks;
    let xTickSize = parseFloat(options.xTickSize);
    let yTickSize = parseFloat(options.yTickSize);
    let tickLabelRemove = options.tickLabelRemove;
    let axisLongLineRemove = options.axisLongLineRemove;
    let xGridColor = options.xGridColor;
    let xGridDashArray = options.xGridDashArray;
    let xGridStrokeWidth = parseFloat(options.xGridStrokeWidth);
    let yGridColor = options.yGridColor;
    let yGridDashArray = options.yGridDashArray;
    let yGridStrokeWidth = parseFloat(options.yGridStrokeWidth);

    let line0 = options.line0;

    let line0Stroke = options.line0Stroke;
    let line0StrokeWidth = parseFloat(options.line0StrokeWidth);
    let line0DashArray = options.line0DashArray;

    return [xAxisPosition, xAxisPositionSet, yAxisPosition, yAxisPositionSet, xTitlePosition, xTitlePositionSet, yTitlePosition, yTitlePositionSet,
      xTitle, yTitle, xAxisFont, yAxisFont, xTitleFont, yTitleFont, xTickLabelRotate, xTicks, yTicks, xTickSize, yTickSize, tickLabelRemove, axisLongLineRemove,
      xGridColor, xGridDashArray, xGridStrokeWidth, yGridColor, yGridDashArray, yGridStrokeWidth, line0, xAxisColor, yAxisColor, xTitleColor,
      yTitleColor, xTickLabelColor, yTickLabelColor, xAxisStrokeWidth, yAxisStrokeWidth, xTickStrokeWidth, yTickStrokeWidth, line0Stroke,
      line0StrokeWidth, line0DashArray]

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

  /**
   * This function draws the axises, axis titles and grids
   * @param  {...array} [] all the related parameters.
   */
  _drawAxis(...[svg, xScale, yScale, yMin, yMax, xDataName, yDataName, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, horizontal,
    xAxisPosition, xAxisPositionSet, yAxisPosition, yAxisPositionSet, xTitlePosition, xTitlePositionSet, yTitlePosition, yTitlePositionSet,
    xTitle, yTitle, xAxisFont, yAxisFont, xTitleFont, yTitleFont, xTickLabelRotate, xTicks, yTicks, xTickSize, yTickSize, tickLabelRemove, axisLongLineRemove,
    xGridColor, xGridDashArray, xGridStrokeWidth, yGridColor, yGridDashArray, yGridStrokeWidth, line0, xAxisColor, yAxisColor, xTitleColor,
    yTitleColor, xTickLabelColor, yTickLabelColor, xAxisStrokeWidth, yAxisStrokeWidth, xTickStrokeWidth, yTickStrokeWidth, line0Stroke,
    line0StrokeWidth, line0DashArray]) {

    if (!xAxisPositionSet && !horizontal) {
      // set default x axis to top if y max is 0
      if (yMax == 0 && xAxisPosition.length == 1 && xAxisPosition[0] == 'bottom') xAxisPosition = ['top'];
    }

    if (!yAxisPositionSet && horizontal) {
      if (yMax == 0 && yAxisPosition.length == 1 && yAxisPosition[0] == 'left') yAxisPosition = ['right'];
    }

    if (!xTitlePositionSet && !horizontal) {
      // set default x axisTitle to top if y max is 0
      if (yMax == 0 && xTitlePosition.length == 1 && xTitlePosition[0] == 'bottom') xTitlePosition = ['top'];
    }

    if (!yTitlePositionSet && horizontal) {
      if (yMax == 0 && yTitlePosition.length == 1 && yTitlePosition[0] == 'left') yTitlePosition = ['right'];
    }

    // add line at y = 0 when there is negative data
    let drawLine0 = (line0 && (
      (yMin < 0 && yMax > 0) ||
      (horizontal ? (yMin == 0 && !yAxisPosition.includes('left')) : (yMin == 0 && !xAxisPosition.includes('bottom'))) ||
      (horizontal ? (yMax == 0 && !yAxisPosition.includes('right')) : (yMax == 0 && !xAxisPosition.includes('top')))
    ))

    // if user not specified xTitle
    if (xTitle.length == 0) xTitle = xDataName;
    // if user not specified yTitle
    if (yTitle.length == 0) yTitle = yDataName;

    //x axis
    for (let i = 0; i < Math.min(xAxisPosition.length, 2); i++) {
      let xAxis = svg
        .append('g')
        .attr("color", xAxisColor)
        .style("font", xAxisFont)
        .attr('transform', `translate(0, ${xAxisPosition[i] == 'top' ? 0 : innerHeight})`)
        .call(xAxisPosition[i] == 'top' ? d3.axisTop(xScale).ticks(xTicks).tickSize(xTickSize) : d3.axisBottom(xScale).ticks(xTicks).tickSize(xTickSize))
        .attr("stroke-width", xAxisStrokeWidth);

      xAxis
        .selectAll("text")
        .attr("color", xTickLabelColor)
        .attr("y", (Math.max(xTickSize, 0) + 3 - (Math.max(xTickSize, 0) + 3) / 90 * Math.abs(xTickLabelRotate)) * (xAxisPosition[i] == 'top' ? -1 : 1))   // d3 default off y 9. Max 90 degrees to 0
        .attr("dy", `${0.355 + (0.355 - 0.355 / 90 * Math.abs(xTickLabelRotate)) * (xAxisPosition[i] == 'top' ? -1 : 1)}em`)   // d3 default off y 0.71em. Max 90 degrees to 0.355em
        .attr("x", ((Math.max(xTickSize, 0) + 3) / 90 * Math.abs(xTickLabelRotate)) * (xAxisPosition[i] == 'top' ? -1 : 1) * (xTickLabelRotate < 0 ? -1 : 1))   // d3 default off x 0. Max 90 degrees to 9
        .style("text-anchor", xTickLabelRotate != 0 ? (xTickLabelRotate < 0 ? (xAxisPosition[i] == 'top' ? 'start' : 'end') : (xAxisPosition[i] == 'top' ? 'end' : 'start')) : 'middle')
        .attr("transform", `rotate(${xTickLabelRotate})`);

      xAxis
        .selectAll("line")
        .attr("stroke-width", xTickStrokeWidth)

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
        .style('fill', xTitleColor)
        .attr("text-anchor", "middle")  // transform is applied to the middle anchor
        .attr("dominant-baseline", xTitlePosition[i] == 'top' ? "baseline" : "hanging")   //text vertical reference point
        .attr("transform", `translate(${innerWidth / 2}, ${xTitlePosition[i] == 'top' ? -frameTop : innerHeight + frameBottom})`)  // centre at margin bottom/top
        .text(xTitle);
    }

    //y axis
    for (let i = 0; i < Math.min(yAxisPosition.length, 2); i++) {
      let yAxis = svg
        .append('g')
        .style("color", yAxisColor)
        .style("font", yAxisFont)
        .attr('transform', `translate(${yAxisPosition[i] == 'right' ? innerWidth : 0}, 0)`)
        .call(yAxisPosition[i] == 'right' ? d3.axisRight(yScale).ticks(yTicks).tickSize(yTickSize) : d3.axisLeft(yScale).ticks(yTicks).tickSize(yTickSize))
        .attr("stroke-width", yAxisStrokeWidth);

      yAxis
        .selectAll("text")
        .attr("color", yTickLabelColor);

      // tick line
      yAxis
        .selectAll("line")
        .attr("stroke-width", yTickStrokeWidth);

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
        .style('fill', yTitleColor)
        .attr("text-anchor", "middle")  // transform is applied to the middle anchor
        .attr("dominant-baseline", yTitlePosition[i] == 'right' ? "hanging" : "baseline")   //text vertical reference point
        .attr("transform", `translate(${yTitlePosition[i] == 'right' ? innerWidth + frameRight : -frameLeft}, ${innerHeight / 2}) rotate(-90)`)  // centre at margin left/right
        .text(yTitle);
    }

    if (drawLine0) {
      svg.append("line")
        .attr("x1", horizontal ? xScale(0) + 0.5 : 0)
        .attr("y1", horizontal ? 0 : yScale(0) + 0.5)   // +0.5 to line up with tick
        .attr("x2", horizontal ? xScale(0) + 0.5 : innerWidth)
        .attr("y2", horizontal ? innerHeight : yScale(0) + 0.5)
        .style('stroke', line0Stroke)
        .style('stroke-width', line0StrokeWidth)
        .style("stroke-dasharray", line0DashArray);

    }

    // add x gridlines
    svg.append("g")
      .style("color", xGridColor)
      .style("stroke-dasharray", xGridDashArray)
      .style("stroke-width", xGridStrokeWidth)
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
      .style("color", yGridColor)
      .style("stroke-dasharray", yGridDashArray)
      .style("stroke-width", yGridStrokeWidth)
      .call(d3.axisLeft(yScale)
        .ticks(yTicks)
        .tickSize(-innerWidth)
        .tickFormat("")
      )
      .select("path")
      .remove();
  }

  /**
   * This function draws the figure title
   * @param  {...array} [] all the related parameters.
   */
  _drawTitle(...[svg, width, height, marginLeft, marginTop, frameTop, frameLeft, title, titleFont, titleColor, titleX, titleY, titleRotate]) {

    //Figure title
    svg
      .append("g")
      .attr("transform", `translate(${-(frameLeft + marginLeft)}, ${-(frameTop + marginTop)})`)  // move to the beginning
      .append("text")
      .style('font', titleFont)
      .style('fill', titleColor)
      .attr("text-anchor", titleX < 0.34 ? "start" : titleX < 0.67 ? "middle" : "end")  // transform is applied to the anchor
      .attr("transform", `translate(${width * titleX}, ${height * titleY}) rotate(${titleRotate})`)
      .attr("dy", `${titleY < 0.34 ? 0.8 : titleY < 0.67 ? 0.4 : -0.4}em`)   // reference point
      .text(title);
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