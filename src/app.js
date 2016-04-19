
var glink = new cclonglink();

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var size = cc.winSize;

        // add "HelloWorld" splash screen"

        var helloLabel = new cc.LabelTTF("Hello World", "", 38);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2;
        helloLabel.setFontFillColor(cc.color.BLUE);
        this.addChild(helloLabel);
        
        glink.connect("127.0.0.1",3010,{},function(data){
            cc.log(data);
        });

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

