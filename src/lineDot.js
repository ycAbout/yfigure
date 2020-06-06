import * as d3 from 'd3';
import { BaseSimpleGroupAxis } from './baseClass.js';

/**
 * A LineDot class for a line with dot graph (y represents continuous value).  
 */
class LineDot extends BaseSimpleGroupAxis {
  /**
   * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnY1Name', 'columnY2Name'],['a', n1, n2],['b', n3, n4]]`.  
   * @param {object=} options An optional object contains following key value pairs:
   *                          common option key values pairs
   *                          graph specific key value pairs:
   *                            `dotRadius: 4` Sets the radius of the dot, value `1` produce a line graph.
   *                            `colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']`. Sets the colors for difference lines
   */
  constructor(data, options = {}) {
    super(data, options);

    //set up graph specific option
    this._options.colors ? true : this._options.colors = ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'];
    this._options.dotRadius ? true : this._options.dotRadius = 4;
    this._options.horizontal === true ? true : this._options.horizontal = false;

    //validate format
    if (typeof this._options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }
    if (typeof this._options.dotRadius !== 'number') { throw new Error('Option dotRadius need to be a number!') }
    if (typeof this._options.horizontal !== 'boolean') { throw new Error('Option horizontal need to be a boolean!') }

    this._validate2dArray(this._data);
    this._draw(this._data, this._options);
  }

  /**
   * This function draws a single or multiple line with dot graph (y represents continuous value) using d3 and svg.  
   * @return {string}         append a graph to html and returns the graph id.  
   */
  _draw(data, options) {

    let colors = options.colors;
    let dotRadius = options.dotRadius;
    let linePadding = options.linePadding;
    let horizontal = options.horizontal;

    // set all the common options
    let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
      innerWidth, innerHeight, location, id, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

    // set all the axis options
    let axisOptionArray = this._getAxisOption(options);

    let xPadding = options.xPadding;
    let yPadding = options.yPadding;

    // set data parameters
    let [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin] = this._setDataParameters(data);

    // make highest number approximately 10% range off the range
    let ySetback = (dataMax - dataMin) * (horizontal ? xPadding : yPadding);  //10% of data range

    let yMin = dataMin - ySetback;
    let yMax = dataMax + ySetback;

    let svg = d3.select(location)
      .append('svg')
      .attr('id', id)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

    //scalePoint can use padding but not scaleOrdinal
    let xScale = d3.scalePoint()
      .domain(dataValue.map((element) => element[xDataIndex]))
      .range([0, horizontal ? innerHeight : innerWidth])
      .padding((horizontal ? yPadding : xPadding));

    let yScale = d3.scaleLinear()
      .domain([yMin, yMax])  // data points off axis
      .range(horizontal ? [0, innerWidth] : [innerHeight, 0]);


    //colors for difference lines
    let colorScale = d3.scaleOrdinal()
      .domain(yDataNames)
      .range(colors);

    // initialize legend position
    let legendx = 8;
    let legendy = 8;

    // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
    let dataPointDisplayId = this._setDataPoint();

    // draw each y data
    for (let i = 0; i < yDataNames.length; i++) {
      // draw a line
      svg.append("path")
        .datum(dataValue)
        .attr("fill", "none")
        .attr("stroke", colorScale(yDataNames[i]))
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(element => horizontal ? yScale(element[i + 1]) : xScale(element[xDataIndex]))
          .y(element => horizontal ? xScale(element[xDataIndex]) : yScale(element[i + 1]))
        );

      // Add the points
      svg
        .append("g")
        .selectAll("circle")
        .data(dataValue)
        .join("circle")
        .attr("cx", element => horizontal ? yScale(element[i + 1]) : xScale(element[xDataIndex]))
        .attr("cy", element => horizontal ? xScale(element[xDataIndex]) : yScale(element[i + 1]))
        .attr("r", dotRadius)
        .attr("fill", colorScale(yDataNames[i]))
        .on('mouseover', (element) => {
          d3.select('#' + dataPointDisplayId)
            .style('display', null)
            .style('top', (d3.event.pageY - 20) + 'px')
            .style('left', (d3.event.pageX + 'px'))
            .text(element[xDataIndex] + ': ' + element[i + 1]);
        })
        .on('mousemove', (element) => {
          d3.select('#' + dataPointDisplayId)
            .style('display', null)
            .style('top', (d3.event.pageY - 20) + 'px')
            .style('left', (d3.event.pageX + 'px'))
            .text(element[xDataIndex] + ': ' + element[i + 1]);
        })
        .on('mouseout', () => d3.select('#' + dataPointDisplayId).style('display', 'none'));

      if (yDataNames.length > 1) {
        // Add legend
        // if add current legend spill over innerWidth
        if (legendx + yDataNames[i].length * 8 + 24 > innerWidth) {
          legendy += 16;    // start a new line
          legendx = 8;
        }

        svg
          .append('path')
          .attr("stroke", colorScale(yDataNames[i]))
          .attr("stroke-width", 2)
          .attr("d", d3.line()([[legendx, legendy], [legendx + 20, legendy]]));

        svg
          .append("circle")
          .attr("cx", legendx + 10)
          .attr("cy", legendy)
          .attr("r", 3)
          .attr("fill", colorScale(yDataNames[i]));

        svg
          .append('text')
          .attr("alignment-baseline", "middle")  // transform is applied to the middle anchor
          .attr("transform", "translate(" + (legendx + 24) + "," + legendy + ")")  // evenly across inner width, at margin top 2/3
          .attr('fill', colorScale(yDataNames[i]))
          .text(yDataNames[i]);

        // set up next legend x and y
        legendx += yDataNames[i].length * 8 + 32;
      }
    }

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

export { LineDot }