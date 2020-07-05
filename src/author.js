export function author() {
  /**
 * This javascript library aims to provide the simplest but super powerful and flexible way to draw a figure.
 * One only needs to provide data in a 2d array format and an optional object contains all the figure options.
 * Every single option was carefully thought through to provide the best possible user experience. 
 * This library is build on top of d3js, thus d3 copyright applies to the d3 portion of this library.
 * 
 * This library uses 2d array as data format instead of an array of objects for two reasons:
 * 1. 2d array looks more structurized and easier for visual perception.
 * 2. The order of key value pair in objects is not reliable in Javascript.
 */

  let copyright = 'Copyright ' + (new Date).getFullYear() + ' Yalin Chen'
  let info = `***yfigure, a javascript library aims to provide the simplest but super powerful and flexible way to do data visualization.
  @author Yalin Chen yc.about@gmail.com
  ${copyright}***`
  return info
}