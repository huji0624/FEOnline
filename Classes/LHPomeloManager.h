//
//  LHPomeloManager.h
//  LHCocosFirstGame
//
//  Created by huji on 14-12-19.
//
//

#ifndef __LHCocosFirstGame__LHPomeloManager__
#define __LHCocosFirstGame__LHPomeloManager__

#include "cocos2d.h"
#include <pomelo.h>

#define Pomelo_Host "127.0.0.1"
#define Pomelo_Port 3014

class LHPomeloManager{
public:
//    static LHPomeloManager* getInstance();
    LHPomeloManager();
    virtual ~LHPomeloManager();
    
    const std::string& getUserName(){
        return _username;
    }
    const std::string& getChannel(){
        return _channel;
    }
    
    bool connect(const std::string& username,const std::string& channel);
    bool send(const std::string& content,const std::string& target);
    void disconnect();
    
    void addListener(const char *event,const std::function<void(pc_client_t *client, const char *event, void *data)>& eventCallBack);
    
    std::function<void(int status, json_t *resp)> onEnterChannel;
    std::function<void(json_t *resp)> onMessage;
    std::function<void(json_t *resp)> onAdd;
    std::function<void(json_t *resp)> onLeave;
    
    pc_client_t *pomeloClient = nullptr;
private:
    std::string _username;
    std::string _channel;
};

#endif /* defined(__LHCocosFirstGame__LHPomeloManager__) */
