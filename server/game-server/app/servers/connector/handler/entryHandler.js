// var logger = require( 'pomelo-logger' ).getLogger( 'crash-log' );
var ll = new Object();
ll.info = function(msg) {
	console.log(msg);
};

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;

	this.channel = app.get('channelService').getChannel("fe", true);
	this.smap = require("../../../game/map/smap.js")(app);
	this.users = require("../../../game/user/users.js")(app);
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

	var winSize = msg.winSize; //not used.
	var uid = msg.infos.uid;

	var userInfo = this.users.qUserInfo(uid);
	if (userInfo.code != 200) {
		next(null, userInfo);
		return;
	}


	var sessionService = this.app.get('sessionService');
	//duplicate log in
	if (!!sessionService.getByUid(uid)) {
		next(null, {
			code: 500,
			error: uid + " already login."
		});
		return;
	}
	var sid = this.app.get('serverId');
	session.bind(uid);
	session.on('closed', this.leave.bind(this, uid, sid));

	this.channel.add(uid, sid);

	var routeMap = {
		"syncblock": "connector.entryHandler.syncblock",
		"syncallblock": "connector.entryHandler.syncallblock"
	};

	var conf = {
		mapEdge: {
			l: 0,
			t: 1000,
			r: 1000,
			b: 0
		},
		mode:0
	};

	next(null, {
		code: 200,
		msg: {
			config: conf,
			routemap: routeMap,
			user: userInfo
		}
	});
};

Handler.prototype.leave = function(uid, sid) {
	ll.info(uid + " leave.");
	this.channel.leave(uid, sid);
};

Handler.prototype.syncblock = function(msg, session, next) {

	var list = msg.list;
	var response = [];
	for (var i in list) {
		var b = list[i];
		var bx = b.bx;
		var by = b.by;
		var tid = b.tid;
		if (!!tid) {
			var block = this.smap.blockAt(bx, by);
			var trans = block.transactionsAfter(tid);
			for (var j in trans) {
				var tran = trans[j];
				response.push(tran.toMsg());
			}
		} else {
			var block = this.smap.blockAt(bx, by);
			response.push(block.bdata);
		}
	}

	next(null, response);
};

Handler.prototype.syncallblock = function(msg, session, next) {

	var response = [];

	for (var i = 0 ; i < 15 ; i++) {
		for (var j = 0; j < 15; j++) {
			var bx = i;
			var by = j;
			var block = this.smap.blockAt(bx, by);
			response.push(block.bdata);
		}
	}

	next(null, response);
};