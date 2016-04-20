// var logger = require( 'pomelo-logger' ).getLogger( 'crash-log' );
var ll = new Object();
ll.info=function(msg){
  console.log(msg);
};

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;

  this.channel = app.get('channelService').getChannel("fe",true);
  this.smap = require("../../../game/map/smap.js")(app);
};



/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
	var uid = "jj";

	var sessionService = this.app.get('sessionService');
	//duplicate log in
	if( !! sessionService.getByUid(uid)) {
		next(null, {
			code: 500,
			error: true
		});
		return;
	}
	var sid = this.app.get('serverId');
	session.bind(uid);
	session.on('closed', this.leave.bind(this,uid,sid));

	this.channel.add(uid,sid);

	var route_map = {
		"syncblock" : "connector.entryHandler.syncblock"
	};

 	next(null, {code: 200, msg: route_map});
};

Handler.prototype.leave = function(uid,sid){
	this.channel.leave(uid, sid);
};

Handler.prototype.syncblock = function(msg, session, next) {

	var list = msg.list;
	var response = [];
	for (var i in list){
		var b = list[i];
		var bx = b.bx;
		var by = b.by;
		var tid = b.tid;
		if (!!tid) {
			var block = this.smap.blockAt(bx,by);
			var trans = block.transactionsAfter(tid);
			for (var j in trans){
				var tran = trans[j];
				response.push(tran.toMsg());
			}
		}else{
			var block = this.smap.blockAt(bx,by);
			response.push(block.bdata);
		}
	}

	next(null,response);
};
