//
//  LHGameChat.cpp
//  LHCocosFirstGame
//
//  Created by huji on 14-12-20.
//
//

#include "LHGameChat.h"
#include "LHPomeloManager.h"
#include "LHGameChatView.h"
#include "LHDialog.h"
#include "LHMacros.h"
#include "UILayout.h"
USING_NS_CC;

static LHPomeloManager *_chatManager = nullptr;
static LHGameChatView *_chatView = nullptr;
static int _userCount = 0;

static void refreshUserCountLabel(){
    _chatView->setTitle(StringUtils::format("----------%d-----------",_userCount));
}

Node* LHGameChat::waitView(){
    Size vs = Director::getInstance()->getVisibleSize();
    Vec2 vo = Director::getInstance()->getVisibleOrigin();
    
    auto lo = ui::Layout::create();
    Size sz = Size(vs.width/2,vs.height/4);
    lo->setSize(sz);
    lo->setPosition(Vec2(vs.width/2 - sz.width/2, vs.height/2 - sz.height/2));
    lo->setBackGroundColorType(cocos2d::ui::Layout::BackGroundColorType::SOLID);
    lo->setBackGroundColor(Color3B::GRAY);
    lo->setBackGroundColorOpacity(200);
    
    auto load = ui::Text::create("Loading...", Common_Font, 30);
    load->setColor(Color3B::GREEN);
    load->setPosition(Vec2(sz.width/2, lo->getSize().height/2));
    auto cancel = ui::Button::create("close.png");
    cancel->setPosition(Vec2(sz.width/2, lo->getSize().height/2 - load->getContentSize().height - 20));
    cancel->addTouchEventListener([](Ref *ps,ui::Widget::TouchEventType type){
        if (type == ui::Widget::TouchEventType::ENDED) {
            if (_chatManager) {
                _chatManager->disconnect();
                delete _chatManager;
                _chatManager = nullptr;
                
                LHDialog::disMissDialog();
            }
        }
    });
    
    lo->addChild(load);
    lo->addChild(cancel);
    return lo;
}

ui::Button* LHGameChat::gameChatButton(){
    auto bt = ui::Button::create("q.png");
    bt->addTouchEventListener([bt](Ref *ps,ui::Widget::TouchEventType type){
        if (type == ui::Widget::TouchEventType::ENDED) {
            if (_chatManager==nullptr) {
                LHDialog::showDialog(LHGameChat::waitView());
                
                _chatManager = new LHPomeloManager();
                _chatManager->connect("2dxhuji", "huji");
                _chatManager->onEnterChannel = [bt](int status,json_t *resp){
                    LHDialog::disMissDialog();
                    
                    int uc = 0;
                    json_t* users = json_object_get(resp,"users");
                    for (unsigned int i=0; i<json_array_size(users); i++) {
//                        json_t* val = json_array_get(users,i);
                        uc++;
                    }
                    _userCount = uc;
                    
                    if (_chatView == nullptr) {
                        float margin = 50;
                        Size vs = Director::getInstance()->getVisibleSize();
                        Vec2 vo = Director::getInstance()->getVisibleOrigin();
                        vs.width = vs.width - margin*2;
                        vs.height = vs.height - margin*2;
                        _chatView = new LHGameChatView();
                        _chatView->init(vs);
                        auto scene = Director::getInstance()->getRunningScene();
                        _chatView->setPosition(Vec2(vo.x+margin, vo.y+margin));
                        scene->addChild(_chatView);
                        _chatView->onSend = [](const std::string& content){
                            return _chatManager->send(content, "*");
                        };
                    }
                    
                    refreshUserCountLabel();
                };
                _chatManager->onMessage = [](json_t *resp){
                    //{"msg": "d", "from": "huji", "target": "*"}
                    json_t *msg = json_object_get(resp, "msg");
                    json_t *from = json_object_get(resp, "from");
                    const char *fromstr = json_string_value(from);
                    _chatView->addOne(fromstr, json_string_value(msg), LHGameChat_MsgType_Left);
                };
                _chatManager->onAdd = [](json_t *resp){
                    _userCount++;
                    refreshUserCountLabel();
                  
                    json_t *user = json_object_get(resp, "user");
                    const char *userstr = json_string_value(user);
                    auto msg = StringUtils::format("%s >>",userstr);
                    _chatView->addOne( "",msg, LHGameChat_MsgType_Middle);
                };
                _chatManager->onLeave = [](json_t *resp){
                    _userCount--;
                    refreshUserCountLabel();
                 
                    json_t *user = json_object_get(resp, "user");
                    const char *userstr = json_string_value(user);
                    auto msg = StringUtils::format("%s ~~",userstr);
                    _chatView->addOne("",msg,  LHGameChat_MsgType_Middle);
                };
            }else{
                if (!_chatView->isShowing()) {
                    auto scene = Director::getInstance()->getRunningScene();
                    scene->addChild(_chatView);
                }
            }
        }
    });
    return bt;
}