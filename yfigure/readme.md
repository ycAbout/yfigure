# yfigure, an easy to use data visualization javascript library. 
# Don't waste time, use yfigure.
### @author Yalin Chen yc.about@gmail.com   
Copyright 2020 Yalin Chen

## Why
There are plenty figure libraries, but yfigure aims to provide the simplest but very powerful and flexible way to draw a figure.

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
note: This library packed part of d3v5 (Copyright 2020 Mike Bostock) into it.


## Functions API
### bar(data, options = {})
This function draws a horizontal bar graph (y represents continuous value) using d3 and svg.  
* @param {object} data    
    A data object array in the format of `[{ columnX: 'a', columnY: n1 },{columnX: 'b', columnY: n2 }]`.  
* @param {object=} options 
    An optional object contains following objects.   
    size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
    margin, describing the margin inside the svg in the format of `margin: { left: 40, top: 40, right: 40, bottom: 40 }`.  
    location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
    colors, describing the colors used for positive bars and negative bars in the format of `colors: ['steelblue', '#CC2529']`.  
* @return {} append a bar graph to html.  
* Automatcially handles negative data, plot downwards with a y = 0 grid.  

#### Example
```
let data = [{ "group": 1, "score": 50 }, { "group": 2, "score": 80 }, { "group": 3, "score": 30 }, { "group": 4, "score": 80 }, { "group": 5, "score": 40 }];

//example 1
yf.bar(data);

//example 2
let data2 =[{ "group": 1, "score": 50 }, { "group": 2, "score": 80 }, { "group": 3, "score": -30 }, { "group": 4, "score": -80 }, { "group": 5, "score": 40 }];
yf.bar(data2, {
  size: { width: 350, height: 300 },
});

//example 3
yf.bar(data2, {
  size: { width: 350, height: 300 },
  margin: { left: 40, top: 20, right: 60, bottom: 40 },
  location: 'body',
  colors: ['steelblue', '#CC2529']
});
```
![bar](readmePic/bar.png)


### sortableBar(data, options = {})
This function draws a horizontal sortable bar graph (y represents continuous value) using d3 and svg.
* @param {object} data     
    A data object array in the format of `e.g., [{columnX: 'a', columnY: n1 },{columnX: 'b', columnY: n2 }]`.  
* @param {object=} options 
    An optional object contains following objects. 
    size, describing the svg size in the format of `size: { width: 400, height: 300 }. `
    margin, describing the margin inside the svg in the format of `margin: { left: 40, top: 40, right: 40, bottom: 40 }`.  
    location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
    colors, describing the colors used for positive bars and negative bars in the format of `colors: ['steelblue', '#CC2529']`.  
* @return {} append a sortable bar graph to html.

#### Example
```
let data = [{ "group": 1, "score": 50 }, { "group": 2, "score": 80 }, { "group": 3, "score": 30 }, { "group": 4, "score": 80 }, { "group": 5, "score": 40 }];

//example 1
yf.sortableBar(data);

//example 2
let data2 =[{ "group": 1, "score": 50 }, { "group": 2, "score": 80 }, { "group": 3, "score": -30 }, { "group": 4, "score": -80 }, { "group": 5, "score": 40 }];
yf.sortableBar(data2, {
  size: { width: 350, height: 300 },
});

//example 3
yf.sortableBar(data2, {
  size: { width: 350, height: 300 },
  margin: { left: 40, top: 20, right: 60, bottom: 40 },
  location: 'body',
  colors: ['steelblue', '#CC2529']
});
```
![sortableBar](readmePic/sortableBar.png)


### histogram(data, options = {})  
This function draws a histogram graph (y represents frequency) using d3 and svg.
* @param {object} data     
    A data object array in the format of `[{ columnX: n1 },{columnX: n2 }]`.  
* @param {object=} options 
    An optional object contains four objects.
    size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
    margin, describing the margin inside the svg in the format of `margin: { left: 50, top: 20, right: 20, bottom: 50 }`.  
    location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
    nBins, describing how many bins to put the data in the format of `nBins: 70`.  
* @return {} append a graph to html.

