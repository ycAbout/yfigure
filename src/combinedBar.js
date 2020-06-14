import * as d3 from 'd3';
import { Bar } from './bar.js'

/**
* A Bar class for a horizontal simple or grouped bar graph (y represents continuous value).
*/
class CombinedBar {

  _draw(data, options) {


    let location = 'body';
    let width = 400;
    let marginTop = 20;
    let marginLeft = 20;
    let id = 'yd3combinedtest'

    let combined = d3.select(location)
      .append('span')       //non-block container
      .attr('style', `display:inline-block; width: ${width}px`)        //px need to be specified, otherwise not working
      .attr('id', id)
      .attr('style', `margin: ${marginTop}px 0 0 ${marginLeft}px`);       //px need to be specified, otherwise not working

    combined
      .append("div")
      .attr('id', id + 'minor')

    combined
      .append("div")
      .attr('id', id + 'major')

    options.location = '#' + id + 'minor'
    options.height = 200
    options.frameBottom = 0
    options.marginBottom = 0
    options.xAxisPostion = []
    options.xTitlePostion = []
    let barMinor = new Bar(data, options)

    options.height = 200
    options.location = '#' + id + 'major'
    options.frameTop = 0
    options.marginTop = 0
    options.yPadding = 0
    let barMajor = new Bar(data, options)
  }

}

export { CombinedBar }