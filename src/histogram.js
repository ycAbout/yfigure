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
   *                            nBins, describing how many bins to put the data in the format of `nBins: 70`.  
   *                            color, describing the colors used for bars in the format of `color: 'steelblue'`.  
   */
  constructor(data, options = {}) {
    super(data, options);
    //set up graph specific option
    this._options.nBins ? true : this._options.nBins = 50;
    this._options.color ? true : this._options.color = 'steelblue';

    //validate format
    if (typeof this._options.nBins !== 'number') { throw new Error('Option nBins need to be an array object!') }
    if (typeof this._options.color !== 'string') { throw new Error('Option color need to be a string!') }

    this._validate2dArray(this._data);
  }

  /**
 * @return {string}          append a graph to html and returns the graph id.  
 */
  plot() {

    // set all the common options
    let [width, height, top, left, bottom, right, innerWidth, innerHeight, location, id] = this._getCommonOption(this._options);

    // set all the axis options
    let [xPosition, yPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont] = this._getAxisOption(this._options);

    let nBins = this._options.nBins;
    let color = this._options.color;

    let xDataName = this._data[0][0];
    let xDataIndex = 0;
    let yDataName = 'Frequency';

    // get ride of column name, does not modify origin array
    let dataValue = this._data.slice(1)

    let dataMax = d3.max(dataValue, d => d[xDataIndex]);
    let dataMin = d3.min(dataValue, d => d[xDataIndex]);

    let svg = d3.select(location)
      .append('svg')
      .attr('id', id)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${left},${top})`);

    // X axis scale
    let xScale = d3.scaleLinear()
      .domain([dataMin, dataMax])
      .range([0, innerWidth]);

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
      .range([innerHeight, 0])
      .domain([0, d3.max(bins, d => d.length * 1.1)]);

    // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
    let dataPointDisplayId = this._setDataPoint();

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
      .attr("height", d => innerHeight - yScale(d.length))
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

    //x axis
    for (let i = 0; i < Math.min(xPosition.length, 2); i++) {
      svg
        .append('g')
        .style("font", xAxisFont)
        .attr('transform', `translate(0, ${xPosition[i] == 'top' ? 0 : innerHeight})`)
        .call(xPosition[i] == 'top' ? d3.axisTop(xScale) : d3.axisBottom(xScale));
    }

    //x axis title
    for (let i = 0; i < Math.min(xTitlePosition.length, 2); i++) {
      svg
        .append("text")
        .style('font', xTitleFont)
        .attr("text-anchor", "middle")  // transform is applied to the middle anchor
        .attr("transform", `translate(${innerWidth / 2}, ${xTitlePosition[i] == 'top' ? -top / 4 * 3 : innerHeight + bottom / 4 * 3})`)  // centre at margin bottom/top 1/4
        .text(xDataName);
    }

    //y axis
    for (let i = 0; i < Math.min(yPosition.length, 2); i++) {
      svg
        .append('g')
        .style("font", yAxisFont)
        .attr('transform', `translate(${yPosition[i] == 'right' ? innerWidth : 0}, 0)`)
        .call(yPosition[i] == 'right' ? d3.axisRight(yScale) : d3.axisLeft(yScale));
    }

    //y axis title
    for (let i = 0; i < Math.min(yTitlePosition.length, 2); i++) {
      svg
        .append("text")
        .style('font', yTitleFont)
        .attr("text-anchor", "middle")  // transform is applied to the middle anchor
        .attr("transform", `translate(${yTitlePosition[i] == 'right' ? innerWidth + right / 4 * 3 : -left / 4 * 3}, ${innerHeight / 2}) rotate(270)`)  // centre at margin left/right 1/4
        .text(yDataName);
    }

    return id;

  }

}

export { Histogram }