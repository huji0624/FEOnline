//
//  LHGameChat.h
//  LHCocosFirstGame
//
//  Created by huji on 14-12-20.
//
//

#ifndef __LHCocosFirstGame__LHGameChat__
#define __LHCocosFirstGame__LHGameChat__

#include "cocos2d.h"
#include "UIButton.h"

class LHGameChat{
public:
    static cocos2d::ui::Button* gameChatButton();
    
    static cocos2d::Node* waitView();
};

#endif /* defined(__LHCocosFirstGame__LHGameChat__) */
