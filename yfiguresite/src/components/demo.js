import React, { Component } from 'react';
import * as yf from 'yfigure'

function Figure(props) {
  return (
    <div id="singleFigure">
      <div id={props.location}>
      </div>
      <a style={{ marginLeft: '1em' }} href={'placeholder'}>codepen</a>
      <br />
    </div>
  );
}

function DemoNav() {
  return (
    <nav id="demoNav" style={{ marginleft: 0 }} className="navbar navbar-light bg-light">

      <ul className="nav">
        <li className="nav-item">
          <a href="#">&#x2191;Demo(Clickable legend)</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#groupedBar">Grouped Bar</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#simpleBar">Simple Bar</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#stackedBar">Stacked Bar</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#horizontalBar">Horizontal Bar</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#sortableBar">Sortable Bar</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#histogram">Histogram</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#lineDot">LineDot</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#line">Line</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#scatter">Scatter</a>
        </li>
      </ul>
    </nav>
  );
}



class Demo extends Component {

  componentDidMount() {

    let techCompany2019 = [['Quarter', 'Microsoft', 'Apple', 'Amazon'],
    ['First', 905, 836, 875],
    ['Second', 1028, 911, 929],
    ['Third', 1062, 1012, 857],
    ['Fourth', 1203, 1305, 916]]

    // example 2
    let groupBar1 = new yf.Bar(techCompany2019, {
      location: '#groupedBar1',
      frameLeft: 40,
      title: '2019 Microsoft Apple Amazon',
      yTitle: 'Market cap (us billion)',
      //      xPadding: 0.3,
      //      yPadding: 0.25,
      //      legendX: 0.20,
      //      legendY: 0.18,
      //      legendWidth: 10,
      //      legendFont: '12px times'
      //      withinGroupPadding: 0.1
    });


    let QuebecMoveOut = [
      ["year", "Manitoba", "Saskatchewan", "Alberta", "British Columbia"],
      ["2015/2016", -461, -314, -4006, -3788],
      ["2016/2017", -420, -286, -2758, -3295],
      ["2017/2018", -367, -261, -2537, -3282],
      ["2018/2019", -341, -289, -2818, -3143],
    ]

    let groupBar2 = new yf.Bar(QuebecMoveOut, {
      location: '#groupedBar2',
      yTitle: "Number of Quebecers moving",
      //yGridDashArray: '4 2',
      yGridStrokeWidth: 0.2,
      xPadding: 0.15,
      //yPadding: 0,
      legendX: 0.15,
      legendY: 0.85,
      frameLeft: 45,
      frameTop: 35,
      xTickLabelRotate: 10,
      xTitle: '',
      //colors: ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'],
      title: 'Quebec residences moving desination',
      //titleY: 1,
    });

    let largestCompanies2020 = [
      ['Market cap', 'Microsoft', 'Apple', 'Amazon', 'Alphabet', 'Alibaba', 'Facebook'],
      ['2020 First quarter', 1200, 1113, 971, 799, 522, 475]
    ]
    // example 1
    let groupBar3 = new yf.Bar(largestCompanies2020, {
      location: '#groupedBar3',
      frameLeft: 40,
      xPadding: 0.01,
      title: 'World Largest Companies',
      titleY: 0.98,
      //frameTop: 0,
      yTitle: 'Market cap (us billion)',
      xTitle: '',
      withinGroupPadding: 0.1
    });


    let gdpRate2007to2010 = [['Year', 'US', 'UK', 'Japan'],
    ['2005', 3.5, 3.2, 1.7,],
    ['2006', 2.9, 2.8, 1.4,],
    ['2007', 1.9, 2.4, 1.7,],
    ['2008', -0.1, -0.3, -1.1,],
    ['2009', -2.5, -4.2, -5.4,],
    ['2010', 2.6, 1.9, 4.2,],
    ['2011', 1.6, 1.5, -0.1,],
    ['2012', 2.2, 1.5, 1.5,],
    ['2013', 1.8, 2.1, 2,],
    ['2014', 2.5, 2.6, 0.4,],
      // ['2015', 2.88091046605219,  2.35552430595799,  1.22292104108077],
      // ['2016', 1.56721516997864,  1.91815510596298,  0.609093181244134],
      // ['2017', 2.21701033031884,  1.89207703836381,  1.92875725125687],
      // ['2018', 2.92732272821085,  1.38567356958762,  0.788455875670337],
    ]

    // example 2
    let groupBar4 = new yf.Bar(gdpRate2007to2010, {
      location: '#groupedBar4',
      colors: ['#DA7C30', '#3E9651', '#6B4C9A'],
      width: 800,
      xPadding: 0.25,
      legendX: 0.4,
      yGridStrokeWidth: 0.2,
      title: 'GDP Growth During 08 Financial Crisis',
      yTitle: 'Growth rate (%)',
      yAxisPosition: ['left', 'right'],
      axisLongLineRemove: ['top'],
      backgroundColor: 'rgba(50, 115, 220, 0.1)',
    });

    //bar4.update();
    //bar5.update();
    //bar6.update();


    // example 1
    let population = [['Country', 'Population (million)'], ["UK", 68], ["Japan", 126], ["Germany", 84], ["France", 65], ["Italy", 60]]
    let bar1 = new yf.Bar(population, { location: '#simpleBar1' });

    // example 2 rotate x tick lables, change layout, font
    let population2 = [['Country', 'Population (million)'], ["UK", 68], ["Japan", 126], ["Germany", 84], ["France", 65], ["Italy", 60]]
    let bar2 = new yf.Bar(population2, {
      location: '#simpleBar2',
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
      location: '#simpleBar3',
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
      location: '#simpleBar4',
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


    let CanadaSpendScicence = [['year', 'Natural sciences research', 'Social sciences research', 'Natural sciences related', 'Social sciences related'],
    ['2016/2017', 6124, 968, 2517, 1818],
    ['2017/2018', 6666, 1076, 2690, 1622],
    ['2018/2019', 6435, 1119, 3040, 1665],
    ['2019/2020', 6743, 1204, 3223, 1540],
    ['2020/2021', 6705, 1237, 3168, 1554],
    ] // https://doi.org/10.25318/2710000601-eng

    // example 2
    let stackedBar1 = new yf.Bar(CanadaSpendScicence, {
      location: '#stackedBar1',
      stacked: true,
      frameLeft: 45,
      //legendX: 0.4,
      title: 'Canada Federal expenditures on science',
      yTitle: 'Intentions (million)'
    });


    let canadaTemprature = [['Provinces', 'High', 'Low'],
    ['Saskatchewan', 45.0, -56.7],
    ['Alberta', 43.3, -61.1],
    ['British Columbia', 44.4, -58.9],
    ['Manitoba', 44.4, -52.8],
    ['New Brunswick', 39.4, -46.7],
    ['Nova Scotia', 38.3, -41.1],
    ['Ontario', 42.2, -58.3],
    ['Quebec', 40.0, -54.4],
    ['PEI', 36.7, -37.2],
    ['NL', 38.3, -51.1],
    ['NT', 39.4, -59.4],
    ['Nunavut', 34.9, -57.8],
    ['Yukon', 36.5, -63.0]]

    // example 2
    let stackedBar2 = new yf.Bar(canadaTemprature, {
      location: '#stackedBar2',
      stacked: true,
      legendX: 0.88,
      legendY: 0.42,
      legendFont: '15px sans-serif',
      xPadding: 0.3,
      yPadding: 0.08,
      frameBottom: 50,
      xTickLabelRotate: 30,
      xTitle: ' ',
      yTitle: 'Temprature (°C)',
      title: "Canada Record Temprature",
      titleY: 1,
      colors: ['#CC2529', '#009fe1', '#DA7C30', '#3E9651', '#535154', '#6B4C9A', '#922428', '#948B3D']
    });


    let gdp2007to2010 = [
      ['Country', '2007', '2008', '2009', '2010'],
      ['Canada', 6.9, 1.0, -2.9, 3.1],
      ['EU', 3.2, 0.7, -4.3, 2.2],
      ['US', 1.9, -0.1, -2.5, 2.6],
      ['Japan', 1.7, -1.1, -5.4, 4.2],
    ]


    // example 2
    let stackedBar3 = new yf.Bar(gdp2007to2010, {
      location: '#stackedBar3',
      stacked: true,
      frameLeft: 45,
      //legendX: 0.4,
      title: 'GDP growth Rate',
      yTitle: '(%)'
    });


    let SaskatchewanMoveOut = [
      ["year", "NL", "PEI", "NS", "NB", "Quebec", "Ontario", "Manitoba", "Alberta", "British Columbia", "Yukon", "NT", "NV"],
      ['1991/1992', 119, 30, 279, 149, 343, 2480, 2803, 13165, 6426, 204, 219, 60,],
      ['1992/1993', 111, 41, 317, 100, 371, 2358, 2576, 11406, 5866, 160, 241, 59,],
      ['1993/1994', 87, 47, 261, 101, 336, 2151, 2556, 10900, 5455, 93, 201, 71,],
      ['1994/1995', 82, 50, 246, 162, 282, 2289, 2598, 9871, 4530, 102, 212, 42,],
      ['1995/1996', 40, 28, 264, 129, 313, 2236, 2386, 9808, 4067, 100, 158, 43,],
      ['1996/1997', 59, 20, 273, 114, 267, 2124, 2101, 10635, 3720, 75, 128, 49,],
      ['1997/1998', 98, 35, 241, 128, 268, 2153, 2286, 11694, 3491, 50, 153, 40,],
      ['1998/1999', 131, 32, 275, 133, 259, 2275, 2289, 10895, 2976, 51, 156, 61,],
      ['1999/2000', 135, 61, 329, 129, 259, 2678, 2450, 13021, 3192, 68, 146, 35,],
      ['2000/2001', 100, 37, 320, 127, 273, 2408, 2347, 12480, 3080, 57, 139, 27,],
      ['2001/2002', 110, 37, 261, 151, 278, 2207, 2470, 14178, 3394, 61, 222, 49,],
      ['2002/2003', 118, 34, 286, 132, 299, 1918, 2455, 11798, 2975, 66, 190, 42,],
      ['2003/2004', 84, 25, 284, 121, 300, 1759, 2260, 10743, 3279, 41, 153, 23,],
      ['2004/2005', 75, 20, 235, 110, 255, 1934, 2121, 14476, 3450, 72, 170, 28,],
      ['2005/2006', 67, 28, 214, 121, 185, 1577, 1946, 13231, 3304, 25, 95, 25,],
      ['2006/2007', 62, 22, 208, 130, 195, 1672, 1734, 10143, 3158, 40, 103, 21,],
      ['2007/2008', 113, 28, 204, 151, 270, 1781, 1857, 8494, 2952, 51, 100, 25,],
      ['2008/2009', 100, 20, 282, 145, 259, 1800, 1646, 7823, 2852, 73, 102, 42,],
      ['2009/2010', 92, 48, 268, 149, 255, 2082, 1731, 7288, 3037, 25, 84, 25,],
      ['2010/2011', 121, 44, 273, 153, 289, 2226, 1688, 8164, 2945, 54, 77, 23,],
      ['2011/2012', 116, 45, 246, 148, 311, 2381, 1731, 9235, 3173, 43, 62, 17,],
      ['2012/2013', 114, 60, 256, 130, 220, 2380, 1477, 8811, 3024, 27, 73, 18,],
      ['2013/2014', 112, 45, 317, 120, 230, 2614, 1576, 9267, 3822, 29, 53, 25,],
      ['2014/2015', 138, 54, 274, 186, 256, 3163, 1705, 9510, 4438, 46, 87, 17,],
      ['2015/2016', 129, 37, 330, 217, 347, 3942, 1594, 8249, 4551, 64, 55, 17,],
      ['2016/2017', 118, 52, 337, 158, 357, 4353, 1625, 7682, 4062, 56, 66, 24,],
      ['2017/2018', 108, 61, 325, 220, 418, 4430, 1378, 8682, 4308, 48, 98, 36,],
      ['2018/2019', 93, 47, 347, 241, 712, 6027, 1583, 9930, 4390, 40, 130, 67,],
    ]

    // example 2
    let stackedBar4 = new yf.Bar(SaskatchewanMoveOut, {
      location: '#stackedBar4',
      stacked: true,
      width: 800,
      yPadding: 0.01,
      title: 'Destination of moving out Saskatchewan residents',
      legendX: 0.08,
      tickLabelHide: ['bottom 1 2 4 5 7 8 10 11 13 14 16 17 19 20 22 23 25 26']
    });

    let worldPopulation2020 = [
      ['Country', 'Population(million)'], ['US', 331], ['Indones', 274], ['Pakist', 221], ['Brazil', 213], ['Nigeri', 206], ['Bangladesh', 165],
      ['Russia', 146], ['Mexico', 129], ["Japan", 126], ["Ethiopia", 115], ["Philippines", 110], ["Egypt", 102], ["Vietnam", 97], ["DR Congo", 90],
      ["Turkey", 84], ["Iran", 84], ["Germany", 84],
    ]

    // example 2
    let horizontalBar1 = new yf.Bar(worldPopulation2020, {
      location: '#horizontalBar1',
      horizontal: true,
      //  height: 400,
      //width: 300,
      axisColor: 'green',
      xPadding: 0,
      frameLeft: 60,
      xTitle: '',
      frameTop: 5,
      xGridStrokeWidth: 0.5,
      xGridDashArray: '6 2',
      xGridColor: 'orange',
      title: 'World population'
    });

    let G20NetMigration2012to2017 = [['country', '2012-2017'], ['Argentina', 24], ['Australia', 791], ['Brazil', 106], ['Canada', 1210], ['China', -1742], ['France', 183],
    ['Germany', 2719], ['India', -2663], ['Indonesia', -495], ['Italy', 745], ['Japan', 358], ['Mexico', -300], ['Saudi Arabia', 675], ['South Africa', 727],
    ['Turkey', 1420], ['United Kingdom', 1303], ['United States', 4774]]

    // example 2
    let horizontalBar2 = new yf.Bar(G20NetMigration2012to2017, {
      location: '#horizontalBar2',
      horizontal: true,
      yAxisPosition: ['right'],
      axisColor: 'red',
      frameRight: 60,
      frameTop: 5,
      xGridStrokeWidth: 0.5,
      xGridDashArray: '6 2',
      xGridColor: 'orange',
      yGridStrokeWidth: 0.5,
      yGridDashArray: '6 2',
      yGridColor: 'orange',
      yTitle: '',
      xTitle: 'Person (x1000)',
      title: 'G20 2012-2017 net migration',
    });


    let OwnerOccupiedExpenditures3 = [['Provinces', '2016', '2017', '2018'],
    ['Quebec', 2376, 2563, 2664],
    ['Ontario', 4592, 4648, 4718],
    ['British Columbia', 1362, 1471, 1561],
    ]  // https://doi.org/10.25318/3410009501-eng

    let horizontalBar3 = new yf.Bar(OwnerOccupiedExpenditures3, {
      location: '#horizontalBar3',
      horizontal: true,
      scaleStart: 500,
      xGridStrokeWidth: 0.2,
      frameLeft: 60,
      yTitle: '',
      xTitle: 'Dollar (million)',
      title: 'Home Owner total expenses'
    });


    let netMigration2002to2017 = [
      ['year', 'United States', 'Russian', 'China'],
      ['2002', 5335, 1778, -1966,],
      ['2007', 5429, 2327, -2178,],
      ['2012', 4962, 1801, -1552,],
      ['2017', 4774, 912, -1742,],
    ];



    let horizontalBar4 = new yf.Bar(netMigration2002to2017, {
      location: '#horizontalBar4',
      horizontal: true,
      scaleStart: 500,
      xGridStrokeWidth: 0.2,
      frameLeft: 60,
      //yPadding: 0.3,
      yTitle: '',
      xTitle: 'Person (thousand)',
      title: 'Net migration of the three'
    });

    let ontarioMoveOut = [['province', '2014/2015', '2015/2016', '2016/2017', '2017/2018', '2018/2019'],
    ['NL', -2295, -2128, -1791, -1919, -2001,],
    ['PEI', -683, -925, -1236, -1317, -1646,],
    ['NS', -4788, -4970, -5504, -5647, -6123,],
    ['NB', -2734, -2718, -3094, -3562, -3931,],
    ['QC', -9909, -10862, -10884, -11726, -13291,],
    ['MB', -3317, -3548, -3261, -3192, -3213,],
    ['SK', -3335, -2770, -2593, -2197, -2347,],
    ['AB', -25660, -16163, -13197, -13964, -16555,],
    ['BC', -17905, -17666, -15846, -15574, -15443,],
      //['Yukon', -243, -297, -291, -297, -385,],
      //['Northwest_Territories', -411, -448, -376, -298, -208,],
      //['Nunavut', -289, -218, -262, -281, -407,],
    ];

    // example 2
    let horizontalBar5 = new yf.Bar(ontarioMoveOut, {
      location: '#horizontalBar5',
      stacked: true,
      horizontal: true,
      yTitle: '',
      marginRight: 0,
      legendX: 0.08,
      xTickLabelRotate: -15,
      xGridStrokeWidth: 0.2,
      title: ' Ontario move out',
      xPadding: 0.178
    });


    let ontarioMoveIn = [['province', '2014/2015', '2015/2016', '2016/2017', '2017/2018', '2018/2019'],
    ['NL', 1895, 2081, 2269, 2388, 2700],
    ['PEI', 718, 897, 921, 1242, 1817],
    ['NS', 4874, 5239, 4843, 4743, 4903],
    ['NB', 3001, 3385, 3046, 3240, 3602],
    ['QC', 18828, 18985, 18084, 17255, 18401],
    ['MB', 4298, 4638, 5124, 5735, 6811],
    ['SK', 3163, 3942, 4353, 4430, 6027],
    ['AB', 14032, 19421, 19046, 16443, 16949],
    ['BC', 11349, 12390, 13279, 13561, 14804],
      //    ['Yukon', 133, 180, 120, 173, 246],
      //    ['NT', 247, 283, 318, 335, 433],
      //    ['NV', 336, 349, 314, 373, 588],
    ]

    // example 2
    let horizontalBar6 = new yf.Bar(ontarioMoveIn, {
      location: '#horizontalBar6',
      stacked: true,
      horizontal: true,
      yTitle: '',
      marginLeft: 0,
      xTickLabelRotate: 15,
      xGridStrokeWidth: 0.2,
      legendX: 0.08,
      title: ' Ontario move in'
    });



    let G20NetMigration2002to2017 = [['country', '2002', '2007', '2012', '2017'], ['Argentina', -125, -120, 30, 24], ['Australia', 589, 1211, 989, 791],
    ['Brazil', 0, 0, 16, 106], ['Canada', 1052, 1326, 1241, 1210], ['China', -1966, -2178, -1552, -1742], ['France', 926, 446, 424, 183],
    ['Germany', 824, 43, 1939, 2719], ['India', -1889, -2656, -2350, -2663], ['Indonesia', -1150, -1334, -454, -495], ['Italy', 1664, 1051, 1637, 745],
    ['Japan', 164, 278, 358, 358], ['Mexico', -2206, -562, -422, -300], ['Saudi Arabia', 748, 1073, 1723, 675], ['South Africa', 789, 862, 920, 727],
    ['Turkey', -40, -50, 1763, 1420], ['United Kingdom', 992, 2189, 1300, 1303], ['United States', 5335, 5429, 4962, 4774]
    ]

    // example 2
    let horizontalBar7 = new yf.Bar(G20NetMigration2002to2017, {
      location: '#horizontalBar7',
      stacked: true,
      horizontal: true,
      width: 800,
      legendY: 0.1,
      frameLeft: 60,
      frameTop: 0,
      marginTop: 30,
      legendX: 0.12,
      xGridStrokeWidth: 0.2,
      xGridDashArray: '6 4',
      yGridStrokeWidth: 0.2,
      yGridDashArray: '4 8',
      yTitle: '',
      xTitle: 'Person (thousand)',
      title: 'G20 2002-2017 net migration (5 years interval)',
      colors: ['#3E9651', '#6B4C9A', '#922428', '#948B3D']
    });




    let G20population2019 = [['Country', 'Population'], ["Argentina", 44495], ["Australia", 24983], ["Brazil", 209469], ["Canada", 37058], ["China", 1392730],
    ["France", 66977], ["Germany", 82906], ["India", 1352617], ["Indonesia", 267663], ["Italy", 60422], ["Japan", 126529],
    ["Mexico", 126191], ["Saudi Arabia", 33700], ["South Africa", 57780], ["Turkey", 82320], ["United Kingdom", 66460], ["United States", 326688]]

    // example 1
    let sortableBar1 = new yf.SortableBar(G20population2019, {
      location: '#sortableBar1',
      frameLeft: 65,
      xTitle: '',
      yTitle: 'Person (x1000)',
      title: 'G20 Population',
      titleY: 0.08,
      xTickLabelRotate: 40,
      yGridStrokeWidth: 0.2,
      colors: ['#006400'],
      xAxisColor: 'red',
      xTickLabelColor: 'red',
      yAxisColor: 'blue',
      yTickLabelColor: 'blue',
      yTitleColor: 'blue'
    });


    let G20Migration2012to2017 = [['country', '2012-2017'], ['Argentina', 24], ['Australia', 791], ['Brazil', 106], ['Canada', 1210], ['China', -1742], ['France', 183],
    ['Germany', 2719], ['India', -2663], ['Indonesia', -495], ['Italy', 745], ['Japan', 358], ['Mexico', -300], ['Saudi Arabia', 675], ['South Africa', 727],
    ['Turkey', 1420], ['United Kingdom', 1303], ['United States', 4774]]

    // example 1
    let sortableBar2 = new yf.SortableBar(G20Migration2012to2017, {
      location: '#sortableBar2',
      frameLeft: 45,
      xAxisPosition: ['top'],
      xTitle: '',
      yTitle: 'Person (x1000)',
      title: 'G20 2012-2017 net migration',
      titleY: 0.98,
      xTickLabelRotate: 40,
      yGridStrokeWidth: 0.2,
      colors: ['green', 'orange']
    });


    let withinCanadaMigration2018to2019 = [['provinces', 'person'], ['NL', -4501], ['PEI', 129], ['NS', 3306], ['NB', 606], ['QC', -3049],
    ['ON', 11731], ['MB', -9246], ['SK', -9688], ['AB', 5542], ['BC', 6111], ['YK', -226], ['NT', -598], ['NV', -117]]

    // example 2
    let sortableBar3 = new yf.SortableBar(withinCanadaMigration2018to2019, {
      location: '#sortableBar3',
      horizontal: true,
      title: 'Within Canada Migration 2018-2019',
      titleY: 0.08,
      xGridStrokeWidth: 0.2,
      tickLabelHide: ['bottom 1 3 7 9 11'],
      colors: ['navy', '#DEB887']
    });


    let OECDMigration2012to2017 = [["country", '2012-2017'], ["Australia", 791], ["Austria", 325], ["Belgium", 240], ["Canada", 1210], ["Chile", 559],
    ["Colombia", 1024], ["Czech Republic", 110], ["Denmark", 76], ["Estonia", 20], ["Finland", 70], ["France", 183], ["Germany", 2719], ["Greece", -80],
    ["Hungary", 30], ["Iceland", 2], ["Ireland", 118], ["Israel", 50], ["Italy", 745], ["Japan", 358], ["Korea, Rep.", 59], ["Latvia", -74], ["Lithuania", -164],
    ["Luxembourg", 49], ["Mexico", -300], ["Netherlands", 80], ["New Zealand", 74], ["Norway", 140], ["Poland", -147], ["Portugal", -30], ["Slovak Republic", 7],
    ["Slovenia", 10], ["Spain", 200], ["Sweden", 200], ["Switzerland", 260], ["Turkey", 1420], ["United Kingdom", 1303], ["United States", 4774]]

    // example 3
    let sortableBar4 = new yf.SortableBar(OECDMigration2012to2017, {
      location: '#sortableBar4',
      width: 800,
      frameLeft: 45,
      yAxisPosition: ['left', 'right'],
      xTitle: '',
      yTitle: 'Person (x1000)',
      title: 'OECD net migration 2012-2017',
      titleY: 0.08,
      xTickLabelRotate: 40,
      yGridStrokeWidth: 0.2,
      colors: ['#CC2529', 'steelblue']
    });

    //sortableBar1.update();
    //sortableBar2.update();
    //sortableBar3.update();





    let normalDistribution = [['value'], [0.1], [2.62], [-0.8], [-0.55], [-1.41], [0.95], [-1.29], [1.06], [-0.78], [-1.36], [0.66], [1.11], [0.51],
    [-1.83], [-1.78], [-0.92], [-1.1], [-0.63], [-1.19], [1.18], [0.18], [-1.09], [1.03], [0.48], [-1.11], [0.18], [1.18], [-0.69],
    [-0.17], [1.38], [0.6], [0.31], [-0.53], [2.01], [0.49], [0.01], [0.07], [-0.25], [0.93], [-0.41], [1.54], [-0.36], [-2.4], [-0.65],
    [-0.3], [-1], [1.71], [0.15], [0.3], [-0.47], [0.05], [-0.29], [1.6], [0.76], [-0.16], [-0.37], [0.2], [0.83], [-0.71]]

    // example 2 
    let histogram1 = new yf.Histogram(normalDistribution, {
      location: '#histogram1',
      nBins: 10,
      colors: ['green'],
      title: 'Normal distribution'
    });

    let normal = [['value'], [10.18], [10.8], [10.22], [9.61], [11.32], [7.94], [10.7], [9.03], [10.72], [10.37], [10.84], [8.65], [10.83], [10.82],
    [10.31], [10.24], [9.67], [11.81], [9.28], [11.64], [9.72], [9.49], [8.94], [7.39], [9.72], [9.27], [8.83], [10.39], [9.64], [12.77],
    [8.44], [8.81], [9.67], [10.27], [10.29], [10.82], [10.44], [10.82], [9.99], [9.38], [9.38], [10.55], [8.7], [8.67], [11.38], [9.17],
    [8.37], [11.24], [9.2], [8.92], [11.2], [9.25], [10.74], [10.87], [9.38], [10.1], [9.67], [10.26], [9.21], [10.49], [10.57], [7.58],
    [10.67], [9.89], [9.36], [9.8], [8.94], [10.07], [10.52], [11.28], [8.94], [10.97], [10.55], [10.39], [9.63], [9.62], [9.85], [10.71],
    [9.75], [10.92], [9.75], [9.18], [12.1], [9.95], [8.49], [9.61], [9.08], [9.3], [9.84], [10.48], [9.93], [7.79], [10.36], [9.35], [10.52],
    [9.53], [7.55], [10.05], [10.15], [10.67], [8.51], [9.06], [10.4], [11.82], [9.65], [8.78], [9.48], [10.27], [11.39], [10.08], [12.11],
    [9.54], [9.92], [9.45], [10.08], [10.05], [8.46], [9.21], [11.11], [9.01], [9.22], [11.38], [9.85], [11.66], [11.29], [10.81], [10.4],
    [8.05], [9.84], [11.34], [8.81], [9.61], [9.29], [9.99], [10.23], [9.51], [8.25], [10.41], [10.18], [10.37], [10.56], [9.88], [9.78],
    [11.54], [9.95], [9.74], [8.94], [12.41], [10.46], [7.8], [9.07], [9.23], [9.43], [10.74], [11.04], [8.15], [10.34], [10.28], [10.22],
    [10.89], [9.34], [8.88], [10.82], [8.49], [9.91], [10.77], [9.22], [10.5], [9.91], [10.35], [8.42], [10.13], [8.77], [10.96], [9.43],
    [9.59], [10.94], [10.92], [9.04], [8.93], [11.73], [11.32], [8.26], [11.08], [10.45], [12.05], [8.7], [10.08], [10.8], [8.89], [10.56],
    [9.74], [9.33], [9.26], [10.13], [9.62], [10.37], [11.26], [11.42], [9.51], [8.94], [10.89], [10.54], [10.26], [10.22], [9.65], [9.96],
    [11.01], [8.17], [9.49], [11.78], [10.64], [9.14], [10.58], [10.92], [10.67], [11.12], [10.35], [11.51], [10.47], [10.2], [10.53], [10.79],
    [11.73], [8.88], [9.97], [10.05], [8.51], [8.68], [11.18], [10.23], [7.93], [11.66], [9.86], [11.42], [10.48]]

    // example 1  
    let histogram2 = new yf.Histogram(normal, { location: '#histogram2' });

    let histogram3 = new yf.Histogram(normalDistribution, {
      location: '#histogram3',
      nBins: 10,
      horizontal: true,
      title: 'Horizontal histogram',
      colors: ['red'],
    });



    //generate a pseudo normal distributed dataset
    let dataHistogram = [["value"]];
    for (let i = 0; i < 300; i++) {
      let element = [(Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 5 * 10]
      dataHistogram.push(element)
    }
    for (let i = 0; i < 300; i++) {
      let element = [6 + (Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 5 * 10]
      dataHistogram.push(element)
    }
    for (let i = 0; i < 300; i++) {
      let element = [12 + (Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 5 * 10]
      dataHistogram.push(element)
    }

    // example 4 
    let histogram4 = new yf.Histogram(dataHistogram, {
      location: '#histogram4',
      width: 800,
      nBins: 50,
      colors: ['purple']
    });



    let canadaGdpRate10Years = [['year', 'Canada gdp growth rate'], ["2009", "-2.9"], ["2010", "3.1"], ["2011", "3.1"], ["2012", "1.8"], ["2013", "2.3"],
    ["2014", "2.9"], ["2015", "0.7"], ["2016", "1.1"], ["2017", "3.0"], ["2018", "1.9"]];

    // example 1  
    let linedot1 = new yf.LineDot(canadaGdpRate10Years, {
      location: '#lineDot1',
      title: 'Canada GDP growth rate past 10 years'
    });

    let gdpRate = [
      ['year', 'China', 'US', 'Malaysia', 'Israel'],
      ['2013', 7.76, 1.68, 4.69, 4.11],
      ['2014', 7.30, 2.57, 6.01, 3.41],
      ['2015', 6.90, 2.86, 5.03, 3.04],
      ['2016', 6.70, 1.49, 4.22, 4.09],
      ['2017', 6.90, 2.27, 5.90, 3.33],
      ['2018', 6.50, 2.80, 4.70, 3.50],
      ['average', 7.01, 2.28, 5.09, 3.58]
    ]

    // example 2
    let linedot2 = new yf.LineDot(gdpRate, {
      location: '#lineDot2',
      dotRadius: 6,
      xPadding: 0.4,
      title: 'GDP growth 2013-2018',
      yTitle: 'growth rate (%)'
    });

    let negativeMigration = [['year', 'China', 'India', 'Mexico'], ['1992', -780, -553, -2019], ['1997', -383, -683, -2296], ['2002', -1966, -1889, -2206],
    ['2007', -2178, -2656, -562], ['2012', -1552, -2350, -422], ['2017', -1742, -2663, -300]];

    // example 3 
    let linedot3 = new yf.LineDot(negativeMigration, {
      location: '#lineDot3',
      colors: ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'],
      legendX: 0.28,
      legendY: 0.85,
      legendFont: '14px times',
      xPadding: 0.2,
      xTitle: '',
      frameLeft: 45,
      yTitle: 'Persons (x1000)',
      title: 'Net migration over every 5 years'

    });



    let Saskatoon2010to2019tem = [['Month', 'High temperature (°C)', 'Low temperature (°C)'], ['January', -8, -19], ['February', -9, -20], ['March', 0, -11], ['April', 10, -3],
    ['May', 19, 4], ['June', 23, 10], ['July', 25, 12], ['August', 24, 10], ['September', 19, 5], ['October', 10, -2], ['November', -2, -11], ['December', -8, -17]]

    let linedot4 = new yf.LineDot(Saskatoon2010to2019tem, {
      location: '#lineDot4',
      horizontal: true,
      title: 'Saskatoon tempreture 2010 to 2019',
      yTitle: ''
    });

    let gdpRate2 = [
      ['year', 'China', 'US', 'Malaysia', 'Israel'],
      ['2013', 7.76, 1.68, 4.69, 4.11],
      ['2014', 7.30, 2.57, 6.01, 3.41],
      ['2015', 6.90, 2.86, 5.03, 3.04],
      ['2016', 6.70, 1.49, 4.22, 4.09],
      ['2017', 6.90, 2.27, 5.90, 3.33],
      ['2018', 6.50, 2.80, 4.70, 3.50],
      ['average', 7.01, 2.28, 5.09, 3.58]
    ]

    // example 2
    let linedot5 = new yf.LineDot(gdpRate2, {
      location: '#lineDot5',
      dotRadius: 6,
      horizontal: true,
      title: 'GDP growth 2013-2018',
      yTitle: 'growth rate (%)'
    });


    let negativeMigration2 = [['year', 'China', 'India', 'Mexico'], ['1992', -780, -553, -2019], ['1997', -383, -683, -2296], ['2002', -1966, -1889, -2206],
    ['2007', -2178, -2656, -562], ['2012', -1552, -2350, -422], ['2017', -1742, -2663, -300]];

    let linedot6 = new yf.LineDot(negativeMigration, {
      location: '#lineDot6',
      colors: ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'],
      legendFont: '14px times',
      horizontal: true,
      yAxisPosition: ['right'],
      yTitle: '',
      frameLeft: 45,
      xTitle: 'Persons (x1000)',
      //tickLabelHide: ['bottom 1 3 5 7 9'],
      xTicks: 6,
      title: 'Net migration over every 5 years'

    });



    let RentedExpenditures =
      [['year', 'NL', 'PEI', 'NS', 'NB', 'QC', 'ON', 'MB', 'SK', 'AB', 'BC', 'YK + NT + NV'],
      ['2000', 30, 8, 78, 46, 658, 880, 65, 53, 180, 266, 5],
      ['2001', 33, 8, 82, 47, 791, 1028, 73, 59, 196, 273, 6],
      ['2002', 34, 8, 82, 56, 871, 1065, 79, 63, 224, 307, 6],
      ['2003', 35, 9, 90, 61, 978, 1207, 85, 69, 246, 337, 7],
      ['2004', 41, 10, 104, 72, 1074, 1377, 98, 79, 289, 390, 8],
      ['2005', 44, 11, 113, 79, 1184, 1507, 108, 87, 316, 429, 9],
      ['2006', 48, 12, 127, 85, 1280, 1625, 116, 94, 347, 476, 9],
      ['2007', 50, 12, 130, 93, 1380, 1743, 123, 97, 377, 518, 10],
      ['2008', 52, 13, 139, 98, 1472, 1836, 134, 104, 397, 556, 10],
      ['2009', 55, 14, 147, 104, 1550, 1937, 140, 110, 416, 587, 10],
      ['2010', 56, 14, 147, 101, 1532, 1907, 137, 111, 413, 584, 10],
      ['2011', 55, 14, 153, 105, 1550, 1971, 141, 115, 437, 621, 13],
      ['2012', 56, 15, 156, 109, 1609, 2049, 150, 118, 452, 646, 15],
      ['2013', 57, 15, 159, 111, 1637, 2083, 152, 121, 589, 660, 16],
      ['2014', 58, 16, 160, 116, 1746, 2305, 160, 136, 527, 726, 16],
      ['2015', 58, 16, 166, 120, 1789, 2429, 169, 142, 543, 761, 16],
      ['2016', 57, 16, 181, 120, 1914, 2611, 178, 148, 562, 812, 18],
      ['2017', 59, 17, 175, 121, 2081, 2662, 191, 158, 573, 885, 18],
      ['2018', 58, 18, 180, 123, 2179, 2692, 199, 162, 582, 945, 21],
      ] // https://doi.org/10.25318/3410009501-eng

    // example 3
    let lineDot7 = new yf.LineDot(RentedExpenditures, {
      location: '#lineDot7',
      width: 800,
      yTitle: "Dollar (million)",
      yGridDashArray: '10 2',
      yGridStrokeWidth: 0.2,
      xPadding: 0.4,
      legendX: 0.2,
      frameRight: 40,
      yAxisPosition: ['right'],
      yTitlePosition: ['right'],
      //      axisLongLineRemove: ['bottom'],
      //      xTickLabelRotate: -20,
      colors: ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'],
      backgroundColor: 'rgba(50, 115, 220, 0.1)',
      title: 'Canada Home Landlord/Tenants-occupied Expenditures'
    });

    //linedot1.update();
    //linedot2.update();
    //linedot3.update();
    //linedot4.update();
    //linedot5.update();
    //linedot6.update();

    let ottawaHousePrice = [['year', 'price'],
    //['1956', 13351], ['1957', 14230], ['1958', 15564], ['1959', 16038], ['1960', 16791], ['1961', 16070], ['1962', 15952],
    //['1963', 16549], ['1964', 16563], ['1965', 17056], ['1966', 18004], ['1967', 19476], ['1968', 23329], ['1969', 25652], ['1970', 26532], ['1971', 27808], ['1972', 30576],
    //['1973', 38305], ['1974', 46661], ['1975', 49633], ['1976', 54623], ['1977', 57032], ['1978', 59134], ['1979', 61896], ['1980', 62748], ['1981', 64896], ['1982', 71080],
    ['1983', 86245], ['1984', 102084], ['1985', 107306], ['1986', 111643], ['1987', 119612], ['1988', 128434], ['1989', 137455], ['1990', 141438], ['1991', 143361],
    ['1992', 143868], ['1993', 148129], ['1994', 147543], ['1995', 143193], ['1996', 140534], ['1997', 143873], ['1998', 143953], ['1999', 149650], ['2000', 159511],
    ['2001', 175971], ['2002', 200711], ['2003', 218692], ['2004', 235678], ['2005', 244532], ['2006', 255889], ['2007', 272618], ['2008', 290366], ['2009', 303888],
    ['2010', 327225], ['2011', 343284], ['2012', 351792], ['2013', 357348], ['2014', 361707], ['2015', 367632], ['2016', 371901], ['2017', 392474], ['2018', 407571],
    ['2019', 465221],]

    // example 1  
    let line1 = new yf.LineDot(ottawaHousePrice, {
      location: '#line1',
      dotRadius: 2,
      lineStrokeWidth: 5,
      frameLeft: 60,
      tickLabelHide: ['bottom 1-4 6-9 11-14 16-19 21-24 26-29 31-35'],
      title: 'Ottawa House Price Since 1980s'
    });


    let gdpGrowth = [
      ['year', 'Vietnam', 'Egypt', 'Canada'],
      ['2013', 5.42, 2.19, 2.48,],
      ['2014', 5.98, 2.92, 2.86,],
      ['2015', 6.68, 4.37, 1.00,],
      ['2016', 6.21, 4.35, 1.41,],
      ['2017', 6.81, 4.18, 3.05,],
      ['2018', 6.60, 5.30, 2.00,],
      ['average', 6.28, 3.88, 2.13],
    ]

    // example 2
    let line2 = new yf.LineDot(gdpGrowth, {
      location: '#line2',
      dotRadius: 1,
      title: 'GDP growth rate with average'
    });

    let RentedExpenditures1 =
      [['year', 'QC', 'ON', 'AB', 'BC'],
      ['2000', 658, 880, 180, 266],
      ['2001', 791, 1028, 196, 273],
      ['2002', 871, 1065, 224, 307],
      ['2003', 978, 1207, 246, 337],
      ['2004', 1074, 1377, 289, 390],
      ['2005', 1184, 1507, 316, 429],
      ['2006', 1280, 1625, 347, 476],
      ['2007', 1380, 1743, 377, 518],
      ['2008', 1472, 1836, 397, 556],
      ['2009', 1550, 1937, 416, 587],
      ['2010', 1532, 1907, 413, 584],
      ['2011', 1550, 1971, 437, 621],
      ['2012', 1609, 2049, 452, 646],
      ['2013', 1637, 2083, 589, 660],
      ['2014', 1746, 2305, 527, 726],
      ['2015', 1789, 2429, 543, 761],
      ['2016', 1914, 2611, 562, 812],
      ['2017', 2081, 2662, 573, 885],
      ['2018', 2179, 2692, 582, 945],
      ] // https://doi.org/10.25318/3410009501-eng

    // example 3
    let line3 = new yf.LineDot(RentedExpenditures1, {
      location: '#line3',
      dotRadius: 1,
      yTitle: "Dollar (million)",
      legendY: 0.2,
      frameRight: 40,
      xTitle: '',
      yAxisPosition: ['right'],
      yTitlePosition: ['right'],
      yPadding: 0.05,
      colors: ['#396AB1', '#DA7C30', '#3E9651', '#CC2529', '#535154', '#6B4C9A', '#922428', '#948B3D'],
      tickLabelHide: ['bottom 1 3 5 7 9 11 13 15 17 19'],
      title: 'Canada Home Landlord/Tenants-occupied Expenditures'
    });




    // example 1  
    let line4 = new yf.LineDot(ottawaHousePrice, {
      location: '#line4',
      horizontal: true,
      dotRadius: 2,
      lineStrokeWidth: 5,
      xTicks: 6,
      tickLabelHide: ['left 1-4 6-9 11-14 16-19 21-24 26-29 31-35'],
      title: 'Ottawa House Price Since 1980s'
    });

    // example 2
    let line5 = new yf.LineDot(gdpGrowth, {
      location: '#line5',
      horizontal: true,
      dotRadius: 1,
      title: 'GDP growth rate with average'
    });



    let big3Gdp = [
      ['year', 'China', 'Russian Federation', 'United States'],
      //      ['1961', '-27.2700000039461', '..', '2.29999999999968'],
      ['1962', '-5.579999990136', '', '6.10000000000012'],
      ['1963', '10.2999999952758', '', '4.39999999999992'],
      ['1964', '18.179999994202', '', '5.8000000000003'],
      ['1965', '16.950000002496', '', '6.39999999999976'],
      ['1966', '10.6500000041736', '', '6.50000000000028'],
      ['1967', '-5.77000000422507', '', '2.50000000000003'],
      ['1968', '-4.09999999214143', '', '4.79999999999959'],
      ['1969', '16.9399999961092', '', '3.09999999999999'],
      ['1970', '19.299999996256', '', '-0.254079592763304'],
      ['1971', '7.0600000033518', '', '3.29336237777143'],
      ['1972', '3.80999999825444', '', '5.25889535776155'],
      ['1973', '7.7600000016445', '', '5.64571947037473'],
      ['1974', '2.31000000049113', '', '-0.540546529074902'],
      ['1975', '8.72000000047512', '', '-0.2054640121342'],
      ['1976', '-1.57000000275067', '', '5.38813922657351'],
      ['1977', '7.56999999917167', '', '4.62415920683689'],
      ['1978', '11.1341644119842', '', '5.53530269328533'],
      ['1979', '7.59999999999981', '', '3.16615027095321'],
      ['1980', '7.80669144981421', '', '-0.256751930992138'],
      ['1981', '5.17241379310325', '', '2.53771869780746'],
      ['1982', '8.93442622950838', '', '-1.80287445271176'],
      ['1983', '10.8352144469525', '', '4.58392731566101'],
      ['1984', '15.1391717583165', '', '7.23661999357385'],
      ['1985', '13.443396226415', '', '4.16965595430243'],
      ['1986', '8.93970893970896', '', '3.46265171279892'],
      ['1987', '11.6889312977098', '', '3.45957255534883'],
      ['1988', '11.2345151644597', '', '4.17704638444378'],
      ['1989', '4.18586789554539', '', '3.67265632851046'],
      ['1990', '3.90711389605592', '-2.99999564223592', '1.88596032309418'],
      ['1991', '9.29407591344456', '-5.04693945130884', '-0.108259105278663'],
      ['1992', '14.2161635832522', '-14.5310737738049', '3.52244249386644'],
      ['1993', '13.8675760159136', '-8.66854034144572', '2.75284432688012'],
      ['1994', '13.0521587222356', '-12.5697559797164', '4.0288390635428'],
      ['1995', '10.9492273730686', '-4.14352840569045', '2.68428713241977'],
      ['1996', '9.92837246319209', '-3.75506943907938', '3.77250131926519'],
      ['1997', '9.23076923076864', '1.39991580471734', '4.44721634273408'],
      ['1998', '7.83761391880707', '-5.29996162538214', '4.48140755451207'],
      ['1999', '7.66748617086645', '6.39991468983672', '4.75323598879717'],
      ['2000', '8.49150849150864', '10.0000668157438', '4.12748401355853'],
      ['2001', '8.33991054985535', '5.10005122514623', '0.9983407946565'],
      ['2002', '9.13064594463313', '4.69999190886617', '1.7416952497298'],
      ['2003', '10.0356030262573', '7.2999523445574', '2.86121076741024'],
      ['2004', '10.1112234580385', '7.19994786981057', '3.79889112662393'],
      ['2005', '11.3957759412304', '6.39996544796635', '3.51321379665302'],
      ['2006', '12.7194790206909', '8.20006825495356', '2.85497229170015'],
      ['2007', '14.2313880356883', '8.4999777684714', '1.87617145846693'],
      ['2008', '9.65428937259918', '5.19996926508021', '-0.136579805460741'],
      ['2009', '9.39981317141508', '-7.79999391345694', '-2.53675706585665'],
      ['2010', '10.6361404632299', '4.50000000001451', '2.56376655876581'],
      ['2011', '9.55091409001014', '4.30002918578838', '1.55083550568156'],
      ['2012', '7.8596274932851', '3.7000570551393', '2.24954585236992'],
      ['2013', '7.76861528412806', '1.800000140189', '1.84208107101102'],
      ['2014', '7.29951892117124', '0.699973678046774', '2.45197303536034'],
      ['2015', '6.90531667019702', '-2.30770688863852', '2.88091046605219'],
      ['2016', '6.73667525262536', '0.32928065807927', '1.56721516997864'],
      ['2017', '6.75700761091511', '1.63018573156532', '2.21701033031884'],
      ['2018', '6.56697385961871', '2.25480434572114', '2.92732272821085'],
    ]

    // example 3 
    let line6 = new yf.LineDot(big3Gdp, {
      location: '#line6',
      width: 800,
      dotRadius: 1,
      title: 'GDP growth rate of superpower since 1960s',
      //tickLabelHide: ['bottom 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 333'],
      //need to be simplified
      tickLabelHide: ['bottom 1 2 3 4 6 7 8 9 11 12 13 14 16 17 18 19 21 22 23 24 26 27 28 29 31 32 33 34 36 37 38 39 41 42 43 44 46 47 48 49 51 52 53 54 56'],
      colors: ['#DA7C30', '#3E9651', '#922428', '#948B3D']
    });

    let examsMathReading = [['math', 'female reading'], [72, 72], [69, 90], [90, 95], [71, 83], [88, 95], [65, 81], [50, 53], [69, 75], [54, 58], [65, 75], [69, 73], [67, 69], [62, 70], [69, 74], [63, 65],
    [56, 72], [74, 81], [50, 64], [75, 90], [58, 73], [53, 58], [50, 56], [55, 65], [66, 71], [57, 74], [71, 84], [33, 41], [82, 85], [69, 80], [59, 58], [60, 72], [39, 64], [58, 63], [41, 51], [61, 74],
    [62, 68], [47, 49], [73, 80], [76, 83], [71, 71], [58, 70], [73, 86], [65, 72], [79, 86], [63, 72], [58, 67], [65, 67], [85, 91], [58, 67], [87, 100,], [52, 76], [70, 64], [77, 89], [51, 58], [99, 100,],
    [75, 85], [78, 82], [51, 63], [55, 69], [79, 92], [88, 93], [87, 95], [51, 49], [75, 81], [59, 66], [76, 72]]

    // example 1  
    let scatter1 = new yf.Scatter(examsMathReading, {
      location: '#scatter1',
      dotRadius: 6,
      title: 'Math and reading score'
    });

    //pseudo data
    let exams = [['math', 'female reading', 'female writing', 'male reading', 'male writing'], [72, 72, 74, 74, 76], [69, 90, 88, 57, 52], [90, 95, 93, 61, 61], [71, 83, 78, 62, 61],
    [88, 95, 92, 84, 78], [65, 81, 73, 60, 58], [50, 53, 58, 58, 60], [69, 75, 78, 58, 53], [54, 58, 61, 66, 61], [65, 75, 70, 77, 71], [69, 73, 73, 74, 72], [67, 69, 75, 43, 41],
    [62, 70, 75, 64, 62], [69, 74, 74, 100, 95], [63, 65, 61, 81, 71], [56, 72, 65, 70, 75], [74, 81, 83, 67, 59], [50, 64, 59, 67, 67], [75, 90, 88, 54, 56], [58, 73, 68, 45, 41],
    [53, 58, 65, 63, 57], [50, 56, 54, 59, 54], [55, 65, 62, 43, 43], [66, 71, 76, 65, 63], [57, 74, 76, 84, 85], [71, 84, 87, 83, 78], [33, 41, 43, 66, 60], [82, 85, 86, 67, 67],
    [69, 80, 71, 73, 69], [59, 58, 59, 74, 68], [60, 72, 74, 73, 67], [39, 64, 57, 59, 62], [58, 63, 73, 56, 54], [41, 51, 48, 39, 34], [61, 74, 72, 83, 86], [62, 68, 68, 71, 65],
    [47, 49, 50, 59, 53], [73, 80, 82, 63, 54], [76, 83, 88, 66, 59], [71, 71, 74, 56, 55], [58, 70, 67, 66, 66], [73, 86, 82, 48, 53], [65, 72, 74, 68, 64], [79, 86, 92, 66, 73],
    [63, 72, 70, 56, 51], [58, 67, 62, 88, 82], [65, 67, 62, 82, 73], [85, 91, 89, 66, 60], [58, 67, 72, 81, 80], [87, 100, 100, 46, 42], [52, 76, 70, 73, 72], [70, 64, 72, 58, 49],
    [77, 89, 98, 56, 47], [51, 58, 54, 54, 48], [99, 100, 100, 65, 68], [75, 85, 82, 58, 55], [78, 82, 79, 54, 45], [51, 63, 61, 58, 62], [55, 69, 65, 67, 65], [79, 92, 89, 74, 76],
    [88, 93, 93, 62, 66], [87, 95, 86, 68, 72], [51, 49, 51, 71, 67], [75, 81, 84, 71, 68], [59, 66, 67, 68, 61], [76, 72, 71, 52, 46],]

    // example 2 
    let scatter2 = new yf.Scatter(exams, {
      location: '#scatter2',
      dotRadius: 3,
      title: 'Math, reading, and writing (pseudo data)'
    });

    let latitudeTemperature = [['Latitude', 'Temperature'], [31.2, 6.666], [32.9, 3.333], [33.6, 1.666], [35.4, -0.5555], [34.3, 8.333], [38.4, 5.555],
    [40.7, -9.444], [41.7, -5.555], [40.5, -3.333],
    [39.7, -1.111], [31, 7.222], [25, 18.33], [26.3, 14.44], [33.9, 2.777], [43.7, -5.555], [42.3, -7.222], [39.8, -6.111], [41.8, -11.66], [38.1, -5.555], [39, -2.777], [30.8, 7.222],
    [44.2, -11.11], [39.7, -3.888], [42.7, -5], [43.1, -6.111], [45.9, -16.66], [39.3, -4.444], [47.1, -13.33], [41.9, -10.55], [43.5, -11.66], [39.8, -2.777], [35.1, -4.444],
    [42.6, -10], [40.8, -2.778], [35.9, 1.111], [36.4, -0.56], [47.1, -17.78], [39.2, -3.333], [42.3, -6.111], [35.9, -2.222], [45.6, 0.5556], [40.9, -4.444], [40.9, -4.444],
    [33.3, 3.333], [36.7, -0.5556], [35.6, -4.444], [29.4, 9.444], [30.1, 6.666], [41.1, -7.778], [45, -13.888], [37, 0], [48.1, 0.5555], [48.1, -7.222], [43.4, -12.77], [43.3, -10.55],
    [41.2, -10],]

    // example 3 
    let scatter3 = new yf.Scatter(latitudeTemperature, {
      location: '#scatter3',
      //dotRadius: 7,
      colors: ['#948B3D'],
      title: 'January Temperature'
    });



    let pseudoScatter = [
      ['data1', 'data2', 'data3', 'data4'], [1, 0, 4, 8], [1, 0, 4, 8], [2, 1, 5, 9], [2, -1, 3, 7], [3, 2, 6, 10], [3, -2, 2, 6], [4, 3, 7, 11],
      [4, -3, 1, 5], [5, 4, 8, 12], [5, -4, 0, 4], [6, 5, 9, 13], [6, -5, -1, 3], [7, 6, 10, 14], [7, -6, -2, 2], [8, 7, 11, 15], [8, -7, -3, 1],
      [9, 8, 12, 16], [9, -8, -4, 0], [10, 9, 13, 17], [10, -9, -5, -1], [11, 9, 13, 17], [11, -9, -5, -1], [12, 8, 12, 16], [12, -8, -4, 0],
      [13, 7, 11, 15], [13, -7, -3, 1], [14, 6, 10, 14], [14, -6, -2, 2], [15, 5, 9, 13], [15, -5, -1, 3], [16, 4, 8, 12], [16, -4, 0, 4],
      [17, 3, 7, 11], [17, -3, 1, 5], [18, 2, 6, 10], [18, -2, 2, 6], [19, 1, 5, 9], [19, -1, 3, 7], [20, 0, 4, 8], [20, 0, 4, 8], [22, 1, 4, 6],
      [24, 2, 4, 4], [26, 3, 4, 2], [28, 4, 4, 0], [30, 5, 4, -1], [32, 6, 4, -2], [34, 7, 4, -3], [36, 8, 4, -4], [38, 9, 4, -5], [40, 10, 4, -6],
      [42, 11, 4, -7], [44, 12, 4, -8], [46, 13, 4, -9], [48, 14, 4, -10], [50, 15, 4, -11],];

    // example 3
    let scatter4 = new yf.Scatter(pseudoScatter, {
      location: '#scatter4',
      width: 800,
      //dotRadius: 3,
      colors: ['#396AB1', '#DA7C30', '#3E9651', '#535154', '#6B4C9A', '#922428', '#948B3D'],
      legendX: 0.1,
      title: 'pseudo data scatter'
    });

  }

  render() {
    const groupedBar = []
    const simpleBar = []
    const stackedBar = []
    const horizontalBar = []

    const sortableBar = []
    const histogram = []
    const lineDot = []
    const line = []
    const scatter = []

    for (let i = 1; i < 8; i++) {
      if (i < 5) {
        groupedBar.push(<Figure key={'grou' + i} location={'groupedBar' + i} />);
        simpleBar.push(<Figure key={'simp' + i} location={'simpleBar' + i} />);
        stackedBar.push(<Figure key={'stac' + i} location={'stackedBar' + i} />);
        sortableBar.push(<Figure key={'sort' + i} location={'sortableBar' + i} />);
        histogram.push(<Figure key={'hist' + i} location={'histogram' + i} />);
        scatter.push(<Figure key={'scat' + i} location={'scatter' + i} />);
      }
      if (i < 8) {
        horizontalBar.push(<Figure key={'hori' + i} location={'horizontalBar' + i} />);
        lineDot.push(<Figure key={'line' + i} location={'lineDot' + i} />);
      }
      if (i < 7) line.push(<Figure key={'line' + i} location={'line' + i} />);

      //      groupedBar.push(<div><div key={'grou' + i} id={'groupedBar' + i}></div><button>abcdafserx</button></div>)
      //simpleBar.push(<div key={'simp' + i} id={'simpleBar' + i}></div>)
      //stackedBar.push(<div key={'stac' + i} id={'stackedBar' + i}></div>)
      //horizontalBar.push(<div key={'hori' + i} id={'horizontalBar' + i}></div>)
      //sortableBar.push(<div key={'sort' + i} id={'sortableBar' + i}></div>)
      //histogram.push(<div key={'hist' + i} id={'histogram' + i}></div>)
      //lineDot.push(<div key={'line' + i} id={'lineDot' + i}></div>)
      //line.push(<div key={'line' + i} id={'line' + i}></div>)
      //scatter.push(<div key={'scat' + i} id={'scatter' + i}></div>)
    }

    return (
      <div className='text-left'>
        <DemoNav />
        <div data-spy="scroll" data-target="#demoNav" data-offset="0">
          <div><h4 id="groupedBar">Grouped Bar</h4></div>
          <div className="row align-items-center">
            {groupedBar}
          </div>
          <div><h4 id="simpleBar">Simple bar</h4></div>
          <div className="row align-items-center">
            {simpleBar}
          </div>
          <div><h4 id="stackedBar">Stacked bar</h4></div>
          <div className="row align-items-center">
            {stackedBar}
          </div>
          <div><h4 id="horizontalBar">Horizontal bar</h4></div>
          <div className="row align-items-center">
            {horizontalBar}
          </div>
          <div><h4 id="sortableBar">Sortable Bar</h4></div>
          <div className="row align-items-center">
            {sortableBar}
          </div>
          <div><h4 id="histogram">Histogram</h4></div>
          <div className="row align-items-center">
            {histogram}
          </div>
          <div><h4 id="lineDot">LineDot</h4></div>
          <div className="row align-items-center">
            {lineDot}
          </div>
          <div><h4 id="line">Line</h4></div>
          <div className="row align-items-center">
            {line}
          </div>
          <div><h4 id="scatter">Scatter</h4></div>
          <div className="row align-items-center">
            {scatter}
          </div>
          <br />
        </div>
      </div>
    )
  }
}

export default Demo;