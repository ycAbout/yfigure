import * as d3 from 'd3';
import { BaseSimpleGroupAxis } from './baseClass.js';

/**
 * A SortableBar class for a sortable bar graph (y represent continuous values).  
 */
class SortableBar extends BaseSimpleGroupAxis {
  /**
   * @param {array} data      A 2d array data in the format of `[['columnXName', 'columnYName'],['a', n1],['b', n2]]`.  
   * @param {object=} options An optional object contains following key value pairs:
   *                          common option key values pairs
   *                          graph specific key value pairs:
   *                             `barPadding: 0.1` Sets bar paddings between the bar, or bar group
   */
  constructor(data, options = {}) {
    super(data, options);

    //set up graph specific option
    this._options.horizontal === true ? true : this._options.horizontal = false;

    //validate format
    if (typeof this._options.horizontal !== 'boolean') { throw new Error('Option horizontal need to be a boolean!') }

    this._validate2dArray(this._data);
    this._draw= this._draw.bind(this);
    this._draw(this._data, this._options);
  }

  /**
   * This function draws a horizontal sortable bar graph (y represents continuous value) using d3 and svg.  
   * @return {string}         append a graph to html and returns the graph id.  
   */
  _draw(data, options) {

    let horizontal = options.horizontal;

    // set all the common options
    let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
      innerWidth, innerHeight, location, id, colors, backgroundColor, title, titleFont, titleColor, titleX, titleY, titleRotate] = this._getCommonOption(options);

    // set all the axis options
    let axisOptionArray = this._getAxisOption(options);

    // has to be after set axis options
    let xPadding = options.xPadding;
    let yPadding = options.yPadding;

    // take first column as x name label, second column as y name label, of the first object
    let xDataName = data[0][0];
    let yDataName = data[0][1];
    // x y data positions
    let xDataIndex = 0;
    let yDataIndex = 1;

    if (horizontal) {    // switch xScale and yScale to make axis
      let middleManName = xDataName;
      xDataName = yDataName;
      yDataName = middleManName;
    }

    // get ride of column name, does not modify origin array
    let dataValue = data.slice(1)

    let selection = d3.select(location)
      .append('span')       //non-block container
      .attr('style', `display:inline-block; width: ${width}px`)        //px need to be specified, otherwise not working
      .attr('id', id)
      .append('div')   // make it on top of figure
      .attr('style', `margin: ${marginTop}px 0 0 ${marginLeft}px`)        //px need to be specified, otherwise not working
      .text('Sort by: ')
      .append('select');

    selection.selectAll("option")
      .data(['default', 'descending', 'ascending'])
      .join("option")
      .attr("value", d => d)
      .text(d => d);

    let svg = d3.select('#' + id)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', backgroundColor)
      .append('g')
      .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

    // use arrow function to automatically bind this.
    const draw = (dataValue, svg, order) => {
      let innerData;
      switch (order) {
        case 'descending':
          // this creates a deep copy of data so the original data can be preserved
          innerData = JSON.parse(JSON.stringify(dataValue));
          innerData.sort((a, b) => b[yDataIndex] - a[yDataIndex]);
          break;
        case 'ascending':
          innerData = JSON.parse(JSON.stringify(dataValue));
          innerData.sort((a, b) => a[yDataIndex] - b[yDataIndex]);
          break;
        default:
          innerData = dataValue;
      }

      let dataMax = d3.max(innerData, element => element[yDataIndex]);
      let dataMin = d3.min(innerData, element => element[yDataIndex]);

      // make tallest bar approximately 10% range off the range
      let ySetback = (dataMax - dataMin) * (horizontal ? xPadding : yPadding);

      // if there is negative data, set y min. Otherwise choose 0 as default y min
      let yMin = (dataMin < 0 ? dataMin - ySetback : 0);
      // when there is postive data, set y max. Otherwsie choose 0 as default y max
      let yMax = (dataMax > 0 ? dataMax + ySetback : 0);

      //x and y scale inside function for purpose of update (general purpose, not necessary but no harm in this case)
      let xScale = d3.scaleBand()
        .domain(innerData.map((element) => element[xDataIndex]))
        .range([0, horizontal ? innerHeight : innerWidth])
        .padding((horizontal ? yPadding : xPadding));

      let yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range(horizontal ? [0, innerWidth] : [innerHeight, 0]);

      //draw graph, update works with select rect
      svg
        .selectAll('rect')
        .data(innerData)
        .join(
          enter => enter.append('rect'),
          update => update
        )
        .attr('x', element => horizontal ? yScale(Math.min(element[yDataIndex], 0)) : xScale(element[xDataIndex]))
        .attr('width', element => horizontal ? Math.abs(yScale(element[yDataIndex]) - yScale(0)) : xScale.bandwidth())
        .attr('y', element => horizontal ? xScale(element[xDataIndex]) : yScale(Math.max(element[yDataIndex], 0)))       // if negative, use y(0) as starting point
        .attr('height', element => horizontal ? xScale.bandwidth() : Math.abs(yScale(element[yDataIndex]) - yScale(0)))  // height = distance to y(0)
        .attr('fill', element => element[yDataIndex] > 0 ? colors[0] : colors[1])
        .on('mouseover', function (element) {
          this.setAttribute("opacity", 0.6);
          let transformValue = this.getAttribute("transform");
          let text = element[xDataIndex] + ' : ' + element[yDataIndex];
          let proposed = svg
            .append('text')
            .attr('font-size', '16px')
            .text(text);

          let proposedWidth = proposed.node().getBBox().width;
          let proposedHeight = proposed.node().getBBox().height;

          proposed.remove();

          let currentPosition = this.getBBox();
          let midX = currentPosition.x + currentPosition.width / 2;
          let x = midX - proposedWidth / 2;
          let y = element[yDataIndex] > 0 ? (currentPosition.y - 7) - proposedHeight : currentPosition.y + currentPosition.height + 7
          
          //over left right limit move
          let rightX = (midX + proposedWidth / 2);
          if (rightX > innerWidth) x -= rightX - innerWidth;
          if (x < 0) x += -x;

          //over top bottom limit move
          //top
          if (y < 0) y+= -y - 10;
          //bottom
          if (y + proposedHeight > innerHeight) y -=  (y + proposedHeight - innerHeight) -10;
          
          let datatip = svg
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
  
      // remove old content group if exist and draw a new one
      if (svg.select('#' + id + 'xyl999').node()) {
        svg.select('#' + id + 'xyl999').remove();
      }

      //set the axis group
      let axisGroup = svg
        .append('g')
        .attr('id', id + 'xyl999');
        
      if (horizontal) {    // switch xScale and yScale to make axis
        let middleMan = xScale;
        xScale = yScale;
        yScale = middleMan;
      }

      this._drawAxis(...[axisGroup, xScale, yScale, yMin, yMax, xDataName, yDataName, innerWidth, innerHeight,
        frameTop, frameBottom, frameRight, frameLeft, horizontal], ...axisOptionArray);

    }

    //initialize
    draw(dataValue, svg, 'default');

    this._drawTitle(...[svg, width, height, marginLeft, marginTop, frameTop, frameLeft, title, titleFont, titleColor, titleX, titleY, titleRotate]);

    // don't know why cannot use arrow function here
    selection
      .on('change', function () {
        draw(dataValue, svg, this.value)
      });

    return id;
  }
}

export { SortableBar }