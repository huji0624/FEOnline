var CCLongLink = cc.Class.extend({

	init:function() {
		this.cacheAction = [];
		this.routeMap = {};
		this.connecting = false;
	},

	connect: function(host, port, params, callback) {

		tmpthis = this;

		pomelo.init({
			host: host,
			port: port,
			log: true
		}, function() {
			var route = "connector.entryHandler.entry";
			pomelo.request(route, params, function(data) {
				
				tmpthis.connecting = true;
				tmpthis.routeMap = data.msg;
				tmpthis.flushMsg();

				callback(data);
			});
		});
	},

	flushMsg:function(){
		for (var cachemsg in self.cacheAction){
			if(cachemsg.length==2){
				this.send(cachemsg[0],cachemsg[1]);
			}else{
				this.request(cachemsg[0],cachemsg[1],cachemsg[2]);
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
		var route = this.routeForMsgtype(msgtype);
		if (route) {
			if (this.connecting) {
				pomelo.notify(route, msg);
			} else {
				this.cacheAction.push([msgtype,msg]);
			}
		} else {
			ll.err("can not find msgtype for route."+msgtype);
		}

	},

	request: function(msgtype, msg, callback) {
		var route = this.routeForMsgtype(msgtype);
		if (route) {
			if (this.connecting) {
				pomelo.request(route, msg, callback);
			} else {
				this.cacheAction.push([msgtype,msg,callback]);
			}
		} else {
			ll.err("can not find msgtype for route."+msgtype);
		}
	},

	routeForMsgtype: function(msgtype) {
		if (msgtype in this.routeMap) {
			return this.routeMap[msgtype];
		}
		return null;
	},
});