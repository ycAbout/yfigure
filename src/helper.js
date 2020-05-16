
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


