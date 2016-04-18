//
//  LHGameLayer.cpp
//  LHCocosFirstGame
//
//  Created by huji on 14-11-21.
//
//

#include "LHGameLayer.h"

USING_NS_CC;
LHGameLayer::LHGameLayer(){
    _mapSize = Size(MAXFLOAT, MAXFLOAT);
    
    auto lis = EventListenerTouchOneByOne::create();
    lis->onTouchBegan = [this](Touch* tmpTouch, Event*){
        return true;
    };
    lis->onTouchMoved = [this](Touch* tmpTouch, Event*){
    };
    lis->onTouchEnded = [this](Touch*, Event*){
    };
    this->getEventDispatcher()->addEventListenerWithSceneGraphPriority(lis, this);
}

LHGameLayer::~LHGameLayer(){
    this->getEventDispatcher()->removeEventListenersForTarget(this);
}

void LHGameLayer::update(float delta){

}

void LHGameLayer::focusOn(cocos2d::Vec2 center, float len, bool animate, cocos2d::CallFunc *complete){
    
    Size vs = Director::getInstance()->getVisibleSize();
    Vec2 vo = Director::getInstance()->getVisibleOrigin();
    
    float toscale = 1.0f;
    if (len<vs.width) {
        toscale = vs.width/len;
    }else if(len>vs.height){
        toscale = vs.height/len;
    }
    
    Vec2 sccenter = Vec2(vs.width/2, vs.height/2 + vo.y);
    
    float tox = sccenter.x - center.x*toscale;
    float toy = sccenter.y - center.y*toscale;
    
    if (toy>vo.y) {
        toy = vo.y;
    }else if (toy<vs.height-toscale*_mapSize.height+vo.y){
        toy = vs.height-toscale*_mapSize.height+vo.y;
    }
    
    if (tox>vo.x) {
        tox = vo.x;
    }else if (tox<vs.width-toscale*_mapSize.width+vo.x){
        tox = vs.width-toscale*_mapSize.width+vo.x;
    }
    
    if (animate) {
        auto scale = ScaleTo::create(FOCUS_ANI_TIME, toscale);
        auto mv = MoveTo::create(FOCUS_ANI_TIME, Vec2(tox, toy));
        auto conc = Spawn::create(scale,mv, NULL);
        if (complete==nullptr) {
            this->runAction(conc);
        }else{
            auto sq = Sequence::create(conc,complete, NULL);
            this->runAction(sq);
        }
    }else{
        this->setPosition(tox, toy);
        this->setScale(toscale);
    }
    
    _focusCenter = Vec2(center.x, (sccenter.y - toy)/toscale);
    _focusLen = len;
}

void LHGameLayer::focusOn(cocos2d::Vec2 center, float len, bool animate){
    this->focusOn(center, len, animate, nullptr);
}