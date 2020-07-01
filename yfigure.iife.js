var yf = (function (exports, d3) {
  'use strict';

  function author() {
    /**
   * This library aims to provide the simplest but very powerful and flexible way to draw a graph on a web page.
   * One only needs to provide data in a 2d array format and an optional object contains all the figure options.
   * Every single option was carefully thought to provide the best possible user experience.
   * 
   * This library uses 2d array as data format instead of an array of objects for two reasons:
   * 1. 2d array looks more structurized and easier for visual perception.
   * 2. The order of key value pair in objects is not reliable in Javascript.
   */

    let copyright = 'Copyright ' + (new Date).getFullYear() + ' Yalin Chen';
    let info = `***yfigure, an easy to use data visualization javascript library build on top of d3js
  @author Yalin Chen yc.about@gmail.com
  ${copyright}***`;
    return info
  }

  /**
   * A base class used for simple and grouped graph with axises, such as bar, line, and scatter.
   */
  class BaseSimpleGroupAxis {
    /**
     * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
     * @param {object=} options  An optional object contains following key value pairs:
     *                              common option key values pairs
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
      (options.width || parseInt(options.width) === 0) ? true : options.width = 400;
      (options.height || parseInt(options.height) === 0) ? true : options.height = 300;
      options.colors ? true : options.colors = ['#396AB1', '#CC2529', '#DA7C30', '#3E9651', '#535154', '#6B4C9A', '#922428', '#948B3D',
        'orange', 'blue', 'violet', '#6a2c70', '#b83b5e', '#f08a5d', '#fbc687', '#ea907a'];
      options.backgroundColor ? true : options.backgroundColor = '';
      options.title ? true : options.title = '';
      options.titleFont ? true : options.titleFont = 'bold 16px sans-serif';
      options.titleColor ? true : options.titleColor = 'black';
      (options.titleX || parseInt(options.titleX) === 0) ? true : options.titleX = 0.5;   // 0 - 1
      (options.titleY || parseInt(options.titleY) === 0) ? true : options.titleY = 0.02;   // 0 - 1
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

      if (!(parseFloat(options.titleX) <= 1 && parseFloat(options.titleX) >= 0)) {
        console.warn('Option titleX over maximum 1! It was reset to 1 (100%) !');
        options.titleX = Math.min(options.titleX, 1);
      }
      if (!(parseFloat(options.titleY) <= 1 && parseFloat(options.titleY) >= 0)) {
        console.warn('Option titleY over maximum 1! It was reset to 1 (100%) !');
        options.titleY = Math.min(options.titleY, 1);
      }

      !Array.isArray(options.colors) ? makeError(`Option colors needs to be an array!`) : true;

      let location = options.location;
      let id = options.id;
      let width = parseInt(options.width);
      let height = parseInt(options.height);
      let colors = options.colors;
      let backgroundColor = options.backgroundColor;

      let title = options.title;
      let titleFont = options.titleFont;
      let titleColor = options.titleColor;
      let titleX = parseFloat(options.titleX);
      let titleY = parseFloat(options.titleY);
      let titleRotate = parseInt(options.titleRotate);

      let marginTop, marginLeft, marginBottom, marginRight;

      // make margin short cut for all margin
      if (options.margin || parseInt(options.margin) === 0) {
        validateNumStr(options.margin, 'margin');
        marginTop = marginLeft = marginBottom = marginRight = parseInt(options.margin);
        // any one of the margin is set
      } else if ((options['marginLeft'] || parseInt(options.marginLeft) === 0)
        || (options['marginTop'] || parseInt(options.marginTop) === 0)
        || (options['marginRight'] || parseInt(options.marginRight) === 0)
        || (options['marginBottom'] || parseInt(options.marginBottom) === 0)
      ) {
        (options['marginLeft'] || parseInt(options.marginLeft) === 0) ? true : options['marginLeft'] = 25;
        (options['marginTop'] || parseInt(options.marginTop) === 0) ? true : options['marginTop'] = 25;
        (options['marginRight'] || parseInt(options.marginRight) === 0) ? true : options['marginRight'] = 25;
        (options['marginBottom'] || parseInt(options.marginBottom) === 0) ? true : options['marginBottom'] = 25;

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
      if (options.frame || parseInt(options.frame) === 0) {
        validateNumStr(options.frame, 'frame');
        frameTop = frameLeft = frameBottom = frameRight = parseInt(options.frame);
        // any one of the frame is set
      } else if ((options.frameLeft || parseInt(options.frameLeft) === 0)
        || (options.frameTop || parseInt(options.frameTop) === 0)
        || (options.frameRight || parseInt(options.frameRight) === 0)
        || (options.frameBottom || parseInt(options.frameBottom) === 0)
      ) {
        (options.frameLeft || parseInt(options.frameLeft) === 0) ? true : options.frameLeft = 30;
        (options.frameTop || parseInt(options.frameTop) === 0) ? true : options.frameTop = 30;
        (options.frameRight || parseInt(options.frameRight) === 0) ? true : options.frameRight = 30;
        (options.frameBottom || parseInt(options.frameBottom) === 0) ? true : options.frameBottom = 30;

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
        innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate]
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
      (options.xTitle || options.xTitle === '') ? true : options.xTitle = false;             // if false, use default from dataset
      (options.yTitle || options.yTitle === '') ? true : options.yTitle = false;             // if false, use default from dataset
      options.xAxisFont ? true : options.xAxisFont = '10px sans-serif';
      options.yAxisFont ? true : options.yAxisFont = '10px sans-serif';
      options.xTitleFont ? true : options.xTitleFont = '12px sans-serif';
      options.yTitleFont ? true : options.yTitleFont = '12px sans-serif';
      options.xTickLabelRotate ? true : options.xTickLabelRotate = 0;
      (options.xTicks || parseInt(options.xTicks) === 0) ? true : options.xTicks = null;
      (options.yTicks || parseInt(options.yTicks) === 0) ? true : options.yTicks = null;
      (options.xTickSize || parseFloat(options.xTickSize) === 0) ? true : options.xTickSize = 6;
      (options.yTickSize || parseFloat(options.yTickSize) === 0) ? true : options.yTickSize = 6;
      options.tickLabelRemove ? true : options.tickLabelRemove = [];
      options.axisLongLineRemove ? true : options.axisLongLineRemove = [];
      options.xGridColor ? true : options.xGridColor = '';
      options.xGridDashArray ? true : options.xGridDashArray = '';
      options.xGridStrokeWidth ? true : options.xGridStrokeWidth = 0;
      options.yGridColor ? true : options.yGridColor = '';
      options.yGridDashArray ? true : options.yGridDashArray = '';
      options.yGridStrokeWidth ? true : options.yGridStrokeWidth = 0;
      options.line0 === false ? true : options.line0 = true;
      (options.line0Stroke || options.line0Stroke === '') ? true : options.line0Stroke = 'black';
      (options.line0StrokeWidth || parseFloat(options.line0StrokeWidth) === 0) ? true : options.line0StrokeWidth = 1;
      options.line0DashArray ? true : options.line0DashArray = '';

      //****************** not returned, assigned in each individual function */
      (options.xPadding || parseFloat(options.xPadding) === 0) ? options.xPadding = parseFloat(options.xPadding) : options.xPadding = 0.1;  // just set up, not returned in array
      (options.yPadding || parseFloat(options.yPadding) === 0) ? options.yPadding = parseFloat(options.yPadding) : options.yPadding = 0.1;  // jsut set up, not returned in array

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

      if (options.xTitle !== false) validateString(options.xTitle.toString(), 'xTitle');  // cannot to string, default false value given
      if (options.yTitle !== false) validateString(options.yTitle.toString(), 'yTitle');  // cannot to string, default false value given
      validateString(options.xAxisFont.toString(), 'xAxisFont');
      validateString(options.yAxisFont.toString(), 'yAxisFont');
      validateString(options.xTitleFont.toString(), 'xTitleFont');
      validateString(options.yTitleFont.toString(), 'yTitleFont');
      validateString(options.xGridColor.toString(), 'xGridColor');
      validateString(options.xGridDashArray.toString(), 'xGridDashArray');
      validateString(options.yGridColor.toString(), 'yGridColor');
      validateString(options.yGridDashArray.toString(), 'yGridDashArray');
      validateString(options.line0Stroke.toString(), 'line0Stroke');
      validateString(options.line0DashArray.toString(), 'line0DashArray');

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
        validateString(options.axisColor, 'axisColor');
        xAxisColor = yAxisColor = xTitleColor = yTitleColor = xTickLabelColor = yTickLabelColor = options.axisColor;
        // any one of the margin is set
      } else if (options['xAxisColor'] || options['yAxisColor'] || options['xTitleColor'] || options['yTitleColor'] || options['xTickLabelColor'] || options['yTickLabelColor ']) {
        options['xAxisColor'] ? true : options['xAxisColor'] = 'black';
        options['yAxisColor'] ? true : options['yAxisColor'] = 'black';
        options['xTitleColor'] ? true : options['xTitleColor'] = 'black';
        options['yTitleColor'] ? true : options['yTitleColor'] = 'black';
        options['xTickLabelColor'] ? true : options['xTickLabelColor'] = 'black';
        options['yTickLabelColor'] ? true : options['yTickLabelColor'] = 'black';

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
        xAxisStrokeWidth = yAxisStrokeWidth = xTickStrokeWidth = yTickStrokeWidth = parseFloat(options.axisStrokeWidth);
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
      let xTitle = (options.xTitle === false ? options.xTitle : options.xTitle.toString());
      let yTitle = (options.yTitle === false ? options.yTitle : options.yTitle.toString());
      let xAxisFont = options.xAxisFont.toString();
      let yAxisFont = options.yAxisFont.toString();
      let xTitleFont = options.xTitleFont.toString();
      let yTitleFont = options.yTitleFont.toString();
      let xTickLabelRotate = parseInt(options.xTickLabelRotate);
      let xTicks = options.xTicks;
      let yTicks = options.yTicks;
      let xTickSize = parseFloat(options.xTickSize);
      let yTickSize = parseFloat(options.yTickSize);
      let tickLabelRemove = options.tickLabelRemove;
      let axisLongLineRemove = options.axisLongLineRemove;
      let xGridColor = options.xGridColor.toString();
      let xGridDashArray = options.xGridDashArray.toString();
      let yGridColor = options.yGridColor.toString();
      let yGridDashArray = options.yGridDashArray.toString();
      let xGridStrokeWidth = parseFloat(options.xGridStrokeWidth);
      let yGridStrokeWidth = parseFloat(options.yGridStrokeWidth);

      let line0 = options.line0;

      let line0Stroke = options.line0Stroke.toString();
      let line0DashArray = options.line0DashArray.toString();
      let line0StrokeWidth = parseFloat(options.line0StrokeWidth);

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
      let dataValue = data.slice(1);

      return [xDataName, xDataIndex, yDataNames, yDataName, dataValue]
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

      // set default x axis to top if y max is 0
      if (!xAxisPositionSet && !horizontal) {
        if (yMax <= 0 && xAxisPosition.length == 1 && xAxisPosition[0] == 'bottom') xAxisPosition = ['top'];
      }

      if (!yAxisPositionSet && horizontal) {
        if (yMax <= 0 && yAxisPosition.length == 1 && yAxisPosition[0] == 'left') yAxisPosition = ['right'];
      }

      if (!xTitlePositionSet && !horizontal) {
        // set default x axisTitle to top if y max is 0
        if (yMax <= 0 && xTitlePosition.length == 1 && xTitlePosition[0] == 'bottom') xTitlePosition = ['top'];
      }

      if (!yTitlePositionSet && horizontal) {
        if (yMax <= 0 && yTitlePosition.length == 1 && yTitlePosition[0] == 'left') yTitlePosition = ['right'];
      }

      // add line at y = 0 when there is negative data
      let drawLine0 = (line0 && (
        (yMin < 0 && yMax > 0) ||
        (horizontal ? (yMin == 0 && !yAxisPosition.includes('left')) : (yMin == 0 && !xAxisPosition.includes('bottom'))) ||
        (horizontal ? (yMax == 0 && !yAxisPosition.includes('right')) : (yMax == 0 && !xAxisPosition.includes('top')))
      ));

      // if user not specified xTitle
      if (xTitle === false) xTitle = xDataName;
      // if user not specified yTitle
      if (yTitle === false) yTitle = yDataName;

      tickLabelRemove = tickLabelRemove.map((ele) => ele.trim().split(/\s+/));
      let tickLabelRemoveAxis = tickLabelRemove.map((ele) => ele[0]);

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
          .attr("stroke-width", xTickStrokeWidth);

        // set label not display
        let omitIndex = tickLabelRemoveAxis.indexOf(xAxisPosition[i]);
        if (omitIndex != -1) {
          tickLabelRemove[omitIndex].slice(1).map((ele) => d3.select(xAxis.selectAll("text").nodes()[ele])
            .style("display", "none"));
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

        // set label not display
        let omitIndex = tickLabelRemoveAxis.indexOf(xAxisPosition[i]);
        if (omitIndex != -1) {
          tickLabelRemove[omitIndex].slice(1).map((ele) => d3.select(yAxis.selectAll("text").nodes()[ele])
            .style("display", "none"));
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
          .style('font-size', '1.2em');
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

  //time series axis, area, pie chart, stack area, additional y, scatter x category, title second line
  //error bar, line hover, ScaleStart 0.9 error, datapoint attached to figure, background multiple color, y break (two figures, top add a small figure), commerical copyright,

  /**
  * A Bar class for a horizontal simple or grouped bar graph (y represents continuous value).
  */
  class Bar extends BaseSimpleGroupAxis {
    /**
     * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
     * @param {object=} options  An optional object contains following key value pairs:
     *                              common option key values pairs
     *                              graph specific key value pairs:
     *                                scaleStart, only works for all positive or all negative data, works for simple bar, grouped bar, stacked bar.
     */
    constructor(data, options = {}) {
      super(data, options);

      //set up graph specific option
      (this._options.withinGroupPadding || parseInt(this._options.withinGroupPadding) === 0) ? true : this._options.withinGroupPadding = 0;
      this._options.stacked === true ? true : this._options.stacked = false;
      this._options.horizontal === true ? true : this._options.horizontal = false;

      (this._options.legendX || parseInt(this._options.legendX) === 0) ? true : options.legendX = 0.18;
      (this._options.legendY || parseInt(this._options.legendY) === 0) ? true : options.legendY = 0.12;
      this._options.legendWidth ? true : this._options.legendWidth = 600;
      this._options.legendFont ? true : this._options.legendFont = '10px sans-serif';
      this._options.scaleStart ? true : this._options.scaleStart = 0;
      this._options.legendOn === false ? true : this._options.legendOn = true;          // an option of omit legend when graphs are combined

      function makeError(msg) {
        throw new Error(msg)
      }

      //validate format
      if (typeof this._options.stacked !== 'boolean') { makeError('Option stacked need to be a boolean!'); }
      if (typeof this._options.horizontal !== 'boolean') { makeError('Option horizontal need to be a boolean!'); }
      if (typeof this._options.legendOn !== 'boolean') makeError('Option legendOn needs to be a boolean!');

      function validateNumStr(numStrToBe, errorString) {
        (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
      }
      validateNumStr(this._options.legendX, 'legendX');
      validateNumStr(this._options.legendY, 'legendY');
      validateNumStr(this._options.legendWidth, 'legendWidth');
      validateNumStr(this._options.scaleStart, 'scaleStart');

      typeof this._options.legendFont !== 'string' ? makeError(`Option legendFont needs to be a string!`) : true;

      this._validate2dArray(this._data);
      this._draw(this._data, this._options);
    }

    /**
  * This function draws a horizontal bar graph (y represents continuous value) using d3 and svg.  
  * @return {string}         append a graph to html and returns the graph id.  
  */
    _draw(data, options) {

      let withinGroupPadding = options.withinGroupPadding;
      let stacked = options.stacked;
      let horizontal = options.horizontal;

      let legendX = Math.min(parseFloat(options.legendX), 0.98);
      let legendY = Math.min(parseFloat(options.legendY), 0.98);
      let legendWidth = parseFloat(options.legendWidth);
      let legendFont = options.legendFont;

      let scaleStart = parseFloat(options.scaleStart);

      let legendOn = options.legendOn;

      // set all the common options
      let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

      // set all the axis options
      let axisOptionArray = this._getAxisOption(options);

      // has to be after set axis options
      let xPadding = options.xPadding;
      let yPadding = options.yPadding;

      // set data parameters
      let [xDataName, xDataIndex, yDataNames, yDataName, dataValue] = this._setDataParameters(data);

      let svg = d3.select(location)
        .append('svg')
        .attr('id', id)
        .attr('width', width)
        .attr('height', height)
        .style('background-color', backgroundColor)
        .append('g')
        .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

      //colors for difference lines
      let colorScale = d3.scaleOrdinal()
        .domain(yDataNames)
        .range(colors);

      // initialize legend position
      let legendx = legendX * width;
      let legendy = legendY * height;

      // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
      let dataPointDisplayId = this._setDataPoint();

      // to hold legend click status, the y data selection status
      let legendState = new Array(yDataNames.length).fill(1);

      let scaleSwitch = 0;  // for horizontal, to make sure swtich only once

      const drawModule = () => {

        let yNamesSelected = yDataNames.filter((name, index) => legendState[index] == 1);

        //get max and min data for each y columns
        let maxYArray = [];
        let minYArray = [];
        for (let j = 0; j < yDataNames.length; j++) {
          if (yNamesSelected.length === 0) {         // no data selected, normal
            maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
            minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
          } else if (legendState[j]) {               // some data selected, only for selected data
            maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
            minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
          }
        }

        let dataMax = d3.max(maxYArray);
        let dataMin = d3.min(minYArray);

        // for stacked bar chart
        let lastPositive = new Array(dataValue.length).fill(0);       // hold accumulated value for each y
        let lastNegative = new Array(dataValue.length).fill(0);
        // used to set accumulated scale
        let dataSumPostiveArray = [];       // to hold positve for each row
        let dataSumNegativeArray = [];
        for (let j = 0; j < dataValue.length; j++) {
          let sumPostive = 0;
          let sumNegative = 0;
          [x, 1, 2, 3, -1, -2, -3];
          for (let k = 1; k < dataValue[j].length; k++) {
            if (yNamesSelected.length === 0) {
              if (dataValue[j][k] < 0) {
                sumNegative += dataValue[j][k];
              } else {
                sumPostive += dataValue[j][k];
              }
            } else if (legendState[k - 1]) {               // some data selected, only for selected data
              if (dataValue[j][k] < 0) {
                sumNegative += dataValue[j][k];
              } else {
                sumPostive += dataValue[j][k];
              }
            }
          }
          dataSumPostiveArray.push(sumPostive);
          dataSumNegativeArray.push(sumNegative);
        }

        let dataMaxSum = stacked ? Math.max(...dataSumPostiveArray) : 0;
        let dataMinSum = stacked ? Math.min(...dataSumNegativeArray) : 0;

        // make data plot approximately 10% range off the range
        let ySetback = Math.abs(dataMax <= 0 ? dataMin : (dataMin > 0 ? dataMax - scaleStart : dataMax - dataMin)) * (horizontal ? xPadding : yPadding);
        let ySetbackStack = (dataMaxSum - dataMinSum) * (horizontal ? xPadding : yPadding);

        // scaleStart only works for all postive or all negative data
        let baseNumber = (
          (dataMin > 0 && scaleStart <= dataMin && scaleStart > 0)
          || (dataMax < 0 && scaleStart >= dataMax && scaleStart < 0)
        ) ? scaleStart : 0;   // if all postive or all negative data, scaleStart works

        let baseNumberStack = (
          (dataMin > 0 && scaleStart <= minYArray[0] && scaleStart > 0)
          || (dataMax < 0 && scaleStart >= maxYArray[0] && scaleStart < 0)
        ) ? scaleStart : 0;   // if all postive or all negative data, scaleStart works

        // if there is negative data, set y min. Otherwise choose 0 as default y min
        let yMin = stacked ? (dataMin < 0 ? dataMinSum - ySetbackStack : Math.max(baseNumberStack, 0)) : (dataMin < 0 ? dataMin - ySetback : Math.max(baseNumber, 0));
        // when there is postive data, set y max. Otherwsie choose 0 as default y max
        let yMax = stacked ? (dataMax > 0 ? dataMaxSum + ySetbackStack : Math.min(baseNumberStack, 0)) : (dataMax <= 0 ? Math.min(baseNumber, 0) : dataMax + ySetback);

        let xScale = d3.scaleBand()
          .domain(dataValue.map((element) => element[xDataIndex]))
          .range([0, horizontal ? innerHeight : innerWidth])
          .padding((horizontal ? yPadding : xPadding));

        let xSubScale = d3.scaleBand()
          .domain(stacked ? ['stack'] : yNamesSelected)
          .range([0, xScale.bandwidth()])
          .padding(withinGroupPadding);

        let yScale = d3.scaleLinear()
          .domain([yMin, yMax])
          .range(horizontal ? [0, innerWidth] : [innerHeight, 0]);

        // remove old content group if exist and draw a new one
        if (svg.select('#' + id + 'sky999all').node()) {
          svg.select('#' + id + 'sky999all').remove();
        }

        //set the bar group, assign svg to content because there need something on the same level to make remove then add work, don't know why
        let content = svg
          .append('g')
          .attr('id', id + 'sky999all');

        let firstTime = 0;  // first bar draw indicator for stacked bar, used for stacked bar scale start

        // draw each y data
        for (let i = 0; i < yDataNames.length; i++) {
          // if legend is unclicked
          if (legendState[i]) {
            content
              .append('g')
              .selectAll('rect')
              .data(dataValue)
              .join('rect')
              .attr("transform", element => horizontal ? `translate(0, ${xScale(element[xDataIndex])})` : `translate(${xScale(element[xDataIndex])}, 0)`)
              .attr('x', (element, index) => {
                if (horizontal) {   // horizontal bar chart
                  if (stacked) {
                    let baseline = 0;
                    if (element[i + 1] >= 0) {
                      baseline = lastPositive[index];
                      lastPositive[index] += element[i + 1];    //update
                    } else {
                      baseline = lastNegative[index];
                      lastNegative[index] += element[i + 1];
                    }
                    // change scale start scaleStart only works for the first bar
                    if (baseline === 0) {
                      return yScale(Math.min(element[i + 1], baseNumberStack));
                    } else {
                      return yScale(Math.min(baseline + element[i + 1], baseline));
                    }
                  } else {
                    return yScale(Math.min(element[i + 1], baseNumber));
                  }
                } else {
                  return stacked ? xSubScale('stack') : xSubScale(yDataNames[i])
                }
              })
              .attr('width', (element, index) => {
                return (horizontal ? Math.abs(yScale(element[i + 1]) - yScale(stacked ? (firstTime === 0 ? baseNumberStack : 0) : baseNumber)) : xSubScale.bandwidth());
              })
              .attr('y', (element, index) => {
                if (horizontal) {   // horizontal bar chart
                  return stacked ? xSubScale('stack') : xSubScale(yDataNames[i])
                } else {
                  if (stacked) {
                    let baseline;
                    if (element[i + 1] >= 0) {
                      baseline = lastPositive[index];
                      lastPositive[index] += element[i + 1];    //update
                    } else {
                      baseline = lastNegative[index];
                      lastNegative[index] += element[i + 1];
                    }
                    // change scale start scaleStart only works for the first bar
                    if (baseline === 0) {
                      return yScale(Math.max(element[i + 1], baseNumberStack));
                    } else {
                      return yScale(Math.max(baseline + element[i + 1], baseline));
                    }
                  } else {
                    return yScale(Math.max(element[i + 1], baseNumber));   // if negative, use y(start) as starting point
                  }
                }
              })
              .attr('height', (element, index) => {
                return (horizontal ? xSubScale.bandwidth() : Math.abs(yScale(element[i + 1]) - yScale((stacked ? (firstTime === 0 ? baseNumberStack : 0) : baseNumber))));
              })  // height = distance to y(scaleStart) 
              .attr('fill', element => {
                if (yDataNames.length == 1) {
                  return element[i + 1] > 0 ? colorScale(yDataNames[i]) : colors[1]       //only one y, positive vs. negative
                } else {
                  return colorScale(yDataNames[i])              // two and more ys, no postive vs. negative
                }
              })
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

            firstTime = 1;
          }
        }

        if (horizontal) {    // switch xScale and yScale to make axis
          let middleMan = xScale;
          xScale = yScale;
          yScale = middleMan;

          if (!scaleSwitch) {
            middleMan = xDataName;
            xDataName = yDataName;
            yDataName = middleMan;
            scaleSwitch = 1;
          }
        }

        //add the axis to content group
        content = content
          .append('g')
          .attr('id', id + 'xyl999');

        this._drawAxis(...[content, xScale, yScale, yMin, yMax, xDataName, yDataName, innerWidth, innerHeight,
          frameTop, frameBottom, frameRight, frameLeft, horizontal], ...axisOptionArray);
      };

      // first draw
      drawModule();

      // Add legend
      if (yDataNames.length > 1 && legendOn) {

        let legend = svg
          .append("g")
          .attr("transform", `translate(${-(frameLeft + marginLeft)}, ${-(frameTop + marginTop)})`);  // move to the beginning

        // draw each y legend
        for (let i = 0; i < yDataNames.length; i++) {

          let legendText = legend
            .append('text')
            .style('font', legendFont)
            .attr("transform", `translate(${legendx + 12}, ${legendy})`)
            .attr("dy", "0.8em")
            .attr('fill', colorScale(yDataNames[i]))
            .text(yDataNames[i])
            .attr("key", i)
            .on("click", function () {
              let position = parseInt(this.getAttribute('key'));
              legendState[position] = 1 - legendState[position];
              this.setAttribute("opacity", Math.max(legendState[position], 0.5));
              drawModule();
            });

          let textWidth = legendText.node().getBBox().width;
          let textHeight = legendText.node().getBBox().height;

          legend
            .append("rect")
            .attr("transform", `translate(${legendx}, ${legendy + (textHeight - 12) / 2})`)
            .attr("width", 8)
            .attr("height", 8)
            .attr("fill", colorScale(yDataNames[i]));

          // set up next legend x and y
          legendx += 12 + textWidth + 8;

          // if there is another
          if (i + 1 < yDataNames.length) {
            //test bbox for next one
            let nextLegendText = legend
              .append('text')
              .text(yDataNames[i + 1]);
            let nextTextWidth = nextLegendText.node().getBBox().width;
            nextLegendText.remove();

            // if add next legend spill over innerWidth
            if (legendx + 12 + nextTextWidth > Math.min(legendX * width + legendWidth, width)) {
              legendy += textHeight + 2;    // start a new line
              legendx = legendX * width;
            }
          }
        }
      }

      this._drawTitle(...[svg, width, height, marginLeft, marginTop, frameTop, frameLeft, title, titleFont, titleColor, titleX, titleY, titleRotate]);

      return id;
    }
  }

  /**
  * A Histogram class for a histogram graph (y represents frequency).  
  */
  class Histogram extends BaseSimpleGroupAxis {
    /**
     * 
     * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
     * @param {object=} options  An optional object contains following key value pairs:
     *                          common option key values pairs
     *                          graph specific key value pairs:
     *                            `nBins: 70` Sets how many bins to put the data in
     *                            `color: 'steelblue'` Sets the colors used for bars 
     */
    constructor(data, options = {}) {
      super(data, options);
      //set up graph specific option
      this._options.nBins ? true : this._options.nBins = 50;
      this._options.horizontal === true ? true : this._options.horizontal = false;

      //validate format
      if (typeof this._options.nBins !== 'number') { throw new Error('Option nBins need to be an array object!') }
      if (typeof this._options.horizontal !== 'boolean') { throw new Error('Option horizontal need to be a boolean!') }

      this._validate2dArray(this._data);
      this._draw(this._data, this._options);
    }

    /**
   * @return {string}          append a graph to html and returns the graph id.  
   */
    _draw(data, options) {

      // set all the common options
      let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

      // set all the axis options
      let axisOptionArray = this._getAxisOption(options);

      let xPadding = options.xPadding;
      let yPadding = options.yPadding;
      let nBins = options.nBins;
      let horizontal = options.horizontal;

      let color = colors[0];

      let xDataName = data[0][0];
      let xDataIndex = 0;
      let yDataName = 'Frequency';

      // get ride of column name, does not modify origin array
      let dataValue = data.slice(1);

      let dataMax = d3.max(dataValue, d => d[xDataIndex]);
      let dataMin = d3.min(dataValue, d => d[xDataIndex]);

      let yMin = 0;   // just for passing yMin, no real use
      let yMax = dataValue.length;   // just for passing yMin, no real use

      let svg = d3.select(location)
        .append('svg')
        .attr('id', id)
        .attr('width', width)
        .attr('height', height)
        .style('background-color', backgroundColor)
        .append('g')
        .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

      // X axis scale
      let xScale = d3.scaleLinear()
        .domain([dataMin, dataMax])
        .range([0, horizontal ? innerHeight : innerWidth]);

      //evenly generate an array of thresholds, each value = min + nthPortion*(max-min)/nBins
      let portion = (dataMax - dataMin) / nBins;
      let thresholdArray = [];
      for (let i = 0; i < nBins; i++) {
        thresholdArray.push(dataMin + i * portion);
      }

      // set the parameters for the histogram
      let histogram = d3.histogram()
        .value(d => d[xDataIndex])
        .domain(xScale.domain())
        .thresholds(thresholdArray); // split data into bins

      // to get the bins
      let bins = histogram(dataValue);

      let yScale = d3.scaleLinear()
        .range(horizontal ? [0, innerWidth] : [innerHeight, 0])
        .domain([0, d3.max(bins, d => d.length * (1 + (horizontal ? xPadding : yPadding)))]);

      // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
      let dataPointDisplayId = this._setDataPoint();

      // append the bar rectangles to the svg element
      svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", d => horizontal ? 0 : xScale(d.x0))
        .attr("y", d => horizontal ? xScale(d.x0) : yScale(d.length))
        .attr("width", d => horizontal ? yScale(d.length) : xScale(d.x1) - xScale(d.x0) - 1)
        .attr("height", d => horizontal ? xScale(d.x1) - xScale(d.x0) - 1 : innerHeight - yScale(d.length))
        .style("fill", color)
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


      if (horizontal) {    // switch xScale and yScale to make axis
        let middleMan = xScale;
        xScale = yScale;
        yScale = middleMan;

        middleMan = xDataName;
        xDataName = yDataName;
        yDataName = middleMan;
      }

      this._drawAxis(...[svg, xScale, yScale, yMin, yMax, xDataName, yDataName, innerWidth, innerHeight,
        frameTop, frameBottom, frameRight, frameLeft, horizontal], ...axisOptionArray);

      this._drawTitle(...[svg, width, height, marginLeft, marginTop, frameTop, frameLeft, title, titleFont, titleColor, titleX, titleY, titleRotate]);

      return id;

    }

  }

  /**
   * A LineDot class for a line with dot graph (y represents continuous value).  
   */
  class LineDot extends BaseSimpleGroupAxis {
    /**
     * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnY1Name', 'columnY2Name'],['a', n1, n2],['b', n3, n4]]`.  
     * @param {object=} options An optional object contains following key value pairs:
     *                          common option key values pairs
     *                          graph specific key value pairs:
     *                            `dotRadius: 4` Sets the radius of the dot, value `1` produce a line graph.
     */
    constructor(data, options = {}) {
      super(data, options);

      //set up graph specific option
      this._options.dotRadius ? true : this._options.dotRadius = 4;
      this._options.horizontal === true ? true : this._options.horizontal = false;

      (this._options.legendX || parseInt(this._options.legendX) === 0) ? true : this._options.legendX = 0.18;
      (this._options.legendY || parseInt(this._options.legendY) === 0) ? true : this._options.legendY = 0.12;
      this._options.legendWidth ? true : options.legendWidth = 600;
      this._options.legendFont ? true : options.legendFont = '10px sans-serif';

      //validate format
      if (typeof this._options.dotRadius !== 'number') { throw new Error('Option dotRadius need to be a number!') }
      if (typeof this._options.horizontal !== 'boolean') { throw new Error('Option horizontal need to be a boolean!') }

      function validateNumStr(numStrToBe, errorString) {
        (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
      }
      validateNumStr(this._options.legendX, 'legendX');
      validateNumStr(this._options.legendY, 'legendY');
      validateNumStr(this._options.legendWidth, 'legendWidth');

      typeof this._options.legendFont !== 'string' ? makeError(`Option legendFont needs to be a string!`) : true;

      this._validate2dArray(this._data);
      this._draw(this._data, this._options);
    }

    /**
     * This function draws a single or multiple line with dot graph (y represents continuous value) using d3 and svg.  
     * @return {string}         append a graph to html and returns the graph id.  
     */
    _draw(data, options) {

      let dotRadius = options.dotRadius;
      let horizontal = options.horizontal;

      let legendX = Math.min(parseFloat(options.legendX), 0.98);
      let legendY = Math.min(parseFloat(options.legendY), 0.98);
      let legendWidth = parseFloat(options.legendWidth);
      let legendFont = options.legendFont;

      // set all the common options
      let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

      // set all the axis options
      let axisOptionArray = this._getAxisOption(options);

      let xPadding = options.xPadding;
      let yPadding = options.yPadding;

      // set data parameters
      let [xDataName, xDataIndex, yDataNames, yDataName, dataValue] = this._setDataParameters(data);

      let svg = d3.select(location)
        .append('svg')
        .attr('id', id)
        .attr('width', width)
        .attr('height', height)
        .style('background-color', backgroundColor)
        .append('g')
        .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

      //colors for difference lines
      let colorScale = d3.scaleOrdinal()
        .domain(yDataNames)
        .range(colors);

      // initialize legend position
      let legendx = legendX * width;
      let legendy = legendY * height;

      // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
      let dataPointDisplayId = this._setDataPoint();

      // to hold legend click status, the y data selection status
      let legendState = new Array(yDataNames.length).fill(1);

      let scaleSwitch = 0;   // for horizontal, to make sure swtich only once

      const drawModule = () => {

        let yNamesSelected = yDataNames.filter((name, index) => legendState[index] == 1);

        //get max and min data for each y columns
        let maxYArray = [];
        let minYArray = [];
        for (let j = 0; j < yDataNames.length; j++) {
          if (yNamesSelected.length === 0) {         // no data selected, normal
            maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
            minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
          } else if (legendState[j]) {               // some data selected, only for selected data
            maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
            minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
          }
        }

        let dataMax = d3.max(maxYArray);
        let dataMin = d3.min(minYArray);

        // make highest number approximately 10% range off the range
        let ySetback = (dataMax - dataMin) * (horizontal ? xPadding : yPadding);  //10% of data range

        let yMin = dataMin - ySetback;
        let yMax = dataMax + ySetback;

        //scalePoint can use padding but not scaleOrdinal
        let xScale = d3.scalePoint()
          .domain(dataValue.map((element) => element[xDataIndex]))
          .range([0, horizontal ? innerHeight : innerWidth])
          .padding((horizontal ? yPadding : xPadding));

        let yScale = d3.scaleLinear()
          .domain([yMin, yMax])  // data points off axis
          .range(horizontal ? [0, innerWidth] : [innerHeight, 0]);

        // remove old content group if exist and draw a new one
        if (svg.select('#' + id + 'sky999all').node()) {
          svg.select('#' + id + 'sky999all').remove();
        }

        //set the bar group, assign svg to content because there need something on the same level to make remove then add work, don't know why
        let content = svg
          .append('g')
          .attr('id', id + 'sky999all');

        // draw each y data
        for (let i = 0; i < yDataNames.length; i++) {
          // if legend is unclicked
          if (legendState[i]) {
            // draw a line
            content
              .append("path")
              .datum(dataValue)
              .attr("fill", "none")
              .attr("stroke", colorScale(yDataNames[i]))
              .attr("stroke-width", 2)
              .attr("d", d3.line()
                .x(element => horizontal ? yScale(element[i + 1]) : xScale(element[xDataIndex]))
                .y(element => horizontal ? xScale(element[xDataIndex]) : yScale(element[i + 1]))
              );

            // Add the points
            content
              .append("g")
              .selectAll("circle")
              .data(dataValue)
              .join("circle")
              .attr("cx", element => horizontal ? yScale(element[i + 1]) : xScale(element[xDataIndex]))
              .attr("cy", element => horizontal ? xScale(element[xDataIndex]) : yScale(element[i + 1]))
              .attr("r", dotRadius)
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
          }
        }

        if (horizontal) {    // switch xScale and yScale to make axis
          let middleMan = xScale;
          xScale = yScale;
          yScale = middleMan;

          if (!scaleSwitch) {
            middleMan = xDataName;
            xDataName = yDataName;
            yDataName = middleMan;
            scaleSwitch = 1;
          }
        }

        //add the axis to content group
        content = content
          .append('g')
          .attr('id', id + 'xyl999');

        this._drawAxis(...[content, xScale, yScale, yMin, yMax, xDataName, yDataName, innerWidth, innerHeight,
          frameTop, frameBottom, frameRight, frameLeft, horizontal], ...axisOptionArray);

      };

      // first draw
      drawModule();

      // Add legend
      if (yDataNames.length > 1) {

        let legend = svg
          .append("g")
          .attr("transform", `translate(${-(frameLeft + marginLeft)}, ${-(frameTop + marginTop)})`);  // move to the beginning

        // draw each y legend
        for (let i = 0; i < yDataNames.length; i++) {
          let legendText = legend
            .append('text')
            .style('font', legendFont)
            .attr("transform", `translate(${legendx + 24}, ${legendy})`)
            .attr("dy", "0.8em")
            .attr('fill', colorScale(yDataNames[i]))
            .text(yDataNames[i])
            .attr("key", i)
            .on("click", function () {
              let position = parseInt(this.getAttribute('key'));
              legendState[position] = 1 - legendState[position];
              this.setAttribute("opacity", Math.max(legendState[position], 0.5));
              drawModule();
            });

          let textWidth = legendText.node().getBBox().width;
          let textHeight = legendText.node().getBBox().height;

          legend
            .append('path')
            .attr("stroke", colorScale(yDataNames[i]))
            .attr("stroke-width", 2)
            .attr("d", d3.line()([[legendx, legendy + 4 + (textHeight - 12) / 2], [legendx + 20, legendy + 4 + (textHeight - 12) / 2]]));

          let legendDotRadius = Math.min(dotRadius, 5);  // what if dotRadius too large

          legend
            .append("circle")
            .attr("transform", `translate(${legendx + 10}, ${legendy + 4 + (textHeight - 12) / 2})`)
            .attr("r", legendDotRadius)
            .attr("fill", colorScale(yDataNames[i]));

          // set up next legend x and y
          legendx += 24 + textWidth + 8;

          // if there is another
          if (i + 1 < yDataNames.length) {
            //test bbox for next one
            let nextLegendText = legend
              .append('text')
              .text(yDataNames[i + 1]);
            let nextTextWidth = nextLegendText.node().getBBox().width;
            nextLegendText.remove();

            // if add next legend spill over innerWidth
            if (legendx + 12 + nextTextWidth > Math.min(legendX * width + legendWidth, width)) {
              legendy += textHeight + 2;    // start a new line
              legendx = legendX * width;
            }
          }
        }
      }

      this._drawTitle(...[svg, width, height, marginLeft, marginTop, frameTop, frameLeft, title, titleFont, titleColor, titleX, titleY, titleRotate]);

      return id;

    }
  }

  /**
   * A Scatter class for a single or multiple scatter graph (x and y represent continuous values).  
   */
  class Scatter extends BaseSimpleGroupAxis {
    /**
     * @param {array} data      A 2d array data in the format of `[['columnXName',  'columnY1Name', 'columnY2Name'],['a', n1, n2],['b', n3, n4]]`.  
     * @param {object=} options An optional object contains following key value pairs:
     *                          common option key values pairs
     *                          graph specific key value pairs:
     *                            `dotRadius: 4` Sets the radius of the dot.
     */
    constructor(data, options = {}) {
      super(data, options);

      //set up graph specific option
      this._options.dotRadius ? true : this._options.dotRadius = 4;
      (this._options.legendX || parseInt(this._options.legendX) === 0) ? true : this._options.legendX = 0.18;
      (this._options.legendY || parseInt(this._options.legendY) === 0) ? true : this._options.legendY = 0.12;
      this._options.legendWidth ? true :this._options.legendWidth = 600;
      this._options.legendFont ? true : this._options.legendFont = '10px sans-serif';

      //validate format
      if (typeof this._options.dotRadius !== 'number') { throw new Error('Option dotRadius need to be a number!') }

      function validateNumStr(numStrToBe, errorString) {
        (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
      }
      validateNumStr(this._options.legendX, 'legendX');
      validateNumStr(this._options.legendY, 'legendY');
      validateNumStr(this._options.legendWidth, 'legendWidth');

      typeof this._options.legendFont !== 'string' ? makeError(`Option legendFont needs to be a string!`) : true;

      this._validate2dArray(this._data);
      this._draw(this._data, this._options);
    }

    /**
     * This function draws a scatter plot (x, y represents continuous value) using d3 and svg.  
     * @return {string}         append a graph to html and returns the graph id.  
     */
    _draw(data, options) {

      let dotRadius = options.dotRadius;

      let legendX = Math.min(parseFloat(options.legendX), 0.98);
      let legendY = Math.min(parseFloat(options.legendY), 0.98);
      let legendWidth = parseFloat(options.legendWidth);
      let legendFont = options.legendFont;


      // set all the common options
      let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

      // set all the axis options
      let axisOptionArray = this._getAxisOption(options);

      let xPadding = options.xPadding;
      let yPadding = options.yPadding;

      // set data parameters
      let [xDataName, xDataIndex, yDataNames, yDataName, dataValue] = this._setDataParameters(data);

      let svg = d3.select(location)
        .append('svg')
        .attr('id', id)
        .attr('width', width)
        .attr('height', height)
        .style('background-color', backgroundColor)
        .append('g')
        .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

      //colors for difference lines
      let colorScale = d3.scaleOrdinal()
        .domain(yDataNames)
        .range(colors);

      // initialize legend position
      let legendx = legendX * width;
      let legendy = legendY * height;

      // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
      let dataPointDisplayId = this._setDataPoint();

      // to hold legend click status, the y data selection status
      let legendState = new Array(yDataNames.length).fill(1);

      const drawModule = () => {

        let yNamesSelected = yDataNames.filter((name, index) => legendState[index] == 1);

        //get max and min data for each y columns
        let maxYArray = [];
        let minYArray = [];
        for (let j = 0; j < yDataNames.length; j++) {
          if (yNamesSelected.length === 0) {         // no data selected, normal
            maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
            minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
          } else if (legendState[j]) {               // some data selected, only for selected data
            maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
            minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
          }
        }

        let dataMax = Math.max(d3.max(maxYArray), 0);
        let dataMin = Math.min(d3.min(minYArray), 0);

        // make highest number approximately 10% range off the range
        let ySetback = (dataMax - dataMin) * yPadding;  //10% of data range

        let yMin = dataMin - ySetback;
        let yMax = dataMax + ySetback;

        // set up x scale, make data points approximately 2% off axis
        let xMax = d3.max(dataValue, element => element[xDataIndex]);
        let xMin = d3.min(dataValue, element => element[xDataIndex]);
        let xSetback = (xMax - xMin) * xPadding;

        let xScale = d3.scaleLinear()
          .domain([xMin - xSetback, xMax])  // data points off axis
          .range([0, innerWidth]);

        let yScale = d3.scaleLinear()
          .domain([yMin, yMax])  // data points off axis
          .range([innerHeight, 0]);

        // remove old content group if exist and draw a new one
        if (svg.select('#' + id + 'sky999all').node()) {
          svg.select('#' + id + 'sky999all').remove();
        }

        //set the bar group, assign svg to content because there need something on the same level to make remove then add work, don't know why
        let content = svg
          .append('g')
          .attr('id', id + 'sky999all');

        // draw each y
        for (let i = 0; i < yDataNames.length; i++) {
          // if legend is unclicked
          if (legendState[i]) {
            // Add the points
            content
              .append("g")
              .selectAll("circle")
              .data(dataValue)
              .enter()
              .append("circle")
              .attr("cx", function (element) { return xScale(element[xDataIndex]) })
              .attr("cy", function (element) { return yScale(element[i + 1]) })
              .attr("r", dotRadius)
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
          }
        }

        content = content
          .append('g')
          .attr('id', id + 'xyl999');

        let horizontal = false;
        this._drawAxis(...[content, xScale, yScale, yMin, yMax, xDataName, yDataName, innerWidth, innerHeight,
          frameTop, frameBottom, frameRight, frameLeft, horizontal], ...axisOptionArray);

      };

      // first draw
      drawModule();

      // Add legend
      if (yDataNames.length > 1) {
        let legend = svg
          .append("g")
          .attr("transform", `translate(${-(frameLeft + marginLeft)}, ${-(frameTop + marginTop)})`);  // move to the beginning
        // draw each y legend
        for (let i = 0; i < yDataNames.length; i++) {
          let legendText = legend
            .append('text')
            .style('font', legendFont)
            .attr("transform", `translate(${legendx + 12}, ${legendy})`)
            .attr("dy", "0.8em")
            .attr('fill', colorScale(yDataNames[i]))
            .text(yDataNames[i])
            .attr("key", i)
            .on("click", function () {
              let position = parseInt(this.getAttribute('key'));
              legendState[position] = 1 - legendState[position];
              this.setAttribute("opacity", Math.max(legendState[position], 0.5));
              drawModule();
            });

          let textWidth = legendText.node().getBBox().width;
          let textHeight = legendText.node().getBBox().height;

          legend
            .append("circle")
            .attr("transform", `translate(${legendx + 4}, ${legendy + 4 + (textHeight - 12) / 2})`)
            .attr("r", 4)
            .attr("fill", colorScale(yDataNames[i]));

          // set up next legend x and y
          legendx += 12 + textWidth + 8;

          // if there is another
          if (i + 1 < yDataNames.length) {
            //test bbox for next one
            let nextLegendText = legend
              .append('text')
              .text(yDataNames[i + 1]);
            let nextTextWidth = nextLegendText.node().getBBox().width;
            nextLegendText.remove();

            // if add next legend spill over innerWidth
            if (legendx + 12 + nextTextWidth > Math.min(legendX * width + legendWidth, width)) {
              legendy += textHeight + 2;    // start a new line
              legendx = legendX * width;
            }
          }
        }
      }

      this._drawTitle(...[svg, width, height, marginLeft, marginTop, frameTop, frameLeft, title, titleFont, titleColor, titleX, titleY, titleRotate]);

      return id;
    }
  }

  /**
   * A SortableBar class for a sortable bar graph (y represent continuous values).  
   */
  class SortableBar extends BaseSimpleGroupAxis {
    /**
     * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
     * @param {object=} options An optional object contains following key value pairs:
     *                          common option key values pairs
     *                          graph specific key value pairs:
     *                             `barPadding: 0.1` Sets bar paddings between the bar, or bar group
     */
    constructor(data, options = {}) {
      super(data, options);

      //set up graph specific option
      this._options.horizontal === true ? true : this._options.horizontal = false;

      //validate format
      if (typeof this._options.horizontal !== 'boolean') { throw new Error('Option horizontal need to be a boolean!') }

      this._validate2dArray(this._data);
      this._draw(this._data, this._options);
    }

    /**
     * This function draws a horizontal sortable bar graph (y represents continuous value) using d3 and svg.  
     * @return {string}         append a graph to html and returns the graph id.  
     */
    _draw(data, options) {

      let horizontal = options.horizontal;

      // set all the common options
      let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
        innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

      // set all the axis options
      let axisOptionArray = this._getAxisOption(options);

      // has to be after set axis options
      let xPadding = options.xPadding;
      let yPadding = options.yPadding;

      // take first column as x name label, second column as y name label, of the first object
      let xDataName = data[0][0];
      let yDataName = data[0][1];
      // x y data positions
      let xDataIndex = 0;
      let yDataIndex = 1;

      if (horizontal) {    // switch xScale and yScale to make axis
        let middleManName = xDataName;
        xDataName = yDataName;
        yDataName = middleManName;
      }

      // get ride of column name, does not modify origin array
      let dataValue = data.slice(1);

      let selection = d3.select(location)
        .append('span')       //non-block container
        .attr('style', `display:inline-block; width: ${width}px`)        //px need to be specified, otherwise not working
        .attr('id', id)
        .append('div')   // make it on top of figure
        .attr('style', `margin: ${marginTop}px 0 0 ${marginLeft}px`)        //px need to be specified, otherwise not working
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
        .style('background-color', backgroundColor)
        .append('g')
        .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

      // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
      let dataPointDisplayId = this._setDataPoint();

      // use arrow function to automatically bind this.
      const draw = (dataValue, svg, order) => {
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
        let ySetback = (dataMax - dataMin) * (horizontal ? xPadding : yPadding);

        // if there is negative data, set y min. Otherwise choose 0 as default y min
        let yMin = (dataMin < 0 ? dataMin - ySetback : 0);
        // when there is postive data, set y max. Otherwsie choose 0 as default y max
        let yMax = (dataMax > 0 ? dataMax + ySetback : 0);

        //x and y scale inside function for purpose of update (general purpose, not necessary but no harm in this case)
        let xScale = d3.scaleBand()
          .domain(innerData.map((element) => element[xDataIndex]))
          .range([0, horizontal ? innerHeight : innerWidth])
          .padding((horizontal ? yPadding : xPadding));

        let yScale = d3.scaleLinear()
          .domain([yMin, yMax])
          .range(horizontal ? [0, innerWidth] : [innerHeight, 0]);

        //draw graph, update works with select rect
        svg
          .selectAll('rect')
          .data(innerData)
          .join(
            enter => enter.append('rect'),
            update => update
          )
          .attr('x', element => horizontal ? yScale(Math.min(element[yDataIndex], 0)) : xScale(element[xDataIndex]))
          .attr('width', element => horizontal ? Math.abs(yScale(element[yDataIndex]) - yScale(0)) : xScale.bandwidth())
          .attr('y', element => horizontal ? xScale(element[xDataIndex]) : yScale(Math.max(element[yDataIndex], 0)))       // if negative, use y(0) as starting point
          .attr('height', element => horizontal ? xScale.bandwidth() : Math.abs(yScale(element[yDataIndex]) - yScale(0)))  // height = distance to y(0)
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
          
        // remove old content group if exist and draw a new one
        if (svg.select('#' + id + 'xyl999').node()) {
          svg.select('#' + id + 'xyl999').remove();
        }

        //set the axis group
        let axisGroup = svg
          .append('g')
          .attr('id', id + 'xyl999');
          
        if (horizontal) {    // switch xScale and yScale to make axis
          let middleMan = xScale;
          xScale = yScale;
          yScale = middleMan;
        }

        this._drawAxis(...[axisGroup, xScale, yScale, yMin, yMax, xDataName, yDataName, innerWidth, innerHeight,
          frameTop, frameBottom, frameRight, frameLeft, horizontal], ...axisOptionArray);

      };

      //initialize
      draw(dataValue, svg, 'default');

      this._drawTitle(...[svg, width, height, marginLeft, marginTop, frameTop, frameLeft, title, titleFont, titleColor, titleX, titleY, titleRotate]);

      // don't know why cannot use arrow function here
      selection
        .on('change', function () {
          draw(dataValue, svg, this.value);
        });

      return id;
    }
  }

  /**
  * A Bar class for a horizontal simple or grouped bar graph (y represents continuous value).
  */
  class CombinedBar {
    constructor(data, options = {}) {
      // set defaul values so no need to feed options in a way none or all
      options.location ? true : options.location = 'body';
      options.id ? true : options.id = this._brand + 'id' + Math.floor(Math.random() * 1000000).toString();
      (options.width || parseInt(options.width) === 0) ? true : options.width = 400;
      options.dataBreak ? true : options.dataBreak = [30, 50, 0.3];
      (options.height || parseInt(options.height) === 0) ? true : options.height = 300;

      function makeError(msg) {
        throw new Error(msg)
      }

      //validate format
      function validateString(stringToBe, errorString) {
        typeof stringToBe !== 'string' ? makeError(`Option ${errorString} needs to be an string!`) : true;
      }

      validateString(options.location, 'location');
      validateString(options.id, 'id');

      function validateNumStr(numStrToBe, errorString) {
        (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
      }

      validateNumStr(options.width, 'width');
      validateNumStr(options.height, 'height');

      !Array.isArray(options.dataBreak) ? makeError(`Option dataBreak needs to be an array!`) : true;

      this._draw(data, options);
    }

    _draw(data, options) {

      let location = options.location;
      let id = options.id;
      let width = parseInt(options.width);
      let dataBreak = options.dataBreak;
      let height = parseInt(options.height);

      let combined = d3.select(location)
        .append('span')       //non-block container
        .attr('style', `display:inline-block; width: ${width}px`)        //px need to be specified, otherwise not working
        .attr('id', id)
        .append('div');

      combined
        .append("div")
        .attr('id', id + 'minor');
   
      combined
        .append("div")
        .attr('id', id + 'major');
   
      let innerDataMajor = JSON.parse(JSON.stringify(data));
      innerDataMajor.map((element, index) => {
        if (index > 0) {
          element.map((ele, index) => {
            if (index > 0) {  // excluded first column which holds x value
              if (ele > dataBreak[0]) element[index] = dataBreak[0];
            }
          });
        }
      });

      let innerDataMinor = JSON.parse(JSON.stringify(data));
      innerDataMinor.map((element, index) => {
        if (index > 0) {
          element.map((ele, index) => {
            if (index > 0) {
              if (ele < dataBreak[1]) element[index] = dataBreak[1];
            }
          });
        }
      });

      // minor bar 
      let barMinor = new Bar(innerDataMinor, { ...options,
        location: '#' + id + 'minor',
        height: height*dataBreak[2],
        width: width,
        frameBottom: 0,
        marginBottom: 5,
        scaleStart: dataBreak[1],
        yTicks: dataBreak[2] * 10,
        xAxisPosition: [],
        xTitlePosition: [],
        yTitlePosition: [],
      });

      // major bar
      let barMajor = new Bar(innerDataMajor, { ...options,
        height: height - height*dataBreak[2],
        location: '#' + id + 'major',
        width: width,
        frameTop: 0,
        marginTop: 5,
        yPadding: 0,
        legendOn: false,
      });
    }

  }

  exports.Bar = Bar;
  exports.CombinedBar = CombinedBar;
  exports.Histogram = Histogram;
  exports.LineDot = LineDot;
  exports.Scatter = Scatter;
  exports.SortableBar = SortableBar;
  exports.author = author;

  return exports;

}({}, d3));