'use strict';
const fs = require('fs');

let rawdata = fs.readFileSync('world_bank_popular.json');
let popular = JSON.parse(rawdata);


let G20 = ['Argentina', 'Australia', 'Brazil', 'Canada', 'China', 'Germany', 'France', 'India', 'Indonesia', 'Italy', 'Japan', 'Mexico', 'Russia',
    'Saudi Arabia', 'South Africa', 'South Korea', 'Turkey', 'United Kingdom', 'United States',]

let G7 = ['Canada', 'France', 'Germany', 'Italy', 'Japan', 'United Kingdom', 'United States']
let G1 = ['Russian Federation']

let data = [['country', '2002', '2007', '2012', '2017']];
let seriesName = [];
let countryName = [];
for (let i = 0; i < popular.length; i++) {
    if (!seriesName.includes(popular[i]['Series Name'])) seriesName.push(popular[i]['Series Name']);
    if (!countryName.includes(popular[i]['Country Name'])) countryName.push(popular[i]['Country Name']);
    if (popular[i]['Series Name'] == 'Net migration') {  //Population
        if (G1.includes(popular[i]['Country Name'])) data.push([
            popular[i]['Country Name'],
            Math.round(popular[i]['1962 [YR1962]'] / 1000),
            Math.round(popular[i]['1967 [YR1967]'] / 1000),
            Math.round(popular[i]['1972 [YR1972]'] / 1000),
            Math.round(popular[i]['1977 [YR1977]'] / 1000),
            Math.round(popular[i]['1982 [YR1982]'] / 1000),
            Math.round(popular[i]['1987 [YR1987]'] / 1000),
            Math.round(popular[i]['1992 [YR1992]'] / 1000),
            Math.round(popular[i]['1997 [YR1997]'] / 1000),
            Math.round(popular[i]['2002 [YR2002]'] / 1000),
            Math.round(popular[i]['2007 [YR2007]'] / 1000),
            Math.round(popular[i]['2012 [YR2012]'] / 1000),
            Math.round(popular[i]['2017 [YR2017]'] / 1000)
        ]);

    }





    //    if(test1[i]['Country Name'] == 'Japan') console.log(test1[i]);
    //    if (test1[i]['2007 [YR2007]'] > 0 && test1[i]['2007 [YR2007]'] < 5) {
    //        console.log(test1[i]['Country Name']);
    //    }
}

//console.log(seriesName);
console.log(data);