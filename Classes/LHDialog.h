//
//  LHDialog.h
//  LHCocosFirstGame
//
//  Created by huji on 14-12-23.
//
//

#ifndef __LHCocosFirstGame__LHDialog__
#define __LHCocosFirstGame__LHDialog__

#include "cocos2d.h"
#include "UILayout.h"
class LHDialog : public cocos2d::ui::Layout{
public:
    static void showDialog(cocos2d::Node *view);
    static void disMissDialog();
    
    bool init();
    CREATE_FUNC(LHDialog);
    
    void disMiss();
};

#endif /* defined(__LHCocosFirstGame__LHDialog__) */
