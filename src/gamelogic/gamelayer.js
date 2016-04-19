var GameLayer = cc.Layer.extend({

	ctor:function () {
        this._super();
        this.init();
        this.blockcaches = {};

        var touchlis = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        });
        cc.eventManager.addListener(touchlis, this);

        this.moveCameraOn(0,0,false);

        return true;
    },

    moveCameraOn:function(x,y,animate){
       this.setPosition(x,y);
    },

    onTouchBegan:function(touch,event){
        cc.log("onTouchBegan");
        return true;
    },

    onTouchMoved:function(touch,event){
        var d = touch.getDelta();
        var target = event.getCurrentTarget(); 
        target.moveCameraOn(target.getPositionX()+d.x,target.getPositionY()+d.y,false);
        return true;
    },

    onTouchEnded:function(touch,event){
        cc.log("onTouchEnd");
    },

    addBlock:function(block){
    	var b = this.blockAt(block.bx,block.by);
    	if (b) {
    		ll.err("block exsit.");
    	}else{
    		this.blockcaches[block.posKey()] = block;
    		this.addChild(block);
    	}
    },

    blockAt:function(bx,by){
        var key = bx+"#"+by;
        if (key in this.blockcaches){
            return this.blockcaches[key];
        }
    	return null;
    },

    updateBlock_ID:function(blockid,data){

    },

});