export function author() {
  let copyright = 'Copyright ' + (new Date).getFullYear() + ' Yalin Chen'
  let info = `******
  yd3, an easy to use data visualization javascript library build on top of d3js
  @author Yalin Chen yc.about@gmail.com
  ${copyright}
  ******`
  return info
}