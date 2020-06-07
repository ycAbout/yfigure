import * as d3 from 'd3';
import { BaseSimpleGroupAxis } from './baseClass.js';

/**
* A Histogram class for a histogram graph (y represents frequency).  
*/
class Histogram extends BaseSimpleGroupAxis {
  /**
   * 
   * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
   * @param {object=} options  An optional object contains following key value pairs:
   *                          common option key values pairs
   *                          graph specific key value pairs:
   *                            `nBins: 70` Sets how many bins to put the data in
   *                            `color: 'steelblue'` Sets the colors used for bars 
   */
  constructor(data, options = {}) {
    super(data, options);
    //set up graph specific option
    this._options.nBins ? true : this._options.nBins = 50;
    this._options.horizontal === true ? true : this._options.horizontal = false;

    //validate format
    if (typeof this._options.nBins !== 'number') { throw new Error('Option nBins need to be an array object!') }
    if (typeof this._options.horizontal !== 'boolean') { throw new Error('Option horizontal need to be a boolean!') }

    this._validate2dArray(this._data);
    this._draw(this._data, this._options);
  }

  /**
 * @return {string}          append a graph to html and returns the graph id.  
 */
  _draw(data, options) {

    // set all the common options
    let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
      innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

    // set all the axis options
    let axisOptionArray = this._getAxisOption(options);

    let xPadding = options.xPadding;
    let yPadding = options.yPadding;
    let nBins = options.nBins;
    let horizontal = options.horizontal;

    let color = colors[0];

    let xDataName = data[0][0];
    let xDataIndex = 0;
    let yDataName = 'Frequency';

    // get ride of column name, does not modify origin array
    let dataValue = data.slice(1)

    let dataMax = d3.max(dataValue, d => d[xDataIndex]);
    let dataMin = d3.min(dataValue, d => d[xDataIndex]);

    let yMin = 0;   // just for passing yMin, no real use
    let yMax = dataValue.length;   // just for passing yMin, no real use

    let svg = d3.select(location)
      .append('svg')
      .attr('id', id)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', backgroundColor)
      .append('g')
      .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

    // X axis scale
    let xScale = d3.scaleLinear()
      .domain([dataMin, dataMax])
      .range([0, horizontal ? innerHeight : innerWidth]);

    //evenly generate an array of thresholds, each value = min + nthPortion*(max-min)/nBins
    let portion = (dataMax - dataMin) / nBins
    let thresholdArray = [];
    for (let i = 0; i < nBins; i++) {
      thresholdArray.push(dataMin + i * portion)
    }

    // set the parameters for the histogram
    let histogram = d3.histogram()
      .value(d => d[xDataIndex])
      .domain(xScale.domain())
      .thresholds(thresholdArray); // split data into bins

    // to get the bins
    let bins = histogram(dataValue);

    let yScale = d3.scaleLinear()
      .range(horizontal ? [0, innerWidth] : [innerHeight, 0])
      .domain([0, d3.max(bins, d => d.length * (1 + (horizontal ? xPadding : yPadding)))]);

    // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
    let dataPointDisplayId = this._setDataPoint();

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", d => horizontal ? 0 : xScale(d.x0))
      .attr("y", d => horizontal ? xScale(d.x0) : yScale(d.length))
      .attr("width", d => horizontal ? yScale(d.length) : xScale(d.x1) - xScale(d.x0) - 1)
      .attr("height", d => horizontal ? xScale(d.x1) - xScale(d.x0) - 1 : innerHeight - yScale(d.length))
      .style("fill", color)
      .on('mouseover', (d) => {
        d3.select('#' + dataPointDisplayId)
          .style('display', null)
          .style('top', (d3.event.pageY - 20) + 'px')
          .style('left', (d3.event.pageX + 'px'))
          .text('[' + Math.round((d.x0 + Number.EPSILON) * 100) / 100 + '-' + Math.round((d.x1 + Number.EPSILON) * 100) / 100 + '] : ' + d.length);
      })
      .on('mousemove', (d) => {
        d3.select('#' + dataPointDisplayId)
          .style('display', null)
          .style('top', (d3.event.pageY - 20) + 'px')
          .style('left', (d3.event.pageX + 'px'))
          .text('[' + Math.round((d.x0 + Number.EPSILON) * 100) / 100 + '-' + Math.round((d.x1 + Number.EPSILON) * 100) / 100 + '] : ' + d.length);
      })
      .on('mouseout', () => d3.select('#' + dataPointDisplayId).style('display', 'none'));


    if (horizontal) {    // switch xScale and yScale to make axis
      let middleMan = xScale;
      xScale = yScale;
      yScale = middleMan;

      middleMan = xDataName;
      xDataName = yDataName;
      yDataName = middleMan;
    }

    this._drawAxis(...[svg, xScale, yScale, yMin, yMax, xDataName, yDataName, innerWidth, innerHeight,
      frameTop, frameBottom, frameRight, frameLeft, horizontal], ...axisOptionArray);

    this._drawTitle(...[svg, width, height, marginLeft, marginTop, frameTop, frameLeft, title, titleFont, titleColor, titleX, titleY, titleRotate]);

    return id;

  }

}

export { Histogram }