//
//  LHDialog.cpp
//  LHCocosFirstGame
//
//  Created by huji on 14-12-23.
//
//

#include "LHDialog.h"
USING_NS_CC;

static LHDialog *_globalInstance = nullptr;
void LHDialog::showDialog(cocos2d::Node *view){
    if (_globalInstance) {
        _globalInstance->disMiss();
    }
    
    _globalInstance = LHDialog::create();
    _globalInstance->addChild(view);
}

void LHDialog::disMissDialog(){
    if (_globalInstance) {
        _globalInstance->disMiss();
        _globalInstance = nullptr;
    }
}

bool LHDialog::init(){
    Size vs = Director::getInstance()->getVisibleSize();
    Vec2 vo = Director::getInstance()->getVisibleOrigin();
    setPosition(vo);
    setSize(vs);
    
    auto rs = Director::getInstance()->getRunningScene();
    rs->addChild(this);
    
    setBackGroundColorType(cocos2d::ui::Layout::BackGroundColorType::SOLID);
    setBackGroundColor(Color3B::BLACK);
    setBackGroundColorOpacity(200);
    
    return true;
}

void LHDialog::disMiss(){
    removeFromParent();
}