//
//  LHShareButton.h
//  LHCocosFirstGame
//
//  Created by huji on 14-7-30.
//
//

#ifndef __LHCocosFirstGame__LHShareButton__
#define __LHCocosFirstGame__LHShareButton__

#include <iostream>
#include "UIButton.h"
#include "cocos2d.h"

class LHShareButton : public cocos2d::ui::Button{
public:
    LHShareButton();
    
    static LHShareButton* create(const char *normalImage,
                                 const char *selectedImage);
    
    static LHShareButton* defaultButton(const char *normal,const char* shareText);
    
    /**
	 * 设置要分享的文本内容
	 * @param text 要分享的文本内容
	 */
	void setShareContent(const char* text);
    
    CREATE_FUNC(LHShareButton);
    
private:
    std::string mShareText;
};

#endif /* defined(__LHCocosFirstGame__LHShareButton__) */
