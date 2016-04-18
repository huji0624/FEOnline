//
//  LHGameChatView.cpp
//  LHCocosFirstGame
//
//  Created by huji on 14-12-20.
//
//

#include "LHGameChatView.h"
#include "LHMacros.h"
#include "UIButton.h"
#include "LHDialog.h"
#include "UIImageView.h"
USING_NS_CC;

std::string myWrap(std::string str,int length)
{
    unsigned int beginPos = 0;  //字符串的初始位置
    std::string resultStr;		//返回的字符串
    
    std::vector<std::string > str_vec;  //创建一个字符串类型的顺序容器
    do
    {
        str_vec.push_back(str.substr(beginPos,length)); //substr函数的作用类似剪刀，将str中从beginPos到length之间的字符串剪下来，单独放入容器中
        if (beginPos+length >str.size())
        {
            break;  //当要裁剪的长度超出str的长度，则退出循环
        }
        else
        {
            beginPos += length;
        }
        
    } while (true);
    
    for (unsigned int i = 0;i<str_vec.size();++i)
    {
        resultStr.append(str_vec.at(i)).append("\n"); //从容器逐一取出之前裁剪好的一段段字符串，分别在字符串后面加上换行符。append()类似胶水，将\n粘到字符串后面
    }
    
    return resultStr;  
}

bool LHGameChatView::init(cocos2d::Size size){
    if (!Layout::init()) {
        return false;
    }
    
    setSize(size);
    
    _titleView = ui::Text::create("--", Common_Font, 35);
    _titleView->setPosition(Vec2(size.width/2, size.height-_titleView->getContentSize().height/2));
    _titleView->setColor(Color3B::GRAY);
    
    auto tback = ui::ImageView::create("chattitle.png");
    tback->setScale9Enabled(true);
    tback->setSize(Size(size.width,_titleView->getContentSize().height));
    tback->setPosition(_titleView->getPosition());
    
    addChild(tback);
    addChild(_titleView);
    
    float th = 50;
    _textField = ui::TextField::create("|", Common_Font, 30);
    _textField->retain();
    
    auto tfbt = ui::Button::create("input.png");
    tfbt->setSize(Size(size.width,th));
    tfbt->setScale9Enabled(true);
    tfbt->setTitleFontSize(30);
    tfbt->setTitleText("Type here to input.");
    tfbt->setPosition(Vec2(size.width/2, th/2));
    tfbt->addTouchEventListener([this](Ref *ps,ui::Widget::TouchEventType type){
        if (type == ui::Widget::TouchEventType::ENDED) {
            Size vs = Director::getInstance()->getVisibleSize();
            _textField->attachWithIME();
            _textField->setPosition(Vec2(vs.width/2, vs.height-_textField->getContentSize().height/2));
            _textField->addEventListener([this](Ref*, ui::TextField::EventType tp){
                if (tp==ui::TextField::EventType::DETACH_WITH_IME) {
                    LHDialog::disMissDialog();
                    const std::string str = _textField->getStringValue();
                    if (onSend(str)) {
                        this->addOne("Me", str, LHGameChat_MsgType_Right);
                    }
                    _textField->setText("");
                }
            });
            LHDialog::showDialog(_textField);
        }
    });
    addChild(tfbt);
    
    _messageListView = ui::ListView::create();
    _messageListView->setSize(Size(size.width, size.height - _titleView->getContentSize().height - th));
    _messageListView->setPosition(Vec2(0, th));
//    _messageListView->setBackGroundImage("phsprite.png");
//    _messageListView->setBackGroundImageScale9Enabled(true);
    addChild(_messageListView);
    
    auto backbt = ui::Button::create("close.png");
    backbt->setPosition(Vec2(0, size.height));
    backbt->addTouchEventListener([this](Ref *ps,ui::Widget::TouchEventType type){
        if (type == ui::Widget::TouchEventType::ENDED) {
            this->disMiss();
        }
    });
    addChild(backbt);
    
    setBackGroundColorType(cocos2d::ui::Layout::BackGroundColorType::SOLID);
    setBackGroundColor(Color3B::BLACK);
    setBackGroundColorOpacity(200);
    
    return true;
}

void LHGameChatView::disMiss(){
    removeFromParent();
}

void LHGameChatView::clearMessage(){
    _messageListView->removeAllItems();
}

bool LHGameChatView::isShowing(){
    return !(getParent()==nullptr);
}

void LHGameChatView::addOne(const std::string &username, const std::string &msgstr, int type){
    if (_messageListView->getItems().size()>LHGameChat_Max_Msg_Count) {
        _messageListView->removeItem(0);
    }
    
    ui::Layout *cell = nullptr;
    if (type==LHGameChat_MsgType_Middle) {
        cell = ui::Layout::create();
        auto ut = ui::Text::create(msgstr, Common_Font, 30);
        cell->setSize(Size(getSize().width,ut->getContentSize().height));
        ut->setPosition(Vec2(cell->getSize().width/2, cell->getSize().height/2));
        
        cell->addChild(ut);
        
        cell->setBackGroundImage("lgreenback.png");
        cell->setBackGroundImageScale9Enabled(true);
    }else{
        float margin = 5;
        float umargin = 5;
        float mmargin = 15;
        cell = ui::Layout::create();
        auto msgt  = ui::Text::create("", Common_Font, 35);
        msgt->setString(myWrap(msgstr, 25));
        
        auto unt = ui::Text::create(username, Common_Font, 25);
        unt->setColor(Color3B::GRAY);
        if (type==LHGameChat_MsgType_Right) {
            unt->setPosition(Vec2(-umargin+getSize().width-unt->getContentSize().width/2, margin*2+msgt->getContentSize().height+unt->getContentSize().height/2));
            msgt->setPosition(Vec2(-mmargin+getSize().width-msgt->getVirtualRendererSize().width/2, margin+msgt->getContentSize().height/2));
            cell->setBackGroundImage("grayback.png");
        }else{
            unt->setPosition(Vec2(umargin+unt->getContentSize().width/2, margin*2+msgt->getContentSize().height+unt->getContentSize().height/2));
            msgt->setPosition(Vec2(mmargin+msgt->getVirtualRendererSize().width/2, margin+msgt->getContentSize().height/2));
            cell->setBackGroundImage("lblueback.png");
        }
        
        cell->setSize(Size(getSize().width, unt->getContentSize().height+msgt->getContentSize().height+margin*3));
        
        cell->addChild(unt);
        cell->addChild(msgt);
        
        cell->setBackGroundImageScale9Enabled(true);
    }
    
    _messageListView->pushBackCustomItem(cell);
    _messageListView->refreshView();
    _messageListView->scrollToBottom(0.3, true);
}

void LHGameChatView::setTitle(const std::string &title){
    _titleView->setString(title);
}