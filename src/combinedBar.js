import * as d3 from 'd3';
import { Bar } from './bar.js'

/**
* A Bar class for a horizontal simple or grouped bar graph (y represents continuous value).
*/
class CombinedBar {

  _draw(data, options) {

    let dataBreak = [70, 80]

    let location = 'body';
    let width = 400;
    let marginTop = 20;
    let marginLeft = 20;
    let id = 'yd3combinedtest'

    let combined = d3.select(location)
      .append('span')       //non-block container
      .attr('style', `display:inline-block; width: ${width}px`)        //px need to be specified, otherwise not working
      .attr('id', id)
      .append('div')
      .attr('style', `margin: ${marginTop}px 0 0 ${marginLeft}px`);       //px need to be specified, otherwise not working

    combined
      .append("div")
      .attr('id', id + 'minor')

    combined
      .append("div")
      .attr('id', id + 'major')


    let innerDataMajor = JSON.parse(JSON.stringify(data));
    innerDataMajor.map((element, index) => {
      if (index > 0) {
        element.map((ele, index) => {
          if (index > 0) {  // excluded first column which holds x value
            if (ele > dataBreak[0]) element[index] = dataBreak[0];
          }
        })
      }
    })

    let innerDataMinor = JSON.parse(JSON.stringify(data));
    innerDataMinor.map((element, index) => {
      if (index > 0) {
        element.map((ele, index) => {
          if (index > 0) {
            if (ele < dataBreak[1]) element[index] = dataBreak[1];
          }
        })
      }
    })


    let barMinor = new Bar(innerDataMinor, {
      location: '#' + id + 'minor',
      height: 200,
      frameBottom: 0,
      marginBottom: 0,
      xAxisPostion: [],
      xTitlePostion: [],
    })

    let barMajor = new Bar(innerDataMajor, {
      height: 200,
      location: '#' + id + 'major',
      frameTop: 0,
      marginTop: 0,
      yPadding: 0,
    })
  }

}

export { CombinedBar }