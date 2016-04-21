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
        this.gmlayer.setDidClickBlock(function(block){
            if(!!this.detail){
                this.detail.removeFromParent();
            }
            this.detail = new BlockDetailView(block,cc.winSize.width/5,cc.winSize.height);
            this.detail.x = 0;
            this.detail.y = 0;
            this.addChild(this.detail);
        }.bind(this));
        this.gmlayer.setOnMoveCallback(function(){
            if(!!this.detail){
                this.detail.removeFromParent();
                this.detail = null;
            }
        }.bind(this));

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

