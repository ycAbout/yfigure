class BaseSimpleGroupAxis {
  constructor(data, options) {
    this._options = options;    //_ does not have any real effect, just visually indicate private variables.
    this._data = data;
  }

  /**
   * This function parses the command options for a graph.
   * @param {object} options An option object contains key value pair describing the options of a graph.
   *         common options:
   *         size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
   *         margin, describing the margin inside the svg in the format of `margin: { left: 50, top: 50, right: 50, bottom: 50 }`.  
   *         location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
   *         id, describing id of the graph in the format of `id: 'graph123456'`. 
   * @return [] an array of each individual option.
   */
  _getCommonOption(options) {
    //set up individual optional options so no need to feed options in a way none or all
    options.size ? true : options.size = { width: 400, height: 300 };
    options.margin ? true : options.margin = { left: 50, top: 50, right: 50, bottom: 50 };
    options.location ? true : options.location = 'body';
    options.id ? true : options.id = 'yd3graphid' + Math.floor(Math.random() * 1000000).toString();

    function makeError(msg) {
      throw new Error(msg)
    }

    //validate format
    typeof options.size !== 'object' ? makeError('Option size need to be an object!') : true;
    typeof options.margin !== 'object' ? makeError('Option margin need to be an object!') : true;
    typeof options.location !== 'string' ? makeError('Option location need to be a string!') : true;
    typeof options.id !== 'string' ? makeError('Option id need to be a string!') : true;


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
    let id = options.id;

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
 * @return [] an array of each individual axis option.
 */
  _getAxisOption(options) {
    //set up individual optional options so no need to feed options in a way none or all
    options.layout ? true : options.layout = { xPosition: ['bottom'], yPosition: ['left'], xTitlePosition: ['bottom'], yTitlePosition: ['left'] };   // for none or both { xPosition: [], yPosition: ['left', 'right']}
    options.font ? true : options.font = { xAxisFont: '10px sans-serif', yAxisFont: '10px sans-serif', xTitleFont: '1em sans-serif', yTitleFont: '1em sans-serif' };

    function makeError(msg) {
      throw new Error(msg)
    }

    //validate format
    typeof options.layout !== 'object' ? makeError('Option font need to be an object!') : true;
    typeof options.font !== 'object' ? makeError('Option font need to be an object!') : true;

    //parse float just in case and get parameters
    let xPosition = options.layout.xPosition;
    let yPosition = options.layout.yPosition;
    let xTitlePosition = options.layout.xTitlePosition;
    let yTitlePosition = options.layout.yTitlePosition;
    let xAxisFont = options.font.xAxisFont;
    let yAxisFont = options.font.yAxisFont;
    let xTitleFont = options.font.xTitleFont;
    let yTitleFont = options.font.yTitleFont;

    return [xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]
  }

  _validate2dArray(data) {
    //validate 2d array data format
    if (!Array.isArray(data) || !data.every((row) => Array.isArray(row))) {
      throw new Error('data need to be a 2d array!')
    }
  }

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

    let dataPointDisplayId = 'yd3DataPointDisplay999999';

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
}  

export { BaseSimpleGroupAxis }