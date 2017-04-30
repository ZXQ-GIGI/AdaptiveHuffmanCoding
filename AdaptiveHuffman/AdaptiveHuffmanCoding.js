'use strict'

var NYT = 'NYT';

module.exports = BinaryTree;

/*
 * An object to decribe a node 
 * @param {string} data
 * @param {Node}   left
 * @param {Node}   right
 */
function Node(data,left,right,parent){

	this.data = data;
	this.left = left;
	this.right = right;
	this.parent = parent;
	this.num = 0;
	this.count = function(){
		return this.num++;
	}
}

function BinaryTree(){
	this.root = new Node(NYT,null,null,null);
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
			console.log(arr[cur]);
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

	var current;//node need to add 1
	var array = this.levelTraversal(this.root);
	if(this.isExist(new_data)){//the new data has already existed in the tree			
		for(var i = 0; i < array.length; i++){
			if(array[i].data == new_data){
				current = array[i];
			}
		}	 
	}
	else{
		current = array[array.length-1];
	}

	while(current != this.root){

		var currentNum = current.num;
		array = this.levelTraversal(this.root);
		var farthest;
		for(var i = 0; i < array.length; i++){
			if(array[i].num == currentNum){
				farthest = array[i];
			}
		}
		//=====================================


		//=====================================

	}
};
//
BinaryTree.prototype.isExist = function(new_data) {
	for(var i = 0; i < this.warehouse.length; i++){
		if(this.warehouse.indexof(new_data) < 0){
			this.warehouse.push(new_data);
			return false;
		}
	}
	return true;
};

BinaryTree.prototype.updateTree = function(array,cur_node,far_node) {

	for(var i = 0; i < array.length; i++){
		if(array[i] == cur_node){
			array[i] == far_node;
		}
		if(array[i] == far_node){
			array[i] == cur_node;
		}
		var sub_array = this.levelTraversal(array[i]);
		array[0] = this.updateTree(sub_array,cur_node,far_node);
	}
	return array[0];
}


