var glink = new CCLongLink();

var HelloWorldLayer = cc.Layer.extend({
    // sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var sz = cc.winSize;
        var ma = 30;

        var bt = new LLTextButton("Single",100,50);
        bt.setClickListener(this.singleClick.bind(this));
        bt.setPosition(sz.width/2,sz.height/2 + ma);
        this.addChild(bt);

        bt = new LLTextButton("PVP",100,50);
        bt.setClickListener(this.multiClick.bind(this));
        bt.setPosition(sz.width/2,sz.height/2 - ma);
        this.addChild(bt);

        return true;
    },

    singleClick:function(){
        cc.director.runScene(new SinglePlayScene());
    },

    multiClick:function(){
        cc.director.runScene(new MultiPlayScene());
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

