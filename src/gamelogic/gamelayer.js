var glink = new CCLongLink();
glink.init();

var GameLayer = cc.Layer.extend({

	ctor:function () {
        this._super();
        this.init();
        this.blockcaches = {};

        glink.connect("127.0.0.1",3010,{},function(data){
            cc.log(data);
        });

        var touchlis = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        });
        cc.eventManager.addListener(touchlis, this);

        this.moveCameraOn(0,0,false);

        glink.onEvent("sync",this.handleSync.bind(this));

        return true;
    },

    handleSync:function(msg){
        
    },

    moveCameraOn:function(x,y,animate){
        this.setPosition(x,y);
    },

    sync:function(){
        var x = -this.getPositionX();
        var y = -this.getPositionY();

        var size = cc.winSize;
        var sz = BLOCK_SIZE;
        var sx = Math.floor(x/sz);
        var ex = sx+Math.floor(size.width/sz);
        var sy = Math.floor(y/sz);
        var ey = sy+Math.floor(size.height/sz);

        var infos=[];
        for (var i = sx; i < ex; i++) {
            for (var j = sy; j < ey; j++) {
                var b = this.blockAt(i,j);
                if(b){
                    infos.push(b.syncInfo());
                }else{
                    infos.push({bx:i,by:j});
                }
            }
        }

        glink.request("sync",infos,this.handleSync.bind(this));
    },

    onTouchBegan:function(touch,event){
        return true;
    },

    onTouchMoved:function(touch,event){
        var d = touch.getDelta();
        var target = event.getCurrentTarget(); 
        target.moveCameraOn(target.getPositionX()+d.x,target.getPositionY()+d.y,false);
        return true;
    },

    onTouchEnded:function(touch,event){
        var target = event.getCurrentTarget(); 
        target.sync();
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