import React, {Component} from 'react';
import * as yf from 'yfigure'

function Figure (props) {
  return (
    <div className="col-sm-6">
      <div className="card">
        <div className="card-body">
          <div id='bar1'></div>
          <hr/>
          <a href={'placeholder'} className="card-link">Link</a>
          <br/>
        </div>
      </div>
    </div>
    );
}

class Demo extends Component {

    componentDidMount (){
        let population = [['Country', 'Population (million)'], ["UK", 68], ["Japan", 126], ["Germany", 84], ["France", 65], ["Italy", 60]];
        let bar1 = new yf.Bar(population, {location: '#yfigure1'})

            // example 2 rotate x tick lables, change layout, font
    let population2 = [['Country', 'Population (million)'], ["UK", 68], ["Japan", 126], ["Germany", 84], ["France", 65], ["Italy", 60]]
    let bar2 = new yf.Bar(population2, {
      location: '#yfigure2',
      title: 'World Population',
      colors: ['#1f9400', '#1f9400'], // second for negative value
      xAxisPosition: ['bottom', 'top'],
      yAxisPosition: ['left', 'right'],
      axisLongLineRemove: ['top', 'right'],
      xAxisFont: '14px times',
      yAxisFont: '14px times',
      backgroundColor: 'rgb(57,204,204, 0.1)',
    });


    let Saskatoon2010to2019Low = [['Month', 'Low temperature (°C)'], ['November', -11], ['December', -17], ['January', -19], ['February', -20], ['March', -11]]
    // example 3 negative data
    let bar3 = new yf.Bar(Saskatoon2010to2019Low, {
      location: '#yfigure3',
      title: 'Saskatoon temprature 2010 to 2019',
      titleY: 0.95,
      titleFont: 'bold 18px arial',
      xPadding: 0.01,
      xAxisFont: '16px times',
      yAxisFont: '16px times',
      xTitle: ' ',  // no xTitle
      xTickLabelRotate: -20,
      yTicks: 5,
      backgroundColor: 'rgba(50, 115, 220, 0.1)',
    });

    // example 4 change color, bar padding
    let canadaBudget = [['year', 'Surplus/deficit (% GDP)'], ['1995', -4.64], ['1996', -3.62], ['1997', -1.02], ['1998', 0.33],
    ['1999', 0.62], ['2000', 1.42], ['2001', 1.94], ['2002', 0.71], ['2003', 0.55], ['2004', 0.73], ['2005', 0.11], ['2006', 0.93],
    ['2007', 0.92], ['2008', 0.61], ['2009', -0.55], ['2010', -3.59], ['2011', -2.10], ['2012', -1.58], ['2013', -1.17], ['2014', -0.42],
    ['2015', -0.03], ['2016', -0.14], ['2017', -0.93], ['2018', -0.89], ['2019', -0.63]]

    let bar4 = new yf.Bar(canadaBudget, {
      location: '#yfigure4',
      width: 800,
      height: 350,
      title: 'Canada Budget',
      titleY: 1,
      titleFont: 'bold 28px times',
      frameBottom: 20,
      marginBottom: 10,
      xAxisPosition: ['top'], yAxisPosition: ['left', 'right'], xTitlePosition: ['top'],
      xGridDashArray: '4 2',
      xGridStrokeWidth: 0.2,
      yGridDashArray: '4 2',
      yGridStrokeWidth: 0.2,
    });

    }
    
    render() {
    const demoFigures = [];
    for (let i=1; i<10; i++) {
      demoFigures.push(
        <div id={'yfigure'+ i}></div>)
        
    }

    return (
      <div className='text-left'>
        <h4 className="text-left">Demo</h4>
        <div className="row align-items-center">
          {demoFigures}
        </div>
        <br/>
      </div>
    )
    }
}

export default Demo;

