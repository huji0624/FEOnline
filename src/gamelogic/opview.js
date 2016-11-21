var OpView = cc.Node.extend({
	ctor:function(width,height){

		this._super();

		this.width = width;
		this.height = height;

		// add "HelloWorld" splash screen"
        var back = new cc.LayerColor(cc.color.BLACK,this.width,this.height);
        back.setPosition(0,0);
        this.addChild(back);

        var y = 0;

		var placebt = new LLTextButton("Place",100,100);
		this.addChild(placebt);
		this.placebt = placebt;

		var okbt = new LLTextButton("okbt",100,100);
		okbt.setPosition(placebt.x+110,y)
		this.addChild(okbt);
		this.okbt = okbt;
	},

	setPlaceLis:function(foo){
		this.placebt.setClickListener(foo);
	},

	setOKLis:function(foo){
		this.okbt.setClickListener(foo);
	},

});