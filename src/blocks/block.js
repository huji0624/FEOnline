var BLOCK_SIZE = 100;

var Block = cc.Sprite.extend({

	ctor:function(bdata){
		var sz = BLOCK_SIZE;

		this._super();
		this.initWithFile(res.PL_png,cc.rect(0,0,sz,sz));

		this.sblock = new SBlock(bdata);

		this.x = bdata.bx * sz + sz/2;
		this.y = bdata.by * sz + sz/2;

		//debug
		var helloLabel = new cc.LabelTTF(this.sblock.bdata.respath, "", 18);
        helloLabel.x = this.width / 2;
        helloLabel.y = this.height / 2;
        helloLabel.setFontFillColor(cc.color.RED);
        this.addChild(helloLabel);

		return true;
	},

	bx:function(){
		return this.sblock.bdata.bx;
	},
	by:function(){
		return this.sblock.bdata.by;
	},

	updateBlock:function(){
		ll.info("update block.do nothing.");
	},

	syncInfo:function(){
		return {bx:this.sblock.bdata.bx,by:this.sblock.bdata.by,tid:this.sblock.bdata.tid};
	},

	posKey:function(){
		return this.sblock.posKey();
	},

});