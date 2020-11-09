Copyright 2020 Yalin Chen  
yc.about@gmail.com   

## Why
There are plenty figure libraries, but yfigure aims to provide an easier to use but very powerful and flexible tool to draw a figure in html.

## How to use
1. Add the YFigure library to your html:  
`<script src='` ****`<yourpath>`/yfigure.js**** `'></script>`  

2. Use it as normal javascript (write anywhere below 1.):  
E.g., Add a figure to the html body
 ```
<script>
let dataBar = [["group", "score"], [1, 50], [2, 80], [3, -30], [4, -80], [5, 40]];
  
let bar1 = new yf.Bar(dataBar, {//key:value options});
</script>
  ```

3. To add to a speicific location:  
3a. Add to your html file:  
`<div id='awesomeYFigure1'></div>`  
3b. Add a figure to that location  
```
<script>
let tech = [['Quarter', 'MSFT', 'APPL', 'AMZN'], ['1st', 91, 84, 88],['2nd', 103, 91, 93], ['3rd', 106, 101, 86], ['4th', 120, 131, 92]]
  
let groupBar = new yf.Bar(tech, {location: '#awesomeYFigure1'});
</script>
```

## Classes API
### yf.Bar(data, options = {})
* @param [[2d array]] data    
    A 2d array in the format of `[[column1Name, column2Name],[Row1Column1Value, Row1Column2Value],[Row2Column1Value, Row2Column2Value]...]`.  
    Column1 is the category name of the data, column2 is the value.  
    E.g.: `[["group", "score"], [1, 50], [2, 80], [3, -30], [4, -80]]`
* @param {object=} options 
    An optional object contains all figure options in the format of key value pairs `{ option1Name: option1Value, option2Name: option2Value, ...}`.  
    E.g. `{width:'400', height: '300'}`  

#### Grouped Bar
* simply include more than two columns in data.  
E.g.,
```
let techData = [['Quarter', 'MSFT', 'APPL', 'AMZN'], ['1st', 91, 84, 88],['2nd', 103, 91, 93], ['3rd', 106, 101, 86], ['4th', 120, 131, 92]]
```
##### Example
```
```
#### Simple Bar
* simply include only two columns in data.  
E.g.,
```
let techData = [['Quarter', 'APPL'], ['1st', 84],['2nd', 91], ['3rd', 101], ['4th', 131]]
```
##### Example
```
```

#### Stacked Bar
* simply include `stacked: true` in options.
##### Example
```
```

#### Horizontal Bar
* simply include `horizontal: true` in options.
##### Example
```
```
### yf.SortableBar(data, options = {})
* the same as the simple bar, but is sortable.
##### Example
```
```

### yf.Histogram(data, options = {})
* @param [[2d array]] data    
    A 2d array in the format of `[[column1Name],[Row1Column1Value],[Row2Column1Value]...]`.  
    Column1 is value of the data
* @param {object=} options  
    same as bar.
##### Example
```
```

### yf.LineDot(data, options = {})
* @param [[2d array]] data    
    same as bar.
* @param {object=} options 
    same as bar.   

#### Line Dot
* by default.
##### Example
```
```
#### Line
* simply include `dotRadius: 1` or a half of `lineStrokeWidth` in options.
##### Example
```
```

### yf.Scatter(data, options = {})
* @param [[2d array]] data    
    same as bar, except first column is numeric.  
* @param {object=} options 
    same as bar.   
##### Example
```
```

## Common options:
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
  `colors:['#396AB1', '#CC2529', '#DA7C30', '#3E9651', '#535154', '#6B4C9A', '#922428', '#948B3D']` Sets colors  
  `backgroundColor: ''` Sets the background color of the figure  
  `title: ''` Sets figure title  
  `titleFont: '20px sans-serif'` Sets figure title properties  
  `titleColor: 'black'` Sets figure title properties  
  `titleX: 0.5` Sets figure title  properties  // 0 - 1 from left to right  
  `titleY: 0` Sets figure title  properties  // 0 - 1  from top to bottom  
  `titleRotate: 0` Sets figure title properties // needs to between (-45 to 45)  
  
  ## axis options:  
  `xAxisPosition: ['bottom']`  Sets axis location   // for none or both, e.g., `xAxisPosition: []`, `xAxisPosition: ['left',   'right']`  
  `yAxisPosition: ['left']`  Sets axis location    // for none or both, e.g., `yAxisPosition: []`, `yAxisPosition: ['left',   'right']`  
  `xTitlePosition: ['bottom']` Sets axis title location    // for none or both, e.g., `xTitlePosition: []`, `xTitlePosition:   ['left', 'right']`  
  `yTitlePosition: ['left']` Sets axis title location    // for none or both, e.g., `yTitlePosition: []`, `yTitlePosition:   ['left', 'right']`  
  `xTitle: ''` Sets the x axis title, override xDataName, use space string `' '` to remove it  
  `yTitle: ''` Sets the y axis title, override yDataName, use space string `' '` to remove it  
  `xPadding: 0.1` Sets the x data padding on axis  
  `yPadding: 0.1` Sets the y data padding on axis  
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
  `tickLabelHide: []` Sets which axis tick label to hide // example values: `['top 0 2 4', 'bottom 1 3 5', 'left 0 2 4', 'right 1 3 5']`  
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
  `line0StrokeWidth: 1` Sets line0 properties   // 0 also no show  
  `line0DashArray: ''` Sets line0 properties