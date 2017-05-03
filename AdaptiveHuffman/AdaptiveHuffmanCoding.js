'use strict'
const fs = require('fs');
module.exports = AdaptiveHuffman;

var NYT = 'NYT';
var Root = 'root';

function Node(data,left,right){
	this.data = data;
	this.left = left;
	this.right = right;
	this.weight = 0;
	this.count = function(){
		return this.weight++;
	}
}

function BinaryTree(){
	this.root = new Node(Root,null,null,null);
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
		
	var current = this.getFirstCurrentNode(new_data);

	while(current.data != this.root.data){
		var farthest = {};
		var array = this.levelTraversal(this.root);
		
		for(var i = 1; i < array.length; i++){
			if(array[i].weight == current.weight && array[i].left != current && array[i].right != current){
				farthest = array[i];
				break;
			}
		}
		this.root = this.swapNode(array,current,farthest);
		array = this.levelTraversal(this.root);
		for(var i = 0; i < array.length; i++){
			if(array[i]){
				if(array[i].left == current || array[i].right == current){
					current = array[i];
					break;
				}
			}	
		}
	}
	this.root = current;
	this.root.count();
	return this.huffmanCoder(new_data).join('');
};
//check the new data is existed in huffman tree or not
BinaryTree.prototype.isExist = function(new_data) {

	for(var i = 0; i < this.warehouse.length; i++){
		if(this.warehouse.indexOf(new_data) >= 0){
			return true;
		}
	}
	this.warehouse.push(new_data);
	return false;
};

//when insert new data to huffamn tree, get current node whose weight needs add 1
BinaryTree.prototype.getFirstCurrentNode = function(new_data) {

	var current = new Node(null,null,null);		
	var array = this.levelTraversal(this.root);
	if(this.isExist(new_data)){	
		for(var i = 0; i < array.length; i++){
			if(array[i].data == new_data){
				current = array[i];
				break;
			}
		}	 
	}
	else{
		array = this.levelTraversal(this.createNewNode(array,new_data)); 
		for(var i = 0; i < array.length; i++){
			if(array[i].left != null && array[i].left.data == NYT){
				current = array[i];
				break;
			}
		}
	}
	this.root = array[0];
	return current;
};

BinaryTree.prototype.swapNode = function(array,cur_node,far_node) {

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
					array[i] = this.swapNode(sub_array,cur_node,far_node);
				}
			}
		}
	}
	array[0].left = array[2];
	array[0].right = array[1];
	return array[0];
}

BinaryTree.prototype.createNewNode = function(array, new_data) {

	if(array.length == 1 && array[0].data == Root){
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
	return array[0];
}

BinaryTree.prototype.huffmanCoder = function(data) {

	var array = this.levelTraversal(this.root);
	var code = new Array();
	var i = array.length - 2;
	var cur_node = {};
	while(i > 0){
		if(array[i].data == data){	
			cur_node = array[i];		
			code.push(i%2);
		}
		else if((array[i].left && array[i].left == cur_node) || (array[i].right && array[i].right == cur_node)){
			cur_node = array[i];
			code.push(i%2);
		}
		i--;
	}
	return code.reverse();
};

function AdaptiveHuffman(filePath){
	this.filePath = filePath;
	this.huffmanTree = new BinaryTree();

	this.coding = function(){
		fs.readFile(this.filePath, 'utf8', (err,data)=>{
			if(err){
				throw err;
			}
			var string = new String();
			for(var i = 0; i < data.length; i++){
				string += this.huffmanTree.newToInsert(data[i]);
			}
			this.toSave(string);
		});
	}
	this.toSave = function(string){
		fs.writeFile('output.txt',string,'utf8',(err)=>{
			if(err){
				throw err;
			}
		})
	}
}