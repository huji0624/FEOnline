var pro = new Object();
var SBlock = require("./sblock.js");

module.exports = pro;

pro.loadMap = function(){
	return [];
};

pro.blockAt = function(bx,by){
	return new SBlock({bx:bx,by:by,respath:"pl.png",tid:"#"});
};