var Block = cc.Sprite.extend({

	ctor:function(bx,by){
		var sz = 60;

		this._super();
		this.initWithFile(res.PL_png,cc.rect(0,0,sz,sz));

		this.bx = bx;
		this.by = by;

		this.x = bx * sz + sz/2;
		this.y = by * sz + sz/2;

		//debug
		var helloLabel = new cc.LabelTTF(this.resPath(), "", 18);
        helloLabel.x = this.width / 2;
        helloLabel.y = this.height / 2;
        helloLabel.setFontFillColor(cc.color.RED);
        this.addChild(helloLabel);

		return true;
	},

	resPath:function(){
		return null;
	},

	posKey:function(){
		return this.bx + "#" + this.by;
	},

	setBuild:function(build){
		this.build = build;
	},

});