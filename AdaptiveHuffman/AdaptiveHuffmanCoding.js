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
	//this.root.num = -1;
	this.warehouse = new Array();
}

// from right to left
BinaryTree.prototype.levelTraversal = function(node) {
	
	var arr = new Array();
	arr.push(node);
	var cur = 0;
	var end = 1;

	while(cur < arr.length){
		end = arr.length;
		while(cur < end){			
			//console.log(arr[cur]);
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
	
	var current = new Node(null,null,null);//node need to add 1
	var array = this.levelTraversal(this.root);
	//console.log(array);
	if(this.isExist(new_data)){	
		//the new data has already existed in the tree	
		current = new Node(null,null,null);	
		console.log(new_data + ' is existed.');	
		for(var i = 0; i < array.length; i++){
			if(array[i].data == new_data){
				current = array[i];
			}
		}	 
	}
	else{
		console.log(new_data + ' is not existed.');	
		current = new Node(null,null,null);
		array[array.length-1].data = null;		
		array[array.length-1].left = new Node(NYT,null,null);
		array[array.length-1].right = new Node(new_data,null,null);
		array[array.length-1].right.count();
		current = array[array.length-1];
	}

	while(current.data != this.root.data){
		var currentNum = current.getNum();
		array = this.levelTraversal(this.root);
		var farthest = new Node(null,null,null);

		for(var i = 0; i < array.length; i++){
			if(array[i].num == currentNum){
				farthest = array[i];
			}
		}
	//	console.log(farthest);
		current = this.updateTree(array,current,farthest);
	}
	this.root = current;
	this.root.data = 'root';
	this.root.count();
	console.log(this.root);
};

BinaryTree.prototype.isExist = function(newdata) {


	for(var i = 0; i < this.warehouse.length; i++){
		if(this.warehouse.indexOf(newdata) >= 0){
			return true;
		}
	}
	this.warehouse.push(newdata);
	return false;
};

BinaryTree.prototype.updateTree = function(array,cur_node,far_node) {

	if(cur_node == far_node){
		array[1].count();
		array[0].left = array[2];
		array[0].right = array[1];
		return array[0];
	}

	for(var i = 1; i < 3; i++){
		if(array[i]){
			if(array[i] == cur_node){
				array[i] = far_node;
			}
			else if(array[i] == far_node){
				array[i] = cur_node;
				array[i].count();
			}
			else{
				if(array[i].left != null){
					var sub_array = this.levelTraversal(array[i]);
					array[0] = this.updateTree(sub_array,cur_node,far_node);
				}
			}
		}
	}
	array[0].left = array[2];
	array[0].right = array[1];
	console.log('----------------------------');
	console.log(array[0]);
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
				console.log(i + ":" + data[i]);
				this.huffmanTree.newToInsert(data[i]);
				//console.log(this.huffmanTree);
			}
		});
	}
}


