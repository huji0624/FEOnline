var SinglePlayLayer = cc.Layer.extend({
    // sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.loginback = new LLBack(cc.color.YELLOW,cc.winSize.width,cc.winSize.height);
        this.addChild(this.loginback,0);

        LLInput.show("username",this.loginConfirm.bind(this));

        return true;
    },

    loginConfirm:function(username){

        glink.connect("127.0.0.1",3010,{uid:username,mode:0},function(data){
            cc.log(data);
            if(data.code == 200){
                LLToast.show("Login OK.");
                this.setUpPlay(data.msg.config);
                this.showUserInfo(data.msg.user);
            }else{
                LLToast.show(data.error);
            }
        }.bind(this));

    },

    setUpPlay:function(config){

        var play = new PlayGround(config);
        this.addChild(play);

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

var SinglePlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SinglePlayLayer();
        this.addChild(layer);
    }
});