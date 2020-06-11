import * as d3 from 'd3';
import { BaseSimpleGroupAxis } from './baseClass.js';

//to do, each bar each color(maybe group bar with 1 group?), time series, 
//number values = 0, background multiple color, remove original, click legend grey out, figure legend default (horizontal), area, pie chart, commerical copyright, error bar, line hover, stack line, additional y

/**
* A Bar class for a horizontal simple or grouped bar graph (y represents continuous value).
*/
class Bar extends BaseSimpleGroupAxis {
  /**
   * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
   * @param {object=} options  An optional object contains following key value pairs:
   *                              common option key values pairs
   *                              graph specific key value pairs:
   */
  constructor(data, options = {}) {
    super(data, options);

    //set up graph specific option
    (this._options.withinGroupPadding || parseInt(this._options.withinGroupPadding) === 0) ? true : this._options.withinGroupPadding = 0;
    this._options.stacked === true ? true : this._options.stacked = false;
    this._options.horizontal === true ? true : this._options.horizontal = false;

    (this._options.legendX || parseInt(this._options.legendX) === 0) ? true : options.legendX = 0.18;
    (this._options.legendY || parseInt(this._options.legendY) === 0) ? true : options.legendY = 0.12;
    this._options.legendWidth ? true : options.legendWidth = 600;
    this._options.legendFont ? true : options.legendFont = '10px sans-serif';

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

    let legendX = Math.min(parseFloat(options.legendX), 0.98);
    let legendY = Math.min(parseFloat(options.legendY), 0.98);
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
    let [xDataName, xDataIndex, yDataNames, yDataName, dataValue] = this._setDataParameters(data);

    let svg = d3.select(location)
      .append('svg')
      .attr('id', id)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', backgroundColor)
      .append('g')
      .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

    //colors for difference lines
    let colorScale = d3.scaleOrdinal()
      .domain(yDataNames)
      .range(colors);

    // initialize legend position
    let legendx = legendX * width;
    let legendy = legendY * height;

    // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
    let dataPointDisplayId = this._setDataPoint();

    // to hold legend click status, the y data selection status
    let legendState = new Array(yDataNames.length).fill(1);

    let scaleSwitch = 0;   // for horizontal, to make sure swtich only once

    const drawModule = () => {

      let yNamesSelected = yDataNames.filter((name, index) => legendState[index] == 1);

      //get max and min data for each y columns
      let maxYArray = [];
      let minYArray = [];
      for (let j = 0; j < yDataNames.length; j++) {
        if (yNamesSelected.length === 0) {         // no data selected, normal
          maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
          minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
        } else if (legendState[j]) {               // some data selected, only for selected data
          maxYArray.push(d3.max(dataValue, d => +d[j + 1]));  //parse float
          minYArray.push(d3.min(dataValue, d => +d[j + 1]));  //parse float
        }
      }

      let dataMax = Math.max(d3.max(maxYArray), 0);
      let dataMin = Math.min(d3.min(minYArray), 0);

      // for stacked bar chart
      let lastPositive = new Array(dataValue.length).fill(0);       // hold accumulated value for each y
      let lastNegative = new Array(dataValue.length).fill(0);
      // used to set accumulated scale
      function sumArray(numberArray) {
        let sumNegative = 0;
        let sumPostive = 0;
        for (let i = 0; i < numberArray.length; i++) {
          if (numberArray[i] < 0) {
            sumNegative += numberArray[i];
          } else {
            sumPostive += numberArray[i];
          }
        }
        return [sumPostive, sumNegative];
      }
      let dataMaxSum = stacked ? sumArray(maxYArray)[0] : 0;
      let dataMinSum = stacked ? sumArray(minYArray)[1] : 0;

      // make data plot approximately 10% range off the range
      let ySetback = (dataMax - dataMin) * (horizontal ? xPadding : yPadding);
      let ySetbackStack = (dataMaxSum - dataMinSum) * (horizontal ? xPadding : yPadding);

      // if there is negative data, set y min. Otherwise choose 0 as default y min
      let yMin = stacked ? (dataMinSum < 0 ? dataMinSum - ySetbackStack : 0) : (dataMin < 0 ? dataMin - ySetback : 0);
      // when there is postive data, set y max. Otherwsie choose 0 as default y max
      let yMax = stacked ? (dataMaxSum > 0 ? dataMaxSum + ySetbackStack : 0) : (dataMax > 0 ? dataMax + ySetback : 0);

      let xScale = d3.scaleBand()
        .domain(dataValue.map((element) => element[xDataIndex]))
        .range([0, horizontal ? innerHeight : innerWidth])
        .padding((horizontal ? yPadding : xPadding));

      let xSubScale = d3.scaleBand()
        .domain(stacked ? ['stack'] : yNamesSelected)
        .range([0, xScale.bandwidth()])
        .padding(withinGroupPadding);

      let yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range(horizontal ? [0, innerWidth] : [innerHeight, 0]);

      // remove old content group if exist and draw a new one
      if (svg.select('#' + id + 'sky999all').node()) {
        svg.select('#' + id + 'sky999all').remove();
      }

      //set the bar group, assign svg to content because there need something on the same level to make remove then add work, don't know why
      let content = svg
        .append('g')
        .attr('id', id + 'sky999all');

      // draw each y data
      for (let i = 0; i < yDataNames.length; i++) {
        // if legend is unclicked
        if (legendState[i]) {
          content
            .append('g')
            .selectAll('rect')
            .data(dataValue)
            .join('rect')
            .attr("transform", element => horizontal ? `translate(0, ${xScale(element[xDataIndex])})` : `translate(${xScale(element[xDataIndex])}, 0)`)
            .attr('x', (element, index) => {
              if (horizontal) {   // horizontal bar chart
                if (stacked) {
                  let baseline = 0;
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
                return element[i + 1] > 0 ? colorScale(yDataNames[i]) : colors[1]       //only one y, positive vs. negative
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
        }
      }

      if (horizontal && !scaleSwitch) {    // switch xScale and yScale to make axis
        let middleMan = xScale;
        xScale = yScale;
        yScale = middleMan;

        middleMan = xDataName;
        xDataName = yDataName;
        yDataName = middleMan;

        scaleSwitch = 1;
      }

      //add the axis to content group
      content = content
        .append('g')
        .attr('id', id + 'xyl999');

      this._drawAxis(...[content, xScale, yScale, yMin, yMax, xDataName, yDataName, innerWidth, innerHeight,
        frameTop, frameBottom, frameRight, frameLeft, horizontal], ...axisOptionArray);
    }

    // first draw
    drawModule();

    // Add legend
    if (yDataNames.length > 1) {

      let legend = svg
        .append("g")
        .attr("transform", `translate(${-(frameLeft + marginLeft)}, ${-(frameTop + marginTop)})`);  // move to the beginning

      // draw each y legend
      for (let i = 0; i < yDataNames.length; i++) {

        let legendText = legend
          .append('text')
          .style('font', legendFont)
          .attr("transform", `translate(${legendx + 12}, ${legendy})`)
          .attr("dy", "0.8em")
          .attr('fill', colorScale(yDataNames[i]))
          .text(yDataNames[i])
          .attr("key", i)
          .on("click", function () {
            let position = parseInt(this.getAttribute('key'));
            legendState[position] = 1 - legendState[position];
            this.setAttribute("opacity", Math.max(legendState[position], 0.5));
            drawModule();
          });

        let textWidth = legendText.node().getBBox().width;
        let textHeight = legendText.node().getBBox().height;

        legend
          .append("rect")
          .attr("transform", `translate(${legendx}, ${legendy + (textHeight - 12) / 2})`)
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
            legendy += textHeight + 2;    // start a new line
            legendx = legendX * width;
          }
        }
      }
    }

    this._drawTitle(...[svg, width, height, marginLeft, marginTop, frameTop, frameLeft, title, titleFont, titleColor, titleX, titleY, titleRotate]);

    return id;
  }
}

export { Bar }