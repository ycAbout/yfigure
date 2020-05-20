import * as d3 from 'd3';

/**
 * This function parses the command options for a graph.
 * @param {object=} options An option object contains options for a graph. 
 * @return [] an array of the options.
 */
export function getOption(options = {}) {
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
export function setDataPoint() {

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
      .attr('font-size', '1.5em')
  }

  return dataPointDisplayId;
}
