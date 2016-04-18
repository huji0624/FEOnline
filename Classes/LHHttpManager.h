//
//  LHHttpManager.h
//  LHCocosFirstGame
//
//  Created by huji on 14-11-28.
//
//

#ifndef __LHCocosFirstGame__LHHttpManager__
#define __LHCocosFirstGame__LHHttpManager__

#include "cocos2d.h"
#include "network/HttpClient.h"

using namespace cocos2d::network;

class LHHttpManager{
public:
    static LHHttpManager* getInstance();
    
    bool init();
    HttpRequest* get(const std::string& url
        ,std::function<void(std::string& resstr)> callback);
    
    HttpRequest* post(const std::string& url
              ,cocos2d::Map<std::string,cocos2d::CCString*>& params
              ,std::function<void(std::string& resstr)> callback);
    
    bool cancel(HttpRequest* request);
    
    void genGetUrl(std::string url,cocos2d::Map<std::string,cocos2d::CCString*>& params);
private:
    cocos2d::Vector<HttpRequest*> _requestQueue;
    
    void httpRes(HttpClient* client, HttpResponse* response,std::function<void(std::string& resstr)> callback);
};

#endif /* defined(__LHCocosFirstGame__LHHttpManager__) */
