import * as d3 from 'd3';
import { BaseSimpleGroupAxis } from './baseClass.js';

/**
* A Bar class for a horizontal simple or grouped bar graph (y represents continuous value).
*/
class Bar extends BaseSimpleGroupAxis {
  /**
   * @param {array} data       A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
   * @param {object=} options  An optional object contains following key value pairs:
   *                              common option key values pairs
   *                              graph specific key value pairs:
   *                                scaleStart, only works for all positive or all negative data, works for simple bar, grouped bar, stacked bar.
   */
  constructor(data, options = {}) {
    super(data, options);

    //set up graph specific option
    (this._options.withinGroupPadding || parseInt(this._options.withinGroupPadding) === 0) ? true : this._options.withinGroupPadding = 0;
    this._options.stacked === true ? true : this._options.stacked = false;
    this._options.horizontal === true ? true : this._options.horizontal = false;

    (this._options.legendX || parseInt(this._options.legendX) === 0) ? true : options.legendX = 0.18;
    (this._options.legendY || parseInt(this._options.legendY) === 0) ? true : options.legendY = 0.12;
    this._options.legendWidth ? true : this._options.legendWidth = 600;
    this._options.legendFont ? true : this._options.legendFont = '10px sans-serif';
    this._options.scaleStart ? true : this._options.scaleStart = 0;
    this._options.legendOn === false ? true : this._options.legendOn = true;          // an option of omit legend when graphs are combined

    function makeError(msg) {
      throw new Error(msg)
    }

    //validate format
    if (typeof this._options.stacked !== 'boolean') { makeError('Option stacked need to be a boolean!') }
    if (typeof this._options.horizontal !== 'boolean') { makeError('Option horizontal need to be a boolean!') }
    if (typeof this._options.legendOn !== 'boolean') makeError('Option legendOn needs to be a boolean!');

    function validateNumStr(numStrToBe, errorString) {
      (typeof numStrToBe !== 'number' && typeof numStrToBe !== 'string') ? makeError(`Option ${errorString} needs to be a string or number!`) : true;
    }
    validateNumStr(this._options.legendX, 'legendX');
    validateNumStr(this._options.legendY, 'legendY');
    validateNumStr(this._options.legendWidth, 'legendWidth');
    validateNumStr(this._options.scaleStart, 'scaleStart');

    typeof this._options.legendFont !== 'string' ? makeError(`Option legendFont needs to be a string!`) : true;

    this._validate2dArray(this._data);
    this._draw= this._draw.bind(this);
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

    let scaleStart = parseFloat(options.scaleStart);

    let legendOn = options.legendOn;

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

    // to hold legend click status, the y data selection status
    let legendState = new Array(yDataNames.length).fill(1);

    let scaleSwitch = 0;  // for horizontal, to make sure swtich only once

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

      // for stacked bar chart
      let lastPositive = new Array(dataValue.length).fill(0);       // hold accumulated value for each y
      let lastNegative = new Array(dataValue.length).fill(0);
      // used to set accumulated scale
      let dataSumPostiveArray = [];       // to hold positve for each row
      let dataSumNegativeArray = [];
      for (let j = 0; j < dataValue.length; j++) {
        let sumPostive = 0;
        let sumNegative = 0;
        for (let k = 1; k < dataValue[j].length; k++) {
          if (yNamesSelected.length === 0) {
            if (dataValue[j][k] < 0) {
              sumNegative += dataValue[j][k];
            } else {
              sumPostive += dataValue[j][k];
            }
          } else if (legendState[k - 1]) {               // some data selected, only for selected data
            if (dataValue[j][k] < 0) {
              sumNegative += dataValue[j][k];
            } else {
              sumPostive += dataValue[j][k];
            }
          }
        }
        dataSumPostiveArray.push(sumPostive);
        dataSumNegativeArray.push(sumNegative);
      }

      let dataMaxSum = stacked ? Math.max(...dataSumPostiveArray) : 0;
      let dataMinSum = stacked ? Math.min(...dataSumNegativeArray) : 0;

      // make data plot approximately 10% range off the range
      let ySetback = Math.abs(dataMax <= 0 ? dataMin : (dataMin > 0 ? dataMax - scaleStart : dataMax - dataMin)) * (horizontal ? xPadding : yPadding);
      let ySetbackStack = (dataMaxSum - dataMinSum) * (horizontal ? xPadding : yPadding);

      // scaleStart only works for all postive or all negative data
      let baseNumber = (
        (dataMin > 0 && scaleStart <= dataMin && scaleStart > 0)
        || (dataMax < 0 && scaleStart >= dataMax && scaleStart < 0)
      ) ? scaleStart : 0;   // if all postive or all negative data, scaleStart works

      let baseNumberStack = (
        (dataMin > 0 && scaleStart <= minYArray[0] && scaleStart > 0)
        || (dataMax < 0 && scaleStart >= maxYArray[0] && scaleStart < 0)
      ) ? scaleStart : 0;   // if all postive or all negative data, scaleStart works

      // if there is negative data, set y min. Otherwise choose 0 as default y min
      let yMin = stacked ? (dataMin < 0 ? dataMinSum - ySetbackStack : Math.max(baseNumberStack, 0)) : (dataMin < 0 ? dataMin - ySetback : Math.max(baseNumber, 0));
      // when there is postive data, set y max. Otherwsie choose 0 as default y max
      let yMax = stacked ? (dataMax > 0 ? dataMaxSum + ySetbackStack : Math.min(baseNumberStack, 0)) : (dataMax <= 0 ? Math.min(baseNumber, 0) : dataMax + ySetback);

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

      let firstTime = 0;  // first bar draw indicator for stacked bar, used for stacked bar scale start

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
                  // change scale start scaleStart only works for the first bar
                  if (baseline === 0) {
                    return yScale(Math.min(element[i + 1], baseNumberStack));
                  } else {
                    return yScale(Math.min(baseline + element[i + 1], baseline));
                  }
                } else {
                  return yScale(Math.min(element[i + 1], baseNumber));
                }
              } else {
                return stacked ? xSubScale('stack') : xSubScale(yDataNames[i])
              }
            })
            .attr('width', (element, index) => {
              return (horizontal ? Math.abs(yScale(element[i + 1]) - yScale(stacked ? (firstTime === 0 ? baseNumberStack : 0) : baseNumber)) : xSubScale.bandwidth());
            })
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
                  // change scale start scaleStart only works for the first bar
                  if (baseline === 0) {
                    return yScale(Math.max(element[i + 1], baseNumberStack));
                  } else {
                    return yScale(Math.max(baseline + element[i + 1], baseline));
                  }
                } else {
                  return yScale(Math.max(element[i + 1], baseNumber));   // if negative, use y(start) as starting point
                }
              }
            })
            .attr('height', (element, index) => {
              return (horizontal ? xSubScale.bandwidth() : Math.abs(yScale(element[i + 1]) - yScale((stacked ? (firstTime === 0 ? baseNumberStack : 0) : baseNumber))));
            })  // height = distance to y(scaleStart) 
            .attr('fill', element => {
              if (yDataNames.length == 1) {
                return element[i + 1] > 0 ? colorScale(yDataNames[i]) : colors[1]       //only one y, positive vs. negative
              } else {
                return colorScale(yDataNames[i])              // two and more ys, no postive vs. negative
              }
            })
            .on('mouseover', function (element) {
              this.setAttribute("opacity", 0.6);
              let transformValue = this.getAttribute("transform");
              let text = element[xDataIndex] + ' : ' + element[i + 1];
              let proposed = content
                .append('text')
                .attr('font-size', '16px')
                .text(text);

              let proposedWidth = proposed.node().getBBox().width;
              let proposedHeight = proposed.node().getBBox().height;

              proposed.remove();

              let currentPosition = this.getBBox();
              let midX = currentPosition.x + currentPosition.width / 2;
              let x = midX - proposedWidth / 2;
              let y = element[i + 1] > 0 ? (currentPosition.y - 7) - proposedHeight : currentPosition.y + currentPosition.height + 7
              
              //over left right limit move
              let baseX = horizontal ? 0 : xScale(element[xDataIndex])
              let rightX = baseX + (midX + proposedWidth / 2);
              if (rightX > innerWidth) x -= rightX - innerWidth;
              let leftX = baseX + x;
              if (leftX < 0) x += -leftX;

              //over top bottom limit move
              let baseY = horizontal ? yScale(element[xDataIndex]) : 0;
              //top
              if (baseY + y < 0) y+= -(baseY + y) - 10;
              //bottom
              if (baseY + y + proposedHeight > innerHeight) y -=  (baseY + y + proposedHeight) - innerHeight -10;
         
              let datatip = content
                .append('g')
                .attr('id', 'yfDataPointDisplay999sky999sky999sky')
                .attr("transform", transformValue);

              datatip
                .append('rect')
                .attr('x', x)
                .attr('y', y)
                .attr('rx', 5)
                .attr('width', proposedWidth + 6)
                .attr('height', proposedHeight + 6)
                .attr('fill', '#EDF7F6');

              datatip
                .append('text')
                .attr('fill', 'black')
                .attr('font-size', '16px')
                .attr('text-anchor', 'start')
                .attr('dy', '1em')
                .attr('x', x + 3)
                .attr('y', y)
                .text(text)
            })
            .on('mouseout', function () {
              this.setAttribute("opacity", 1);
              d3.select('#yfDataPointDisplay999sky999sky999sky').remove();
            });

          firstTime = 1;
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
    if (yDataNames.length > 1 && legendOn) {

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
            this.setAttribute("opacity", Math.max(legendState[position], 0.8));
            if (this.getAttribute("text-decoration")) {
              this.removeAttribute("text-decoration");
            } else {
              this.setAttribute("text-decoration", 'line-through');
            }
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