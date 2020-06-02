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
   *                             `colors: ['steelblue', '#CC2529']` Sets color for positive or negative values, or colors for different y variables
   *                             `barPadding: 0.1` Sets bar paddings between the bar, or bar group
   */
  constructor(data, options = {}) {
    super(data, options);

    //set up graph specific option
    this._options.colors ? true : this._options.colors = ['steelblue', '#CC2529'];
    this._options.barPadding ? true : this._options.barPadding = 0.1;
    //validate format
    if (typeof this._options.colors !== 'object') { throw new Error('Option colors need to be an array object!') }
    if (typeof this._options.barPadding !== 'number') { throw new Error('Option barPadding need to be a number between 0 and 1!') }

    this._validate2dArray(this._data);
    this._draw(this._data, this._options);
  }

  /**
   * This function draws a horizontal sortable bar graph (y represents continuous value) using d3 and svg.  
   * @return {string}         append a graph to html and returns the graph id.  
   */
  _draw(data, options) {

    let colors = options.colors;
    let barPadding = options.barPadding;

    // set all the common options
    let [width, height, marginTop, marginLeft, marginBottom, marginRight, frameTop, frameLeft, frameBottom, frameRight,
      innerWidth, innerHeight, location, id] = this._getCommonOption(options);

    // set all the axis options
    let [xAxisPosition, yAxisPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont, 
      xTickLabelRotate, xTicks, yTicks, axisLineWidth, tickInward, tickLabelRemove, axisLongLineRemove] = this._getAxisOption(options);

    // take first column as x name label, second column as y name label, of the first object
    let xDataName = data[0][0];
    let yDataName = data[0][1];
    // x y data positions
    let xDataIndex = 0;
    let yDataIndex = 1;

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
      .append('g')
      .attr('transform', `translate(${marginLeft + frameLeft},${marginTop + frameTop})`);

    // set dataPointDisplay object for mouseover effect and get the ID for d3 selector
    let dataPointDisplayId = this._setDataPoint();
    
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
      let ySetback = (dataMax - dataMin) * 0.1;

      // if there is negative data, set y min. Otherwise choose 0 as default y min
      let yMin = (dataMin < 0 ? dataMin - ySetback : 0);
      // when there is postive data, set y max. Otherwsie choose 0 as default y max
      let yMax = (dataMax > 0 ? dataMax + ySetback : 0);

      //x and y scale inside function for purpose of update (general purpose, not necessary but no harm in this case)
      let xScale = d3.scaleBand()
        .domain(innerData.map((element) => element[xDataIndex]))
        .range([0, innerWidth])
        .padding(barPadding);

      let yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([innerHeight, 0]);

      //draw graph, update works with select rect
      svg
        .selectAll('rect')
        .data(innerData)
        .join(
          enter => enter.append('rect'),
          update => update
        )
        .attr('x', element => xScale(element[xDataIndex]))
        .attr('width', xScale.bandwidth())
        .attr('y', element => yScale(Math.max(element[yDataIndex], 0)))       // if negative, use y(0) as starting point
        .attr('height', element => Math.abs(yScale(element[yDataIndex]) - yScale(0)))  // height = distance to y(0)
        .attr('fill', element => element[yDataIndex] > 0 ? colors[0] : colors[1])
        .on('mouseover', (element) => {
          d3.select('#' + dataPointDisplayId)
            .style('display', null)
            .style('top', (d3.event.pageY - 20) + 'px')
            .style('left', (d3.event.pageX + 'px'))
            .text(element[xDataIndex] + ': ' + element[yDataIndex]);
        })
        .on('mousemove', (element) => {
          d3.select('#' + dataPointDisplayId)
            .style('display', null)
            .style('top', (d3.event.pageY - 20) + 'px')
            .style('left', (d3.event.pageX + 'px'))
            .text(element[xDataIndex] + ': ' + element[yDataIndex]);
        })
        .on('mouseout', () => d3.select('#' + dataPointDisplayId).style('display', 'none'));


      d3.select('#' + id + 'xyl999').remove()

      // set default x axis to top if y max is 0
      if (yMax == 0 && xTitlePosition.length == 1 && xTitlePosition[0] == 'bottom') xTitlePosition = ['top'];
      // set default x axisTitle to top if y max is 0
      if (yMax == 0 && xAxisPosition.length == 1 && xAxisPosition[0] == 'bottom') xAxisPosition = ['top'];

      //set the axis group
      svg = svg
        .append('g')
        .attr('id', id + 'xyl999')

      this._drawAxis(...[svg, xScale, yScale, innerWidth, innerHeight, frameTop, frameBottom, frameRight, frameLeft, xDataName, yDataName, 
        xAxisPosition, yAxisPosition, xTitlePosition, yTitlePosition, xAxisFont, yAxisFont, xTitleFont, yTitleFont, xTickLabelRotate, 
        xTicks, yTicks, axisLineWidth, tickInward, tickLabelRemove, axisLongLineRemove]);

      // add line at y = 0 when there is negative data
      if (yMin != 0 && yMax != 0) {
        svg.append("path")
          .attr("stroke", 'black')
          .attr("d", d3.line()([[0, yScale(0)], [innerWidth, yScale(0)]]))
      }

    }

    //initialize
    draw(dataValue, svg, 'default');

    selection
      .on('change', function () {
        draw(dataValue, svg, this.value)
      });

    return id;
  }
}

export { SortableBar }