module.exports = function(app) {
  return new SMap(app);
};

var SMap = function(app) {
	this.app = app;
	this.mapProvider = require("./mapprovider.js");

	this.loadMap();
};

var gblock = require("./sblock.js")(0,0);

SMap.prototype.loadMap = function() {
	this.map = {};
	var datas = this.mapProvider.loadMap();
	for (var i in datas){
		var b = datas[i];
		this.map[b.posKey()] = b;
	}
};

SMap.prototype.blockAt = function(bx,by) {
	var key = gblock.posKeyFrom(bx,by);
	var b = this.map[key];
	if(b){
		return b;
	}else{
		//这里需要重构一下，把map改变block写一套接口.
		var newb = this.mapProvider.blockAt(bx,by);
		this.map[newb.posKey()] = newb;
		return newb;
	}
};

SMap.prototype.blocksAt = function(blocks) {
	var bs = [];
	for (var i in blocks){
		var b = blocks[i];
		var bx = b.bx;
		var by = b.by;
		bs.push(this.blockAt(bx,by));
	}
	return bs;
};