module.exports = function(app) {
  return new Users(app);
};

var Users = function(app) {
	this.app = app;
};

Users.prototype.qUserInfo = function(uid) {

	var legal = [];
	legal["huji"] = true;
	legal["ww"] = true;

	if (!!legal[uid]) {
		return {code:200,name:uid};
	}else{
		return {code:503,error:"user not valide."};
	}
};