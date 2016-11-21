var PlayGround = cc.Node.extend({
	ctor:function(config){
		this._super();

		this.mode = config.mode;
		this.config = config;

		var size = cc.winSize;

        // add "HelloWorld" splash screen"
        var back = new cc.LayerColor(cc.color.BLUE,size.width,size.height);
        // back.setPosition(size.width/2,size.height/2);
        this.addChild(back);

        this.gmlayer = new GameLayer();
        this.gmlayer.mapEdge = config.mapEdge;
        this.addChild(this.gmlayer);
        this.gmlayer.setDidClickBlock(function(block){
        	if (!this.willPlaceFlag) {
        		if(block.sblock.bdata.v == -1){
        			//如果这个block是雷
        			if(this.mode==0){
        				//gameover
        				cc.log("click on fire.gameover.")
        			}else{

        			}

        		}else{
        			if (!!block.already) {
        				cc.log("already checked.");
        			}else{
        				var count = new LLTextButton(block.sblock.bdata.respath,BLOCK_SIZE,BLOCK_SIZE);
			            block.addChild(count);
			            var fade = new cc.fadeOut(1);
			            var rm = new cc.removeSelf();
			            var sq = new cc.sequence([fade,rm]);
			            count.runAction(sq);
			            block.already = true;
        			}
        		}
        	}else{
        		if(this.mode==0){
	        		this.placeFlagOn(1,block);	
        		}else{
        			this.placeFlagOn(this.config.flag,block);
        		}
        		
        		this.willPlaceFlag = false;
        	}
        }.bind(this));

        var opview = new OpView(size.width,100);
        this.addChild(opview);

       	opview.setPlaceLis(function(){
       		this.willPlaceFlag = true;
       	}.bind(this));

       	opview.setOKLis(function(){
       		if(this.mode==0){
       			this.singleModeOK();
       		}else{

       		}
       	}.bind(this));
	},

	singleModeOK:function(){

	},

	placeFlagOn:function(flag,block){
		if (!block.flag) {
				//single mode
			block.setFlag(flag);
		}else{
			cc.log("already flag.");
		}
	}
});