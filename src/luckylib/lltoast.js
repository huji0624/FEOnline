var LLToast = {};

LLToast.show = function(text) {
	var run = cc.director.getRunningScene();
	var sz = cc.winSize;

	// add "HelloWorld" splash screen"
	var back = new cc.LayerColor(cc.color.BLACK, sz.width/4, sz.height/4);
	back.setPosition(sz.width/2 - back.width/2, sz.height/2 - back.height/2);
	run.addChild(back);

	//debug
	var helloLabel = new cc.LabelTTF(text, "", 20, cc.size(this.width, 0));
	helloLabel.x = back.width / 2;
	helloLabel.y = back.height / 2;
	helloLabel.setFontFillColor(cc.color.RED);
	back.addChild(helloLabel);

	var delay = new cc.delayTime(1);
	var rm = new cc.removeSelf();
	var seq = new cc.sequence(delay,rm);

	back.runAction(seq);
};