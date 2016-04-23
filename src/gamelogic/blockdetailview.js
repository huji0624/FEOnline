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
		var label = new LLLabel(str, 20 ,this.width);
        label.x = this.width / 2;
        label.y = this.height / 2;
        label.setTextColor(cc.color.RED);
        this.addChild(label);

        this.cview = label;
        this.block = block;
	},

	update:function(){
		this.cview.setString(JSON.stringify(this.block.sblock.bdata));
	},
});