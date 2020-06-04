common options:
  `width: 400`  Sets width of the svg
  `height: 300`  Sets height of the svg
  `margin: 25` Sets all the margin properties in one declaration, overrides individual margin settings.
  `marginLeft: 25` Sets inside margin
  `marginTop: 25` Sets inside margin
  `marginRight: 25` Sets inside margin
  `marginBottom: 25` Sets inside margin
  `frame: 25` Sets all the frame properties in one declaration, overrides individual frame settings. frame is to hold axises.
  `frameLeft: 25` Sets inside frame
  `frameTop: 25` Sets inside frame
  `frameRight: 25` Sets inside frame
  `frameBottom: 25` Sets inside frame
  `location: 'body'` Sets the html location where to put the graph   // for id, use `location: '#<ID>'`
  `id: 'graph123456'`.  Sets the id of graph

  axis options:
  `xAxisPosition: ['bottom']`  Sets axis location   // for none or both, e.g., `xAxisPosition = []`, `yAxisPosition = ['left', 'right']`
  `yAxisPosition: ['left']`  Sets axis location
  `xTitlePosition: ['bottom']` Sets axis title location
  `yTitlePosition: ['left']` Sets axis title location
  `xAxisFont: '10px sans-serif'` Sets axis tick font
  `yAxisFont: '10px sans-serif'` Sets axis tick font
  `xTitleFont: '10px sans-serif'` Sets axis title font
  `yTitleFont: '10px sans-serif'` Sets axis title font
  `xTicks = null` Sets axis tick number  // approximate
  `yTicks = null` Sets axis tick number  // approximate
  `axisLineWidth: 1` Sets axis (and ticks) line width
  `tickInward = []` Sets which axis tick inward orientation // possible values: `['top', 'bottom', 'left', 'right']`
  `tickLabelRemove: []` Sets which axis tick label removal // possible values: `['top', 'bottom', 'left', 'right']`
  `axisLongLineRemove: []` Sets which axis long line to removal // possible values: `['top', 'bottom', 'left', 'right']`
  `xTickLabelRotate: 0` Sets x axis tick label rotating // needs to between (-90 to 90)
  `gridColor: ''` Sets the grid line properties
  `gridDashArray: ''` Sets the grid line properties  // example values `'4 1'`
  `gridLineWidth: 0` Sets the grid line properties
  `line0: true` Sets whether line 0 will show if there is positive and negative data

