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
		var info = new cc.LabelTTF(bdata.bx+"#"+bdata.by, "", 18);
        info.x = this.width / 2;
        info.y = this.height / 2;
        info.setFontFillColor(cc.color.BLUE);
        this.addChild(info);

		return true;
	},

	setFlag:function(flag){
		if (flag>0) {
			var f = new cc.LabelTTF(flag, "", 18);
	        f.x = this.width / 2;
	        f.y = this.height / 2;
	        f.setFontFillColor(cc.color.RED);
	        this.addChild(f);
	        this.flag = f;
		}else{
			this.flag.removeFromParent();
			this.flag = null;
		}
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

Block.screenPosToBlockPos = function(x,y){
	var pos = {};
	pos.bx = Math.floor(x/BLOCK_SIZE);
	pos.by = Math.floor(y/BLOCK_SIZE);
	return pos;
};