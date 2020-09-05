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
   */
  constructor(data, options = {}) {
    super(data, options);

    //set up graph specific option
    this._options.dotRadius ? true : this._options.dotRadius = 4;
    this._options.horizontal === true ? true : this._options.horizontal = false;

    (this._options.legendX || parseInt(this._options.legendX) === 0) ? true : this._options.legendX = 0.18;
    (this._options.legendY || parseInt(this._options.legendY) === 0) ? true : this._options.legendY = 0.12;
    this._options.legendWidth ? true : options.legendWidth = 600;
    this._options.legendFont ? true : options.legendFont = '10px sans-serif';
    this._options.lineStrokeWidth ? true : this._options.lineStrokeWidth = 2; 

    //validate format
    if (typeof this._options.horizontal !== 'boolean') { throw new Error('Option horizontal need to be a boolean!') }

    function validateNumStr(numStrToBe, errorString) {
      (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
    }
    validateNumStr(this._options.dotRadius, 'dotRadius');
    validateNumStr(this._options.legendX, 'legendX');
    validateNumStr(this._options.legendY, 'legendY');
    validateNumStr(this._options.legendWidth, 'legendWidth');
    validateNumStr(this._options.lineStrokeWidth, 'lineStrokeWidth');

    typeof this._options.legendFont !== 'string' ? makeError(`Option legendFont needs to be a string!`) : true;

    this._validate2dArray(this._data);
    this._draw(this._data, this._options);
  }

  /**
   * This function draws a single or multiple line with dot graph (y represents continuous value) using d3 and svg.  
   * @return {string}         append a graph to html and returns the graph id.  
   */
  _draw(data, options) {

    let dotRadius = options.dotRadius;
    let horizontal = options.horizontal;

    let legendX = Math.min(parseFloat(options.legendX), 0.98);
    let legendY = Math.min(parseFloat(options.legendY), 0.98);
    let lineStrokeWidth = parseFloat(options.lineStrokeWidth);
    let legendWidth = parseFloat(options.legendWidth);
    let legendFont = options.legendFont;

    // set all the common options
    let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
      innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

    // set all the axis options
    let axisOptionArray = this._getAxisOption(options);

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

      let dataMax = d3.max(maxYArray);
      let dataMin = d3.min(minYArray);

      // make highest number approximately 10% range off the range
      let ySetback = (dataMax - dataMin) * (horizontal ? xPadding : yPadding);  //10% of data range

      let yMin = dataMin - ySetback;
      let yMax = dataMax + ySetback;

      //scalePoint can use padding but not scaleOrdinal
      let xScale = d3.scalePoint()
        .domain(dataValue.map((element) => element[xDataIndex]))
        .range([0, horizontal ? innerHeight : innerWidth])
        .padding((horizontal ? yPadding : xPadding));

      let yScale = d3.scaleLinear()
        .domain([yMin, yMax])  // data points off axis
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
          // draw a line
          content
            .append("path")
            .datum(dataValue)
            .attr("fill", "none")
            .attr("stroke", colorScale(yDataNames[i]))
            .attr("stroke-width", lineStrokeWidth)
            .attr("d", d3.line()
              .x(element => horizontal ? yScale(element[i + 1]) : xScale(element[xDataIndex]))
              .y(element => horizontal ? xScale(element[xDataIndex]) : yScale(element[i + 1]))
            );

          // Add the points
          content
            .append("g")
            .selectAll("circle")
            .data(dataValue)
            .join("circle")
            .attr("cx", element => horizontal ? yScale(element[i + 1]) : xScale(element[xDataIndex]))
            .attr("cy", element => horizontal ? xScale(element[xDataIndex]) : yScale(element[i + 1]))
            .attr("r", dotRadius)
            .attr("fill", colorScale(yDataNames[i]))
            .on('mouseover', function (element) {
              let transformValue = this.getAttribute("transform");
              let currentPosition = this.getBBox()
              let x = currentPosition.x + currentPosition.width/2;
              let y = currentPosition.y - 7;
      
              content
                .append('text')
                .attr('id', 'yfDataPointDisplay999sky999sky999sky')
                .attr('fill', 'black')
                .attr('font-size', "1.2em")
                .attr('text-anchor','middle')
                .attr("transform", transformValue)
                .attr('x', x)
                .attr('y', y)
                .text(element[i + 1])
            })
            .on('mouseout', function () { d3.select('#yfDataPointDisplay999sky999sky999sky').remove(); });
        }
      }

      if (horizontal) {    // switch xScale and yScale to make axis
        let middleMan = xScale;
        xScale = yScale;
        yScale = middleMan;

        if (!scaleSwitch) {
          middleMan = xDataName;
          xDataName = yDataName;
          yDataName = middleMan;
          scaleSwitch = 1;
        }
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
          .attr("transform", `translate(${legendx + 24}, ${legendy})`)
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
          .append('path')
          .attr("stroke", colorScale(yDataNames[i]))
          .attr("stroke-width", 2)
          .attr("d", d3.line()([[legendx, legendy + 4 + (textHeight - 12) / 2], [legendx + 20, legendy + 4 + (textHeight - 12) / 2]]));

        let legendDotRadius = Math.min(dotRadius, 5);  // what if dotRadius too large

        legend
          .append("circle")
          .attr("transform", `translate(${legendx + 10}, ${legendy + 4 + (textHeight - 12) / 2})`)
          .attr("r", legendDotRadius)
          .attr("fill", colorScale(yDataNames[i]));

        // set up next legend x and y
        legendx += 24 + textWidth + 8;

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

export { LineDot }