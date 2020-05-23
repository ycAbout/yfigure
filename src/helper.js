import * as d3 from 'd3';

/**
 * This function parses the command options for a graph.
 * @param {object=} options An option object contains key value pair describing the options of a graph.
 *         common options:
 *         size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
 *         margin, describing the margin inside the svg in the format of `margin: { left: 40, top: 40, right: 40, bottom: 40 }`.  
 *         location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
 *         layout, describing positions of axises and titles in the format of 
 *           `layout: { xPosition: ['bottom'], yPosition: ['left'], xTitlePosition: ['bottom'], yTitlePosition: ['left'] }`  
 *           // for none or both { xPosition: [], yPosition: ['left', 'right']}.  
 *         font, describing the font of axises and titles in the format of 
 *           `font: { xAxisFont: '10px sans-serif', yAxisFont: '10px sans-serif', xTitleFont: '1em sans-serif', yTitleFont: '1em sans-serif' }`  
 * @return [] an array of the options.
 */
export function getOption(options = {}) {
  //set up individual optional options so no need to feed options in a way none or all
  options.size ? true : options.size = { width: 400, height: 300 };
  options.margin ? true : options.margin = { left: 40, top: 40, right: 40, bottom: 40 };
  options.location ? true : options.location = 'body';
  options.layout ? true : options.layout = { xPosition: ['bottom'], yPosition: ['left'], xTitlePosition: ['bottom'], yTitlePosition: ['left'] };   // for none or both { xPosition: [], yPosition: ['left', 'right']}
  options.font ? true : options.font = { xAxisFont: '10px sans-serif', yAxisFont: '10px sans-serif', xTitleFont: '1em sans-serif', yTitleFont: '1em sans-serif' };

  function makeError(msg) {
    throw new Error(msg)
  }

  //validate format
  typeof options.size !== 'object' ? makeError('Option size need to be an object!') : true;
  typeof options.margin !== 'object' ? makeError('Option margin need to be an object!') : true;
  typeof options.location !== 'string' ? makeError('Option location need to be a string!') : true;
  typeof options.layout !== 'object' ? makeError('Option font need to be an object!') : true;
  typeof options.font !== 'object' ? makeError('Option font need to be an object!') : true;

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
  let xPosition = options.layout.xPosition;
  let yPosition = options.layout.yPosition;
  let xTitlePosition = options.layout.xTitlePosition;
  let yTitlePosition = options.layout.yTitlePosition;
  let xAxisFont = options.font.xAxisFont;
  let yAxisFont = options.font.yAxisFont;
  let xTitleFont = options.font.xTitleFont;
  let yTitleFont = options.font.yTitleFont;

  return [width, height, top, left, bottom, right, innerWidth, innerHeight, location, xPosition, yPosition,
    xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont]
}

/**
 * This function set the data point object to be shown on mouseover for a graph.
 * @return {string} a string format of dataPointDisplay object ID to be selected.
 */
export function setDataPoint() {

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
      .style('font-size', '1.5em')
  }

  return dataPointDisplayId;
}
