//replace
module.exports = function(actionType,actionPath){return new Transaction(actionType,actionPath);};
//replace

/*
	{
		a:a,
		b:b,
		c:{
			c1:c1,
			c2:c2
		},
		d:[
			{d1:d1},
			{d2:d2}
		]
	}
*/

var TRANS_ACTION_TYPE_VALUE_TO = 0;

var Transaction = function(actionType,actionPath){
	this.actionType = actionType;
	this.actionPath = actionPath;

	this.tvalue = null;
};

//fromMsg和toMsg一定要对应起来
Transaction.fromMsg = function(msg){
	var tran = new Transaction(msg.actionType,msg.actionPath);

	tran.toblockid = msg.blockid;

	if(msg.actionType == TRANS_ACTION_TYPE_VALUE_TO){
		tran.tvalue = msg.tvalue;
	}

	tran.ready();

	return tran;
}

//fromMsg和toMsg一定要对应起来
Transaction.prototype.toMsg = function(){
	var msg = {};

	msg[actionType] = this.actionType;
	msg[actionPath] = this.actionPath;
	msg[blockid] = this.blockid;

	if(this.actionType == TRANS_ACTION_TYPE_VALUE_TO){
		msg[tvalue] = this.tvalue;
	}

	return msg;
};

Transaction.prototype.ready = function(){
	if (!this.actionPath) {throw "actionPath not set."};

	this.tid = this.buildID();
};

Transaction.prototype.buildID = function(){
	var d = new Date();

	var iden = "#";
	if(this.actionType == TRANS_ACTION_TYPE_VALUE_TO){
		iden = this.tvalue;
	}

	if (iden == null) {throw "iden not is null."+this.actionType};

	return d.getTime() + "#" + iden;
};

Transaction.prototype.perform = function(sblock){
	if (this.actionType == TRANS_ACTION_TYPE_VALUE_TO) {
		sblock.bdata[this.actionPath] = this.tvalue;
	}else{
		throw "not support action type " + this.actionType;
	}

	this.blockid = sblock.posKey();
};