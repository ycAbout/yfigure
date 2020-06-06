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
  `xTitle: ''` Sets the x axis title, override xDataName, use space string `' '` to remove it
  `yTitle: ''` Sets the y axis title, override yDataName, use space string `' '` to remove it
  `xAxisFont: '10px sans-serif'` Sets axis tick font
  `yAxisFont: '10px sans-serif'` Sets axis tick font
  `xTitleFont: '10px sans-serif'` Sets axis title font
  `yTitleFont: '10px sans-serif'` Sets axis title font
  `xTicks: null` Sets axis tick number  // approximate
  `yTicks: null` Sets axis tick number  // approximate
  `xTickSize: 6` ? Sets axis tick size, negative number changes direction
  `yTickSize: 6` ? Sets axis tick size, negative number changes direction
  `axisColor: ''` Sets axises (and ticks), labels, and titles color in one declaration, overrides individual settings.
  `xAxisColor: 'black'` Set individual color
  `yAxisColor: 'black'` Set individual color
  `xTitleColor: 'black'` Set individual color
  `yTitleColor: 'black'` Set individual color
  `xTickLabelColor: 'black'` Set individual color
  `yTickLabelColor: 'black'` Set individual color
  `axisStrokeWidth: 1` Sets axis (and ticks) line width in one declaration, overrides individual settings.
  `xAxisStrokeWidth: 1` Sets individual line width
  `yAxisStrokeWidth: 1` Sets individual line width
  `xTickStrokeWidth: 1` Sets individual line width
  `yTickStrokeWidth: 1` Sets individual line width

  `tickInward = []` Sets which axis tick inward orientation // possible values: `['top', 'bottom', 'left', 'right']`
  `tickLabelRemove: []` Sets which axis tick label removal // possible values: `['top', 'bottom', 'left', 'right']`
  `axisLongLineRemove: []` Sets which axis long line to removal // possible values: `['top', 'bottom', 'left', 'right']`
  `xTickLabelRotate: 0` Sets x axis tick label rotating // needs to between (-90 to 90)
  `xGridColor: ''` Sets the x grid line color
  `xGridDashArray: ''` Sets the x grid line properties  // example values `'4 1'`
  `xGridStrokeWidth: 0` Sets the x grid line properties, 0 no show, change to 1 to show
  `yGridColor: ''` Sets the x grid line color
  `yGridDashArray: ''` Sets the x grid line properties  // example values `'4 1'`
  `yGridStrokeWidth: 0` Sets the x grid line properties, 0 no show, change to 1 to show
  `line0: true` Sets whether line 0 (on x or y) will show if there is positive and negative data
  `line0Stroke: 'black'` Sets line0 properties
  `line0StrokeWidth: 1` Sets line0 properties
  `line0DashArray: ''` Sets line0 properties



