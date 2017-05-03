'use strict'

var AHC = require('./AdaptiveHuffmanCoding.js');

var filePath = './data/input.txt';
var test = new AHC(filePath);
test.encode();