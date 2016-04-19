var cclonglink = cc.Class.extend({

	connect:function (host,port,params,callback){
		pomelo.init({
				host: host,
				port: port,
				log: true
		}, function() {
			var route = "connector.entryHandler.entry";
			pomelo.request(route, params, function(data) {
				callback(data);
			});
		});
	},

	disconnect:function() {
		pomelo.disconnect();
	},

	onevent:function(event,callback){
		pomelo.on(event,callback);
	},

	send:function(msgtype,msg){
		var route = "";
		pomelo.notify(route, msg);
	},

	request:function(msgtype,msg,callback){
		var route = "";
		pomelo.request(route,msg,callback);
	}
});