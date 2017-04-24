'use strict'

module.exports = Tree;

var NYT = 'NYT';	//Not Yet Transmitted
var NULL = null;	//parent node char

/*
 * An object to describe a node of huffman coding
 */
function Node(char){
	this.char = char;
	this.num = (this.char === NYT) ? 0 : 1;
}

Node.prototype.getChar = function() {
	return this.char;
};

Node.prototype.setChar = function(new_char) {
	return this.char = new_char;
};

Node.prototype.getNum = function() {
	return this.num;
};

Node.prototype.count = function() {
	return this.num++;
};

// /*
//  * An method to update current huffman coding
//  */
// Node.prototype.updateCode = function(new_code) {
// 	return new_code;
// };

/*
 * An object to decribe a binary tree by using an array
 */
function Tree(){
	this.tree = new Array();
	this.warehouse = new Array(); //storage state of char
}

/*
 * init tree with a NYT node
 */
Tree.prototype.init = function() {
	var rootNode = new Node(NYT);
	this.tree.push(rootNode);
	return this.tree;
};

/*
 * check the char is new or not
 */
Tree.prototype.isExist = function(char) {

	var index = this.warehouse.indexOf(char);
	if(index < 0){
		this.warehouse.push([char,1]);
		return false;
	}
	else{
		this.warehouse[index][1]++;
		return true;
	}
};

Tree.prototype.newToAdd = function(char) {

	if(isExist(char)){
		//to do..
	}
	else{
		//to do..
	}
};

Tree.prototype.getSubtree = function(parent_node) {

	var mark = false;
	var pRowIndex = 0;
	var pColIndex = 0;
	var subtree = new Array();

	//get index of parent node
	for(var i = 0; i < this.tree.length; i++){
		for(var j = 0; j < this.tree[i].length; j++){
			if(this.tree[i][j] == parent_node){
				pRowIndex = i;
				pColIndex = j;
				mark = true;
				break;
			}
		}
		if(mark){
			break;
		}
	}

	for(var i = pRowIndex, m = 0; i < this.tree.length; i++,m++){
		for(var j = pColIndex * pow(2,m); j < (pColIndex+1) * pow(2,m); j++){

		}
	}
};



