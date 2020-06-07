import * as d3 from 'd3';
import { BaseSimpleGroupAxis } from './baseClass.js';

//to do, each bar each color(maybe group bar with 1 group?), 
//number value = 0, background multiple color, figure legend(horizontal), area, pie chart, commerical copyright, error bar, line hover, stack line, additional y


/**
* A Bar class for a horizontal simple or grouped bar graph (y represents continuous value).
*/
class Bar extends BaseSimpleGroupAxis {
  /**
   * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
   * @param {object=} options  An optional object contains following key value pairs:
   *                              common option key values pairs
   *                              graph specific key value pairs:
   *                                `colors: ['steelblue', '#CC2529']` Sets color for positive or negative values, or colors for different y variables
   */
  constructor(data, options = {}) {
    super(data, options);

    //set up graph specific option
    this._options.withinGroupPadding ? true : this._options.withinGroupPadding = 0.001;
    this._options.stacked === true ? true : this._options.stacked = false;
    this._options.horizontal === true ? true : this._options.horizontal = false;

    this._options.legendX ? true: options.legendX = 0.18;
    this._options.legendY ? true: options.legendY = 0.18;
    this._options.legendWidth ? true: options.legendWidth = 600;
    this._options.legendFont ? true: options.legendFont = '10px sans-serif';

    //validate format
    if (typeof this._options.stacked !== 'boolean') { throw new Error('Option stacked need to be a boolean!') }
    if (typeof this._options.horizontal !== 'boolean') { throw new Error('Option horizontal need to be a boolean!') }

    function validateNumStr(numStrToBe, errorString) {
      (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
    }
    validateNumStr(options.legendX, 'legendX');
    validateNumStr(options.legendY, 'legendY');
    validateNumStr(options.legendWidth, 'legendWidth');

    typeof options.legendFont !== 'string' ? makeError(`Option legendFont needs to be a string!`) : true;


    this._validate2dArray(this._data);
    this._draw(this._data, this._options);
  }

  /**
* This function draws a horizontal bar graph (y represents continuous value) using d3 and svg.  
* @return {string}         append a graph to html and returns the graph id.  
*/
  _draw(data, options) {

    let withinGroupPadding = options.withinGroupPadding
    let stacked = options.stacked;
    let horizontal = options.horizontal;

    let legendX = parseFloat(options.legendX);
    let legendY = parseFloat(options.legendY);
    let legendWidth = parseFloat(options.legendWidth);
    let legendFont = options.legendFont;

    // set all the common options
    let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
      innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

    // set all the axis options
    let axisOptionArray = this._getAxisOption(options);

    // has to be after set axis options
    let xPadding = options.xPadding;
    let yPadding = options.yPadding;

    // set data parameters
    let [xDataName, xDataIndex, yDataNames, yDataName, dataValue, dataMax, dataMin, dataMaxSum, dataMinSum] = this._setDataParameters(data);

    // make data plot approximately 10% range off the range
    let ySetback = (dataMax - dataMin) * (horizontal ? xPadding : yPadding);

    let ySetbackStack = (dataMaxSum - dataMinSum) * (horizontal ? xPadding : yPadding);

    // if there is negative data, set y min. Otherwise choose 0 as default y min
    let yMin = stacked ? (dataMinSum < 0 ? dataMinSum - ySetbackStack : 0) : (dataMin < 0 ? dataMin - ySetback : 0);
    // when there is postive data, set y max. Otherwsie choose 0 as default y max
    let yMax = stacked ? (dataMaxSum > 0 ? dataMaxSum + ySetbackStack : 0) : (dataMax > 0 ? dataMax + ySetback : 0);

    let svg = d3.select(location)
      .append('svg')
      .attr('id', id)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', backgroundColor)
      .append('g')
      .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

    let xScale = d3.scaleBand()
      .domain(dataValue.map((element) => element[xDataIndex]))
      .range([0, horizontal ? innerHeight : innerWidth])
      .padding((horizontal ? yPadding : xPadding));

    let xSubScale = d3.scaleBand()
      .domain(stacked ? ['stack'] : yDataNames)
      .range([0, xScale.bandwidth()])
      .padding(withinGroupPadding);

    let yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range(horizontal ? [0, innerWidth] : [innerHeight, 0]);

    //colors for difference lines
    let colorScale = d3.scaleOrdinal()
      .domain(yDataNames)
      .range(colors);

    // initialize legend position
    let legendx = legendX * width;
    let legendy = legendY * height;

    // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
    let dataPointDisplayId = this._setDataPoint();

    let lastPositive = [];
    let lastNegative = [];
    lastPositive.length = lastNegative.length = dataValue.length;
    lastPositive.fill(0);
    lastNegative.fill(0);

    // draw each y data
    for (let i = 0; i < yDataNames.length; i++) {

      svg
        .append('g')
        .selectAll('rect')
        .data(dataValue)
        .join('rect')
        .attr("transform", element => horizontal ? `translate(0, ${xScale(element[xDataIndex])})` : `translate(${xScale(element[xDataIndex])}, 0)`)
        .attr('x', (element, index) => {
          if (horizontal) {   // horizontal bar chart
            if (stacked) {
              let baseline;
              if (element[i + 1] >= 0) {
                baseline = lastPositive[index];
                lastPositive[index] += element[i + 1];    //update
              } else {
                baseline = lastNegative[index];
                lastNegative[index] += element[i + 1];
              }
              return yScale(Math.min(baseline + element[i + 1], baseline));
            } else {
              return yScale(Math.min(element[i + 1], 0))
            }
          } else {
            return stacked ? xSubScale('stack') : xSubScale(yDataNames[i])
          }
        })
        .attr('width', element => horizontal ? Math.abs(yScale(element[i + 1]) - yScale(0)) : xSubScale.bandwidth())
        .attr('y', (element, index) => {
          if (horizontal) {   // horizontal bar chart
            return stacked ? xSubScale('stack') : xSubScale(yDataNames[i])
          } else {
            if (stacked) {
              let baseline;
              if (element[i + 1] >= 0) {
                baseline = lastPositive[index];
                lastPositive[index] += element[i + 1];    //update
              } else {
                baseline = lastNegative[index];
                lastNegative[index] += element[i + 1];
              }
              return yScale(Math.max(baseline + element[i + 1], baseline));
            } else {
              return yScale(Math.max(element[i + 1], 0))   // if negative, use y(0) as starting point
            }
          }
        })
        .attr('height', element => horizontal ? xSubScale.bandwidth() : Math.abs(yScale(element[i + 1]) - yScale(0)))  // height = distance to y(0) 
        .attr('fill', element => {
          if (yDataNames.length == 1) {
            return element[i + 1] > 0 ? colors[0] : colors[1]       //only one y, positive vs. negative
          } else {
            return colorScale(yDataNames[i])              // two and more ys, no postive vs. negative
          }
        })
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

      // Add legend
      if (yDataNames.length > 1) {
        let legend = svg
          .append("g")
          .attr("transform", `translate(${-(frameLeft + marginLeft)}, ${-(frameTop + marginTop)})`);  // move to the beginning

        let legendText = legend
          .append('text')
          .style('font', legendFont)
          .attr("transform", `translate(${legendx + 12}, ${legendy})`)
          .attr("dy", "0.8em")
          .attr('fill', colorScale(yDataNames[i]))
          .text(yDataNames[i]);

        let textWidth = legendText.node().getBBox().width;
        let textHeight = legendText.node().getBBox().height;

        legend
          .append("rect")
          .attr("transform", `translate(${legendx}, ${legendy + (textHeight-12)/2})`)
          .attr("width", 8)
          .attr("height", 8)
          .attr("fill", colorScale(yDataNames[i]));

        // set up next legend x and y
        legendx += 12 + textWidth + 8;

        // if there is another
        if (i + 1 < yDataNames.length) {
          //test bbox for next one
          let nextLegendText = legend
            .append('text')
            .text(yDataNames[i + 1]);
          let nextTextWidth = nextLegendText.node().getBBox().width;
          nextLegendText.remove();

          // if add next legend spill over innerWidth
          if (legendx + 12 + nextTextWidth > Math.min(legendX * width + legendWidth, width)) {
            legendy += textHeight;    // start a new line
            legendx = legendX * width;
          }
        }
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

export { Bar }