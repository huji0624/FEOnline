//
//  LHGameLayer.h
//  LHCocosFirstGame
//
//  Created by huji on 14-11-21.
//
//

#ifndef __LHCocosFirstGame__LHGameLayer__
#define __LHCocosFirstGame__LHGameLayer__

#include "cocos2d.h"

#define FOCUS_ANI_TIME 0.2f

class LHGameLayer : public cocos2d::Layer{
public:
    LHGameLayer();
    virtual ~LHGameLayer();
    void update(float delta);
    std::function<void(int tag)> onEventHappen;
private:
    cocos2d::Size _mapSize;
    
    void focusOn(cocos2d::Vec2 center,float len,bool animate);
    void focusOn(cocos2d::Vec2 center,float len,bool animate,cocos2d::CallFunc* complete);
    
    cocos2d::Vec2 _focusCenter;
    float _focusLen;
};

#endif /* defined(__LHCocosFirstGame__LHGameLayer__) */
