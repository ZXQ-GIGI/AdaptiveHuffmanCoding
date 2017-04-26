'use strict'

module.exports = AdaptiveHuffmanCoding;
const fs = require('fs');

var NYT = 'NYT';	//Not Yet Transmitted
var NULL = null;	//parent node char
var Root = 'root';  //Root Node char

/*
 * An object to describe a node of huffman coding
 */
function Node(char){
	this.char = char;
	this.weight = 0;
}

Node.prototype.getChar = function() {
	return this.char;
};

Node.prototype.setChar = function(new_char) {
	return this.char = new_char;
};

Node.prototype.getWeight = function() {
	return this.weight;
};

Node.prototype.count = function() {
	return this.weight++;
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
	var rootNode = new Node(Root);
	this.tree.push([rootNode]);
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


	var currentNode; 	//need to add 1
	if(this.isExist(char)){
		var exist_node = new Node(char);
		var posChar = this.getNodePos(exist_node); 		//the index of exist char node
		currentNode = this.tree[posChar[0]][posChar[1]]; 
	}
	else{
		var nodeNYT = new Node(NYT);
		var nodeRoot = new Node(Root);
		var posNYT;										//the index of current NYT
		if(this.getNodePos(nodeNYT) == undefined){
			posNYT = this.getNodePos(nodeRoot);
		}
		else{
			posNYT = this.getNodePos(nodeNYT);
		}

		this.addSubtree(this.createNew(char), posNYT);	
		currentNode = this.tree[posNYT[0]][posNYT[1]];
	}

	while(currentNode.getChar() != Root){
	
		var currentTree = this.getSubtree(currentNode);
		var farthestTree = this.getFarthestNode(currentNode.getWeight());
		this.exchangeSubtree(currentTree,currentTree[0][0],farthestTree,farthestTree[0][0]);

		var currentPos = this.getNodePos(farthestTree[0][0]);
		(this.tree[currentPos[0]][currentPos[1]]).count();		//add 1
		currentNode = this.tree[currentPos[0]][currentPos[1]];
		currentNode = this.getParentNode(currentNode);
	}
};
/*
 * get subtree of parent node
 */
Tree.prototype.getSubtree = function(parent_node) {

	var pRowIndex = 0;
	var pColIndex = 0;
	var subtree = new Array();

	//get index of parent node
	pRowIndex = (this.getNodePos(parent_node))[0];
	pColIndex = (this.getNodePos(parent_node))[1];

	//get all subtrees of parent node and copy to a new array
	//and delete previous subtree
	for(var i = pRowIndex, m = 0; i < this.tree.length; i++,m++){

		subtree[i-pRowIndex] = new Array();
		for(var j = pColIndex * Math.pow(2,m); j < (pColIndex+1) * Math.pow(2,m); j++){
			subtree[i-pRowIndex][j-pColIndex * Math.pow(2,m)] = this.tree[i][j];
			this.tree[i][j] = NULL;
		}
	}
	return subtree;
};

/*
 * check whether the current tree meets brother property
 */
// Tree.prototype.isBrotherPropery = function() {

// 	var treeTemp = this.tree;
// 	var greatNum = treeTemp[0][0].getWeight();

// 	for(var i = 0;i<treeTemp.length; i++){
// 		for(var j = treeTemp[i].length-1; j >= 0; j--){

// 			if((typeof(treeTemp[i][j]) != undefined) && (treeTemp[i][j] != NULL)){
// 				if(treeTemp[i][j].getWeight() <= greatNum){
// 					greatNum = treeTemp[i][j].getWeight();
// 				}
// 				else{
// 					return false;
// 				}
// 			}
// 		}
// 	}

// 	if((i == treeTemp.length) && (-1 == j)){
// 		return true;
// 	}
// };

/*
 * get farthest subtree whose parent node is weight 
 */
Tree.prototype.getFarthestNode = function(weight) {
	
	for(var i = 0; i<this.tree.length; i++){
		for(var j = this.tree[i].length-1; j >= 0; j--){
			if(this.tree[i][j].getWeight() == weight){
				return this.getSubtree(this.tree[i][j]);
			}
		}
	}
};

Tree.prototype.getNodePos = function(node) {

	for(var i = 0; i < this.tree.length; i++){
		for(var j = 0; j < this.tree[i].length; j++){
			if(this.tree[i][j].getChar() == node.getChar()){		
				return [i,j];
			}
		}
	}
};

Tree.prototype.addSubtree = function(subtree , pos) {

	//console.log(subtree);
	for(var i = 0, posX = pos[0] + i; i < subtree.length; i++, posX++){
		for(var j = 0, posY = pos[1] * Math.pow(2,i); j < subtree[i].length; j++, posY++){
			if(i>0){
				this.tree[posX] = new Array();
			}
			this.tree[posX][posY] = subtree[i][j];
			
		}
	}
	console.log(this.tree);
};

Tree.prototype.createNew = function(char) {
	
	var NULL_node = new Node(NULL);
	var NYT_node = new Node(NYT);
	var node = new Node(char);

	NULL_node.count();
	node.count();

	var new_subtree = [
					[NULL_node],
					[NYT_node , node]
				];

	return new_subtree;
};

Tree.prototype.getParentNode = function(node) {

	var nodePos = this.getNodePos(node);
	return this.tree[nodePos[0]-1][Math.floor(nodePos[1]/2)];
};

Tree.prototype.exchangeSubtree = function(subtree1,node1,subtree2,node2) {

	console.log(this.getNodePos(node2));
	this.tree.addSubtree(subtree1,this.getNodePos(node2));
	this.tree.addSubtree(subtree2,this.getNodePos(node1));
};

function AdaptiveHuffmanCoding(filePath){
	this.filePath = filePath;
	this.huffmanTree = new Tree();
	this.huffmanCoding = function(){
		fs.readFile(this.filePath, 'utf8', (err, data)=>{
			if(err){
				console.log('1');
				throw err;
			}	
			this.huffmanTree.init();
			console.log(this.huffmanTree.tree);	
			for(var i = 0; i < data.length; i++){
				this.huffmanTree.newToAdd(data[i]);
			}
			console.log(this.huffmanTree);
		});
	}
}






