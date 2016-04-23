var CCLongLink = cc.Class.extend({

	connect: function(host, port, params, callback) {

		this.cacheAction = [];
		this.routeMap = {};
		this.connecting = false;

		tmpthis = this;

		pomelo.init({
			host: host,
			port: port,
			log: true
		}, function() {
			var route = "connector.entryHandler.entry";
			var p = {};
			p.winSize = cc.winSize;
			p.infos = params;
			pomelo.request(route,p, function(data) {
				if(data.code == 200){
					tmpthis.connecting = true;
					tmpthis.routeMap = data.msg.routemap;
					tmpthis.flushMsg();
	
				}
				
				callback(data);
			});
		});
	},

	flushMsg: function() {
		for (var i in this.cacheAction) {
			var cachemsg = this.cacheAction[i];
			if (cachemsg.length == 2) {
				this.send(cachemsg[0], cachemsg[1]);
			} else {
				this.request(cachemsg[0], cachemsg[1], cachemsg[2]);
			}
		}
	},

	disConnect: function() {
		pomelo.disconnect();
	},

	onEvent: function(event, callback) {
		pomelo.on(event, callback);
	},

	send: function(msgtype, msg) {
		if (this.connecting) {
			var route = this.routeForMsgtype(msgtype);
			if (route) {
				pomelo.notify(route, msg);
			} else {
				ll.err("can not find msgtype for route." + msgtype);
			}
		} else {
			this.cacheAction.push([msgtype, msg]);
		}
	},

	request: function(msgtype, msg, callback) {
		if (this.connecting) {
			var route = this.routeForMsgtype(msgtype);
			if (route) {
				pomelo.request(route, msg, callback);
			} else {
				ll.err("can not find msgtype for route." + msgtype);
			}
		} else {
			this.cacheAction.push([msgtype, msg, callback]);
		}
	},

	routeForMsgtype: function(msgtype) {
		if (msgtype in this.routeMap) {
			return this.routeMap[msgtype];
		}
		return null;
	},
});