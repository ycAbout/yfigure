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

      (typeof options.margin !== 'string' && typeof options.margin !== 'number') ? makeError('Option margin need to be an string or number!') : true;

      marginTop = marginLeft = marginBottom = marginRight = parseInt(options.margin);

      // any one of the margin is set
    } else if (options['marginLeft'] || ['marginTop'] || options['marginRight'] || options['marginBottom']) {
      options['marginLeft'] ? true : options['marginLeft'] = 25;
      options['marginTop'] ? true : options['marginTop'] = 25;
      options['marginRight'] ? true : options['marginRight'] = 25;
      options['marginBottom'] ? true : options['marginBottom'] = 25;

      //validate format
      (typeof options['marginLeft'] !== 'string' && typeof options['marginLeft'] !== 'number') ? makeError('Option marginLeft need to be an string or number!') : true;
      (typeof options['marginTop'] !== 'string' && typeof options['marginTop'] !== 'number') ? makeError('Option marginTop need to be an string or number!') : true;
      (typeof options['marginRight'] !== 'string' && typeof options['marginRight'] !== 'number') ? makeError('Option marginRight need to be an string or number!') : true;
      (typeof options['marginBottom'] !== 'string' && typeof options['marginBottom'] !== 'number') ? makeError('Option marginBottom need to be an string or number!') : true;

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

      (typeof options.frame !== 'string' && typeof options.frame !== 'number') ? makeError('Option frame need to be an string or number!') : true;

      frameTop = frameLeft = frameBottom = frameRight = parseInt(options.frame);


      // any one of the margin is set
    } else if (options.frameLeft || options.frameTop || options.frameRight || options.frameBottom) {
      options.frameLeft ? true : options.frameLeft = 30;
      options.frameTop ? true : options.frameTop = 30;
      options.frameRight ? true : options.frameRight = 30;
      options.frameBottom ? true : options.frameBottom = 30;

      //validate format
      (typeof options.frameLeft !== 'string' && typeof options.frameLeft !== 'number') ? makeError('Option frameLeft need to be an string or number!') : true;
      (typeof options.frameTop !== 'string' && typeof options.frameTop !== 'number') ? makeError('Option frameTop need to be an string or number!') : true;
      (typeof options.frameRight !== 'string' && typeof options.frameRight !== 'number') ? makeError('Option frameRight need to be an string or number!') : true;
      (typeof options.frameBottom !== 'string' && typeof options.frameBottom !== 'number') ? makeError('Option frameBottom need to be an string or number!') : true;

      frameLeft = parseInt(options.frameLeft);
      frameTop = parseInt(options.frameTop);
      frameRight = parseInt(options.frameRight);
      frameBottom = parseInt(options.frameBottom);

    } else {
      options.frame = 30;
      frameTop = frameLeft = frameBottom = frameRight = parseInt(options.frame);
    }

    //validate format
    (typeof options.width !== 'string' && typeof options.width !== 'number') ? makeError('Option width need to be an string or number!') : true;
    (typeof options.height !== 'string' && typeof options.height !== 'number') ? makeError('Option height need to be an string or number!') : true;
    typeof options.location !== 'string' ? makeError('Option location need to be an string or number!') : true;
    typeof options.id !== 'string' ? makeError('Option id need to be an string or number!') : true;

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

    // set defaul values so no need to feed options in a way none or all
    options.xAxisPosition ? true : options.xAxisPosition = ['bottom'];  // for none or both xAxisPosition = [], yAxisPosition = ['left', 'right']
    options.yAxisPosition ? true : options.yAxisPosition = ['left'];
    options.xTitlePosition ? true : options.xTitlePosition = ['bottom'];
    options.yTitlePosition ? true : options.yTitlePosition = ['left'];

    options.xAxisFont ? true : options.xAxisFont = '10px sans-serif';
    options.yAxisFont ? true : options.yAxisFont = '10px sans-serif';
    options.xTitleFont ? true : options.xTitleFont = '14px sans-serif';
    options.yTitleFont ? true : options.yTitleFont = '14px sans-serif';

    function makeError(msg) {
      throw new Error(msg)
    }

    //validate format
    !Array.isArray(options.xAxisPosition) ? makeError('Option xAxisPosition need to be an array!') : true;
    !Array.isArray(options.yAxisPosition) ? makeError('Option yAxisPosition need to be an array!') : true;
    !Array.isArray(options.xTitlePosition) ? makeError('Option xTitlePosition need to be an array!') : true;
    !Array.isArray(options.yTitlePosition) ? makeError('Option yTitlePosition need to be an array!') : true;

    typeof options.xAxisFont !== 'string' ? makeError('Option xAxisFont need to be an string!') : true;
    typeof options.yAxisFont !== 'string' ? makeError('Option yAxisFont need to be an string!') : true;
    typeof options.xTitleFont !== 'string' ? makeError('Option xTitleFont need to be an string!') : true;
    typeof options.yTitleFont !== 'string' ? makeError('Option yTitleFont need to be an string!') : true;

    //parse float just in case and get parameters
    let xAxisPosition = options.xAxisPosition;
    let yAxisPosition = options.yAxisPosition;
    let xTitlePosition = options.xTitlePosition;
    let yTitlePosition = options.yTitlePosition;
    let xAxisFont = options.xAxisFont;
    let yAxisFont = options.yAxisFont;
    let xTitleFont = options.xTitleFont;
    let yTitleFont = options.yTitleFont;

    return [xAxisPosition, yAxisPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]
  }

  /**
   * This function validates 2d array data format
   * @param {2darray} data  A 2d array data for the graph, in the format of `[['xName', 'y1Name', 'y2Name'...],['xValue', 'y1Value', 'y2Value'...]]`.  
   */
  _validate2dArray(data) {
    //validate 2d array data format
    if (!Array.isArray(data) || !data.every((row) => Array.isArray(row))) {
      throw new Error('data need to be a 2d array!')
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

    return [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin]
  }

  _drawAxis(...[svg, xScale, yScale, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, xDataName, yDataName,
    xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]) {
    //x axis
    for (let i = 0; i < Math.min(xPosition.length, 2); i++) {
      svg
        .append('g')
        .style("font", xAxisFont)
        .attr('transform', `translate(0, ${xPosition[i] == 'top' ? 0 : innerHeight})`)
        .call(xPosition[i] == 'top' ? d3.axisTop(xScale) : d3.axisBottom(xScale));
    }

    //x axis title
    for (let i = 0; i < Math.min(xTitlePosition.length, 2); i++) {
      svg
        .append("text")
        .style('font', xTitleFont)
        .attr("text-anchor", "middle")  // transform is applied to the middle anchor
        .attr("dominant-baseline", xTitlePosition[i] == 'top' ? "baseline" : "hanging")   //text vertical reference point
        .attr("transform", `translate(${innerWidth / 2}, ${xTitlePosition[i] == 'top' ? -frameTop : innerHeight + frameBottom})`)  // centre at margin bottom/top
        .text(xDataName);
    }

    //y axis
    for (let i = 0; i < Math.min(yPosition.length, 2); i++) {
      svg
        .append('g')
        .style("font", yAxisFont)
        .attr('transform', `translate(${yPosition[i] == 'right' ? innerWidth : 0}, 0)`)
        .call(yPosition[i] == 'right' ? d3.axisRight(yScale) : d3.axisLeft(yScale));
    }

    //y axis title
    for (let i = 0; i < Math.min(yTitlePosition.length, 2); i++) {
      svg
        .append("text")
        .style('font', yTitleFont)
        .attr("text-anchor", "middle")  // transform is applied to the middle anchor
        .attr("dominant-baseline", yTitlePosition[i] == 'right' ? "hanging" : "baseline")   //text vertical reference point
        .attr("transform", `translate(${yTitlePosition[i] == 'right' ? innerWidth + frameRight : -frameLeft}, ${innerHeight / 2}) rotate(-90)`)  // centre at margin left/right
        .text(yDataName);
    }
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