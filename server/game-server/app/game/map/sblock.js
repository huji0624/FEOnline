module.exports = function (bx,by){
	return new SBlock(bx,by,respath);
};

var SBlock = function(bx,by){
	this.bx = bx;
	this.by = by;
};

SBlock.prototype.posKey = function(){
	return this.posKeyFrom(this.bx,this.by);
};

SBlock.prototype.posKeyFrom = function(bx,by){
	return bx + "#" + by;
};