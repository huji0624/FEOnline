var glink = new CCLongLink();

var gsblock = new SBlock(0,0,"");

var GameLayer = cc.Layer.extend({

	ctor:function () {
        this._super();
        this.init();
        this.blockcaches = [];

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

        glink.onEvent("syncblock",this.handleSyncBlock.bind(this));

        this.moveCameraOn(0,0,false);
        this.sync();

        return true;
    },

    handleSyncBlock:function(msg){
        for (var i in msg){
            var b = msg[i];
            if(!!b.actionType){
                var tran = Transaction.fromMsg(b);
                var block = this.blockWithID(tran.toblockid);
                block.sblock.transact(tran);
                block.updateBlock();
            }else{
                this.addBlock(new Block(b));
            }
        }
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
                if(!!b){
                    infos.push(b.syncInfo());
                }else{
                    infos.push({bx:i,by:j});
                }
            }
        }

        glink.request("syncblock",{"list":infos},this.handleSyncBlock.bind(this));
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
    	var b = this.blockAt(block.bx(),block.by());
    	if (!!b) {
    		ll.err("block exsit."+block.bx()+"#"+block.by());
    	}else{
    		this.blockcaches[block.posKey()] = block;
    		this.addChild(block);
    	}
    },

    //目前blockid和位置相关对后续拓展有风险
    blockAt:function(bx,by){
        var key = gsblock.posKeyFrom(bx,by);
        return this.blockWithID(key);
    },

    blockWithID:function(blockid){
        return this.blockcaches[blockid];
    },

});