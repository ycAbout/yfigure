/**
 * A base class used for simple and grouped graph with axises, such as bar, line, and scatter. frame to hold axis, 
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
   *         common options:
   *           `width: 400`  Sets width of the svg
   *           `height: 300`  Sets height of the svg
   *           `margin: 50` Sets all the margin properties in one declaration
   *           `margin-left: 50` Sets inside margin
   *           `margin-top: 50` Sets inside margin
   *           `margin-right: 50` Sets inside margin
   *           `margin-bottom: 50` Sets inside margin
   *           `location: 'body', or '#<ID>'` Sets the html location where to put the graph 
   *           `id: 'graph123456'`.  Sets the id of graph
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

    let top, left, bottom, right;

    function makeError(msg) {
      throw new Error(msg)
    }

    // make margin short cut for all margin
    if (options.margin) {

      (typeof options.margin !== 'string' && typeof options.margin !== 'number') ? makeError('Option margin need to be an string or number!') : true;

      top = left = bottom = right = parseInt(options.margin);

      // any one of the margin is set
    } else if (options['margin-left'] || ['margin-top'] || options['margin-right'] || options['margin-bottom']) {
      options['margin-left'] ? true : options['margin-left'] = 50;
      options['margin-top'] ? true : options['margin-top'] = 50;
      options['margin-right'] ? true : options['margin-right'] = 50;
      options['margin-bottom'] ? true : options['margin-bottom'] = 50;

      //validate format
      (typeof options['margin-left']   !== 'string' && typeof options['margin-left']   !== 'number') ? makeError('Option margin-left need to be an string or number!') : true;
      (typeof options['margin-top']    !== 'string' && typeof options['margin-top']    !== 'number') ? makeError('Option margin-top need to be an string or number!') : true;
      (typeof options['margin-right']  !== 'string' && typeof options['margin-right']  !== 'number') ? makeError('Option margin-right need to be an string or number!') : true;
      (typeof options['margin-bottom'] !== 'string' && typeof options['margin-bottom'] !== 'number') ? makeError('Option margin-bottom need to be an string or number!') : true;

      left = parseInt(options['margin-left']);
      top = parseInt(options['margin-top']);
      right = parseInt(options['margin-right']);
      bottom = parseInt(options['margin-bottom']);

    } else {
      options.margin = 50;
      top = left = bottom = right = options.margin;
    }

    //validate format
    (typeof options.width !== 'string' && typeof options.width !== 'number') ? makeError('Option width need to be an string or number!') : true;
    (typeof options.height !== 'string' && typeof options.height !== 'number') ? makeError('Option height need to be an string or number!') : true;
    typeof options.location !== 'string' ? makeError('Option location need to be an string or number!') : true;
    typeof options.id !== 'string' ? makeError('Option id need to be an string or number!') : true;

    //parse float just in case and get parameters
    let innerWidth = width - left - right;
    let innerHeight = height - top - bottom;

    return [width, height, top, left, bottom, right, innerWidth, innerHeight, location, id]
  }


  /**
   * This function parses the axis options for a graph.
   * @param {object} options An option object contains key value pair describing the axis options of a graph.
   *         layout, describing positions of axises and titles in the format of 
   *           `layout: { xPosition: ['bottom'], yPosition: ['left'], xTitlePosition: ['bottom'], yTitlePosition: ['left'] }`  
   *           // for none or both { xPosition: [], yPosition: ['left', 'right']}.  
   *         font, describing the font of axises and titles in the format of 
   *           `font: { xAxisFont: '10px sans-serif', yAxisFont: '10px sans-serif', xTitleFont: '1em sans-serif', yTitleFont: '1em sans-serif' }`  
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
    options.xTitleFont ? true : options.xTitleFont = '10px sans-serif';
    options.yTitleFont ? true : options.yTitleFont = '10px sans-serif';

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