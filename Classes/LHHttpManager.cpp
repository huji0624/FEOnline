//
//  LHHttpManager.cpp
//  LHCocosFirstGame
//
//  Created by huji on 14-11-28.
//
//

#include "LHHttpManager.h"
USING_NS_CC;

static LHHttpManager* _instance = nullptr;

LHHttpManager* LHHttpManager::getInstance(){
    if (!_instance) {
        _instance  = new LHHttpManager();
    }
    return _instance;
}

bool LHHttpManager::init(){
    return true;
}

void LHHttpManager::httpRes(cocos2d::network::HttpClient *client, cocos2d::network::HttpResponse *response, std::function<void (std::string &)> callback){
    if (!response) {
        return;
    }
    
    if (_requestQueue.contains(response->getHttpRequest())) {
        if (response->isSucceed()) {
            std::vector<char>* buf = response->getResponseData();
            std::string resstr;
            for (auto it = buf->begin(); it!=buf->end(); it++) {
                char c = *it;
                resstr.push_back(c);
            }
            callback(resstr);
        }else{
           log("error.");
        }
        _requestQueue.eraseObject(response->getHttpRequest());
    }
}

void LHHttpManager::genGetUrl(std::string url, cocos2d::Map<std::string, cocos2d::CCString*> &params){
    std::string &geturl = url;
    if (geturl.find("?")==std::string::npos) {
        geturl.append("?");
    }
    for (auto it = params.begin(); it!=params.end(); it++) {
        const std::string &key = (*it).first;
        const char *value = (*it).second->getCString();
        geturl.append(StringUtils::format("&%s=%s",key.c_str(),value));
    }
}

HttpRequest* LHHttpManager::get(const std::string& url,std::function<void (std::string &)> callback){
    
    HttpRequest *request = new HttpRequest();
    request->setUrl(url.c_str());
    request->setRequestType(cocos2d::network::HttpRequest::Type::GET);
    request->setResponseCallback([this,callback](cocos2d::network::HttpClient *client, cocos2d::network::HttpResponse *response){
        this->httpRes(client,response,callback);
    });
    HttpClient::getInstance()->send(request);
    request->release();
    
    _requestQueue.pushBack(request);
    
    return  request;
}

HttpRequest* LHHttpManager::post(const std::string &url, cocos2d::Map<std::string,cocos2d::CCString*> &params, std::function<void (std::string &)> callback){
    
    HttpRequest *request = new HttpRequest();
    request->setUrl(url.c_str());
    request->setRequestType(cocos2d::network::HttpRequest::Type::POST);
    request->setResponseCallback([this,callback](cocos2d::network::HttpClient *client, cocos2d::network::HttpResponse *response){
        this->httpRes(client,response,callback);
    });
    std::string postdata;
    for (auto it = params.begin(); it!=params.end(); it++) {
        const std::string &key = (*it).first;
        const char *value = (*it).second->getCString();
        postdata.append(StringUtils::format("&%s=%s",key.c_str(),value));
    }
    request->setRequestData(postdata.c_str(), postdata.length());
    HttpClient::getInstance()->send(request);
    request->release();
    
    _requestQueue.pushBack(request);
    
    return  request;
}

bool LHHttpManager::cancel(HttpRequest* request){
    _requestQueue.eraseObject(request);
    return true;
}