var LLLabel = cc.LabelTTF.extend({
	ctor:function(text,fz,width){
		this._super();
		if (!width) {
			this.initWithString(text,"",fz);
		}else{
			this.initWithString(text,"",fz,cc.size(width,0));	
		}
	},

	setTextColor:function(color){
		this.setFontFillColor(color);
	},
});