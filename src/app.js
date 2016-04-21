var glink = new CCLongLink();

var HelloWorldLayer = cc.Layer.extend({
    // sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        glink.connect("127.0.0.1",3010,{},function(data){
            this.showUserInfo(data.msg.user);
        }.bind(this));

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
    },

    showUserInfo:function(user){
        var size = cc.winSize;
        var helloLabel = new cc.LabelTTF(user.name, "", 20);
        helloLabel.x = size.width - 20;
        helloLabel.y = size.height - 20;
        helloLabel.setFontFillColor(cc.color.RED);
        this.addChild(helloLabel);
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

