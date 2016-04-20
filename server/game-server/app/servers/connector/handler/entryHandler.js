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
		"sync" : "connector.entryHandler.sync"
	};

 	next(null, {code: 200, msg: route_map});
};

Handler.prototype.leave = function(uid,sid){
	this.channel.leave(uid, sid);
};

Handler.prototype.sync = function(msg, session, next) {
	next(null,[{t:0,bx:0,by:0}]);
};
