//replaceThis is auto generate.Do not edit.//replace

var SBLOCK_TRANS_SIZE = 100;

var SBlock = function(bdata){
	this.bdata = bdata;

	this.currentTransaction = null;
	this.transactions = [];
};

SBlock.prototype.posKey = function(){
	return this.posKeyFrom(this.bdata.bx,this.bdata.by);
};

SBlock.prototype.posKeyFrom = function(bx,by){
	return bx + "#" + by;
};

SBlock.prototype.transactionsAfter = function(tid){

	var trans = [];
	var start = false;

	for (var i in this.transactions){
		var t = this.transactions[i];

		if (start) {
			trans.push(t);
		}

		if (t.tid == tid){
			start = true;
		}
	}

	return trans;
};

SBlock.prototype.transact = function(transaction){
	//先判断是否可以执行这个事务
	ll.info("未判断事务是否可执行.");

	//执行
	transaction.perform(this);

	//记录
	this.currentTransaction = transaction;
	this.transactions.push(transaction);
	if(this.transactions.length > SBLOCK_TRANS_SIZE){
		this.transactions.shift();
	}
};