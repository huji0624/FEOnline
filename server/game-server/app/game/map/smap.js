module.exports = function(app) {
  return new SMap(app);
};

var SMap = function(app) {
	this.app = app;
	this.mapProvider = require("./mapprovider.js");

	this.loadMap();
};

var gblock = require("./sblock.js")(0,0);

SMap.prototype.test = function() {
	console.log("SMap xxx");
};

SMap.prototype.loadMap = function() {
	this.map = {};
	var datas = this.mapProvider.loadMap();
	for b in datas{
		this.map[b.posKey()] = b;
	}
};

SMap.prototype.blockAt = function(bx,by) {
	var key = gblock.posKeyFrom(bx,by);
	var b = this.map[key];
	if(b){
		return b;
	}else{
		return this.mapProvider.blockAt(bx,by);
	}
};

SMap.prototype.blocksAt = function(blocks) {
	var bs = [];
	for b in blocks{
		var bx = b.bx;
		var by = b.by;
		bs.push(this.blockAt(bx,by));
	}
	return bs;
};