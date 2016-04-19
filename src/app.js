var HelloWorldLayer = cc.Layer.extend({
    // sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var size = cc.winSize;

        // add "HelloWorld" splash screen"
        var back = new cc.LayerColor(cc.color.BLUE,size.width,size.height);
        back.setPosition(0,0);
        this.addChild(back);

        this.gmlayer = new GameLayer();
        this.addChild(this.gmlayer);

        this.gmlayer.addBlock(new Land(3,3));

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

