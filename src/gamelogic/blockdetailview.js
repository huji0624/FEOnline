var BlockDetailView = cc.Node.extend({
	ctor:function(block,width,height){

		this._super();

		this.width = width;
		this.height = height;

		// add "HelloWorld" splash screen"
        var back = new cc.LayerColor(cc.color.BLACK,this.width,this.height);
        back.setPosition(0,0);
        this.addChild(back);

		//debug
		var str = JSON.stringify(block.sblock.bdata);
		var helloLabel = new cc.LabelTTF(str, "", 20 , cc.size(this.width,0));
        helloLabel.x = this.width / 2;
        helloLabel.y = this.height / 2;
        helloLabel.setFontFillColor(cc.color.RED);
        this.addChild(helloLabel);

        this.cview = helloLabel;
        this.block = block;
	},

	update:function(){
		this.cview.setString(JSON.stringify(this.block.sblock.bdata));
	},
});