#### Example
```
//generate a sudo normal distributed dataset
let data = [];
for (let i = 0; i < 900; i++) {
  let element = {
    "age": (Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 5
  }
  data.push(element)
}

// example 1  
yf.histogram(data);

// example 2 
yf.histogram(data, {
    size: { width: 350, height: 300 }, 
    nBins: 30
});

// example 3 
yf.histogram(data, {
    size: { width: 350, height: 300 }, 
    margin: { left: 40, top: 80, right: 40, bottom: 40 }, 
    location: 'body',
    nBins: 30
});
```  
![histogram](readmePic/histogram.png)


### lineDot(data, options = {})
This function draws a line with dot graph (y represents continuous value) using d3 and svg.
* @param {object} data     
    A data object array in the format of `[{columnX: 'a', columnY: n1 },{columnX: 'b', columnY: n2}]`.  
* @param {object=} options  
    An optional object contains following objects.  
    size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
    margin, describing the margin inside the svg in the format of `margin: { left: 50, 80, right: 20, bottom: 50 }`.  
    location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
    dotRadius, dot radius describing the radius of the dot in the format of `dotRadius: 4`.   
    colors: describing the colors used for difference lines in the format of `colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']`.  
* @return {} append a graph to html.  

#### Example
```
let data = [{ "group": 1, "score": 50 }, { "group": 2, "score": 80 }, { "group": 3, "score": 30 },{ "group": 4, "score": 40 }, { "group": 5, "score": 20 }];

// example 1  
yf.lineDot(data, { dotRadius: 1 });

// example 2 
yf.lineDot(data, {
    size: { width: 350, height: 300 }, 
});

// example 3 
    data2 = [];
    for (i = 0; i < 18; i++) {
      let element = {
        "age": i+18,
        "score1": Math.floor(Math.random() * 100),
        "score2": Math.floor(Math.random() * 100 + 200),
        "score3": Math.floor(Math.random() * 100 + 400),
        "score4": Math.floor(Math.random() * 100 + 600),
        "score5": Math.floor(Math.random() * 100 + 800),
        "score6": Math.floor(Math.random() * 100 + 1000),
      }
      data2.push(element)
    }

yf.lineDot(data2, {
    size: { width: 350, height: 300 }, 
    margin: { left: 40, top: 80, right: 40, bottom: 40 }, 
    location: 'body',
    dotRadius: 4,
    colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']
});
```
![lineDot](readmePic/lineDot.png)
 

### scatter(data, options = {}) 
This function draws a scatter plot (x, y represents continuous value) using d3 and svg.
* @param {object} data     
    A data object array in the format of `[{columnX: n1, columnY: n2},{columnX: n3, columnY: n4}]`.  
* @param {object=} options  
    An optional object contains the following objects.  
    size, describing the svg size in the format of `size: { width: 400, height: 300 }`.  
    margin, describing the margin inside the svg in the format of `margin: { left: 50, top: 40, right: 20, bottom: 50 }`.  
    location, describing where to put the graph in the format of `location: 'body', or '#<ID>'`.  
    dotRadius, dot radius describing the radius of the dot in the format of `dotRadius: 4`.   
    colors: describing the colors used for different lines in the format of `colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']`.  
* @return {} appends a graph to html.

#### Example
```
let data = [];
for (i = 0; i < 50; i++) {
    let element = {
        "age":i+18,
        "score1": Math.floor(Math.random()*100)
        }
    data.push(element)
}

// example 1  
yf.scatter(data);

// example 2 
yf.scatter(data, {
    size: { width: 350, height: 300 }, 
});

// example 3 
let data2 = [];
for (i = 0; i < 50; i++) {
    let element = {
        "age":i+18,
        "score1": Math.floor(Math.random()*100),
        "score2": Math.floor(Math.random()*100+200),
        "score3": Math.floor(Math.random()*100+400),
        "score4": Math.floor(Math.random()*100+600)
        }
    data2.push(element)
}

yf.scatter(data2, {
    size: { width: 350, height: 300 }, 
    margin: { left: 40, top: 80, right: 40, bottom: 40 }, 
    location: 'body',
    dotRadius: 3,
    colors: ['#396AB1','#DA7C30','#3E9651','#CC2529','#535154','#6B4C9A','#922428','#948B3D']
});
```
![scatter](readmePic/scatter.png)



  
