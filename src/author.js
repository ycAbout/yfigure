export function author() {
  /**
 * This library aims to provide the simplest but very powerful and flexible way to draw a graph on a web page.
 * One only needs to provide data in a 2d array format and an optional object contains all the figure options.
 * Every single option was carefully thought to provide the best possible user experience.
 * 
 * This library uses 2d array as data format instead of an array of objects for two reasons:
 * 1. 2d array looks more structurized and easier for visual perception.
 * 2. The order of key value pair in objects is not reliable in Javascript.
 */

  let copyright = 'Copyright ' + (new Date).getFullYear() + ' Yalin Chen'
  let info = `***yfigure, an easy to use data visualization javascript library build on top of d3js
  @author Yalin Chen yc.about@gmail.com
  ${copyright}***`
  return info
}