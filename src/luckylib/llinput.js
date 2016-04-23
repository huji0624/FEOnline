var LLInput = cc.Node.extend({
	ctor: function(config, confirmcallback) {
		this._super();
		this.init();

		this.ignoreAnchorPointForPosition(false);
		this.setAnchorPoint(cc.p(0, 0));

		this.confirmcallback = confirmcallback;

		var bw = 80;
		var bh = bw / 2;

		this.bh = bh;

		this.maxH = 0;
		this.maxW = 400;

		if (config instanceof Array) {
			this.inputs = [];
			for (var i in config) {
				var line = config[i];
				var input = this.insertLine(line.title, line.key);
				this.inputs.push(input);
			}
		} else {
			this.inputone = this.insertLine(config, "");
		}

		this.maxH = this.maxH + bh;

		// add "HelloWorld" splash screen"
		var back = new LLBack(cc.color.BLACK, this.maxW, this.maxH + 10);
		// back.setPosition( - back.width/2, -back.height/2);
		this.addChild(back, 0);

		var by = (this.maxH + 200)/2 - bh/2;

		var cancel = new LLTextButton("取消", bw, bh);
		cancel.setClickListener(function() {
			this.removeFromParent();
		}.bind(this));
		this.addChild(cancel, 1);

		var confirm = new LLTextButton("确定", bw, bh);
		confirm.x = this.maxW - bw;
		// confirm.y = -by;
		confirm.setClickListener(this.confirmFunc.bind(this));
		this.addChild(confirm, 1);

		this.width = this.maxW;
		this.height = back.height;

		return true;
	},

	insertLine: function(title, key) {
		var input = new ccui.TextField(title, "Arial", 22);
		input.x = this.maxW/2;
		input.y = this.maxH + this.bh + input.getContentSize().height/2;
		input.lineKey = key;
		this.addChild(input, 1);

		this.maxH = this.maxH + input.getContentSize().height;

		return input;
	},

	confirmFunc: function() {
		if (!!this.inputs) {
			var inputs = [];
			for (var i in this.inputs) {
				var one = this.inputs[i];
				inputs[one.lineKey] = one.getString();
			}
			this.confirmcallback(inputs);
		} else {
			this.confirmcallback(this.inputone.getString());
		}

		this.removeFromParent();
	},
});

LLInput.show = function(config, confirmcallback) {
	var run = cc.director.getRunningScene();
	var sz = cc.winSize;
	var input = new LLInput(config, confirmcallback);
	input.setPosition(cc.p(sz.width / 2 - input.width/2, sz.height / 2 - input.height/2));
	run.addChild(input, 100);
};