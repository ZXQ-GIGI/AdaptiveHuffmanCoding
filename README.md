# AdaptiveHuffmanCoding

This is a simple adaptive huffman encoding algorithm that encodes the text file.

##Usage

var AHC = require('./AdaptiveHuffmanCoding.js');
var filePath = './data/input.txt';   

var test = new AHC(filePath);
test.coding();

