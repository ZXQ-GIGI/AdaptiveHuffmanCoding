'use strict'

var NYT = 'NYT';
const fs = require('fs');
module.exports = AdaptiveHuffman;

/*
 * An object to decribe a node 
 * @param {string} data
 * @param {Node}   left
 * @param {Node}   right
 */
function Node(data,left,right){

	this.data = data;
	this.left = left;
	this.right = right;
	//this.parent = parent;
	this.num = 0;
	this.getNum = function(){
		return this.num;
	}
	this.count = function(){
		return this.num++;
	}
}

function BinaryTree(){
	this.root = new Node('root',null,null,null);
	this.warehouse = new Array();
}

// from right to left
BinaryTree.prototype.levelTraversal = function(node) {
//	console.log(node);
	var arr = new Array();
	arr.push(node);
	var cur = 0;
	var end = 1;

	while(cur < arr.length){
		end = arr.length;
		while(cur < end){			
			if(arr[cur].right){
				arr.push(arr[cur].right);
			}
			if(arr[cur].left){
				arr.push(arr[cur].left);
			}
			cur++;
		}
	}
	return arr;
};
	
BinaryTree.prototype.newToInsert = function(new_data) {

	var current = new Node(null,null,null);		
	var array = this.levelTraversal(this.root);
	var newnode = {};

	if(this.isExist(new_data)){	
		current = {};	
		console.log(new_data + ' is existed.');	
		for(var i = 0; i < array.length; i++){
			if(array[i].data == new_data){
				current = array[i];
			}
		}
		this.root = array[0];	 
	}
	else{
		console.log(new_data + ' is not existed.');	
		var arrTemp = new Array();
		current = {};	
		newnode = this.createNewNode(array,new_data);

		arrTemp = this.levelTraversal(newnode); 
		for(var i = 0; i < arrTemp.length; i++){
			if(arrTemp[i].left != null && arrTemp[i].left.data == NYT){
				current = arrTemp[i];
				break;
			}
		}
		this.root = arrTemp[0];
	}

	
	while(current.data != this.root.data){

		var currentNum = current.getNum();
		var farthest = {};
		array = this.levelTraversal(this.root);
		
		for(var i = 1; i < array.length; i++){
			if(array[i].getNum() == currentNum && array[i].left != current && array[i].right != current){
				farthest = array[i];
				break;
			}
		}
		this.root = this.updateTree(array,current,farthest);
		array = this.levelTraversal(this.root);
		for(var i = 0; i < array.length; i++){
			if(array[i]){
				if(array[i].left == current || array[i].right == current){
					current = array[i];
					//console.log(current);
					break;
				}
			}	
		}
	}
	this.root = current;
	this.root.data = 'root';
	this.root.count();
	console.log(this.root);
	console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> end');
};

BinaryTree.prototype.isExist = function(new_data) {

	for(var i = 0; i < this.warehouse.length; i++){
		if(this.warehouse.indexOf(new_data) >= 0){
			return true;
		}
	}
	this.warehouse.push(new_data);
	return false;
};

BinaryTree.prototype.updateTree = function(array,cur_node,far_node) {

	for(var i = 1; i < 3; i++){
		if(array[i]){
			if(array[i] == far_node){
				array[i] = cur_node;
				array[i].count();
			}
			else if(array[i] == cur_node){
				array[i] = far_node;
			}			
			else{
				if(array[i].left != null){
					var sub_array = this.levelTraversal(array[i]);
					array[i] = this.updateTree(sub_array,cur_node,far_node);
				}
			}
		}
	}
	array[0].left = array[2];
	array[0].right = array[1];

	return array[0];
}

BinaryTree.prototype.createNewNode = function(array, new_data) {
	// console.log(array);
	// console.log('------------------');
	if(array.length == 1 && array[0].data == 'root'){
		array[0].left = new Node(NYT,null,null);
		array[0].right = new Node(new_data,null,null);
   	 	array[0].right.count();
		return array[0];
	}

	for(var i = 1; i < 3; i++){
		if(array[i]){
			if(array[i].data == NYT){
				array[i].data = null;
				array[i].left = new Node(NYT,null,null);
				array[i].right = new Node(new_data,null,null);
				array[i].right.count();
			}
			else{
				if(array[i].left != null){
					var sub_array = this.levelTraversal(array[i]);
					array[i] = this.createNewNode(sub_array, new_data);
				}
			}	
		}
	}
	array[0].left = array[2];
	array[0].right = array[1];
	// console.log(array[0]);
	// console.log('----------------------------------');
	return array[0];
}

function AdaptiveHuffman(filePath){
	this.filePath = filePath;
	this.huffmanTree = new BinaryTree();

	this.init = function(){
		fs.readFile(this.filePath, 'utf8', (err,data)=>{
			if(err){
				throw err;
			}
			for(var i = 0; i < data.length; i++){
				console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< start');
				console.log(i + ":" + data[i]);
				this.huffmanTree.newToInsert(data[i]);
			}
		});
	}
}