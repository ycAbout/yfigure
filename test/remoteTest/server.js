var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('/home/node/yfigure/test/'))

app.listen(3000);
