var LLBack = cc.LayerColor.extend({
	ctor:function(color,width,height){
		this._super();
		this.init(color,width,height);

		this.ignoreAnchorPointForPosition(false);
		this.setAnchorPoint(cc.p(0, 0));
	}
});