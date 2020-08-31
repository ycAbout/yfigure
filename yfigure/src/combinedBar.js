import * as d3 from 'd3';
import { Bar } from './bar.js'

/**
* A Bar class for a horizontal simple or grouped bar graph (y represents continuous value).
*/
class CombinedBar {
  constructor(data, options = {}) {
    // set defaul values so no need to feed options in a way none or all
    options.location ? true : options.location = 'body';
    options.id ? true : options.id = this._brand + 'id' + Math.floor(Math.random() * 1000000).toString();
    (options.width || parseInt(options.width) === 0) ? true : options.width = 400;
    options.dataBreak ? true : options.dataBreak = [30, 50, 0.3];
    (options.height || parseInt(options.height) === 0) ? true : options.height = 300;

    function makeError(msg) {
      throw new Error(msg)
    }

    //validate format
    function validateString(stringToBe, errorString) {
      typeof stringToBe !== 'string' ? makeError(`Option ${errorString} needs to be an string!`) : true;
    }

    validateString(options.location, 'location');
    validateString(options.id, 'id');

    function validateNumStr(numStrToBe, errorString) {
      (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
    }

    validateNumStr(options.width, 'width');
    validateNumStr(options.height, 'height');

    !Array.isArray(options.dataBreak) ? makeError(`Option dataBreak needs to be an array!`) : true;

    this._draw(data, options)
  }

  _draw(data, options) {

    let location = options.location;
    let id = options.id;
    let width = parseInt(options.width);
    let dataBreak = options.dataBreak;
    let height = parseInt(options.height);

    let combined = d3.select(location)
      .append('span')       //non-block container
      .attr('style', `display:inline-block; width: ${width}px`)        //px need to be specified, otherwise not working
      .attr('id', id)
      .append('div')

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

    // minor bar 
    let barMinor = new Bar(innerDataMinor, { ...options,
      location: '#' + id + 'minor',
      height: height*dataBreak[2],
      width: width,
      frameBottom: 0,
      marginBottom: 5,
      scaleStart: dataBreak[1],
      yTicks: dataBreak[2] * 10,
      xAxisPosition: [],
      xTitlePosition: [],
      yTitlePosition: [],
    })

    // major bar
    let barMajor = new Bar(innerDataMajor, { ...options,
      height: height - height*dataBreak[2],
      location: '#' + id + 'major',
      width: width,
      frameTop: 0,
      marginTop: 5,
      yPadding: 0,
      legendOn: false,
    })
  }

}

export { CombinedBar }