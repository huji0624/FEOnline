var LLTextButton = ccui.Widget.extend({
	ctor:function(text,width,height){
		this._super();
		this.init();

		this.setContentSize(width,height);

		this.addChild(new LLBack(cc.color.ORANGE,width,height));

		this.ignoreAnchorPointForPosition(false);
		this.setAnchorPoint(cc.p(0, 0));

		var label = new LLLabel(text,10);
		label.x = width/2;
		label.y = height/2;
		this.addChild(label);

		this.setTouchEnabled(true);
        this.addClickEventListener(this.onClickFunc.bind(this));

        return true;
	},

	setClickListener:function(clicklis){
		this._clicklis = clicklis;
	},

	onClickFunc:function(sender){
		this._clicklis();
	}
});