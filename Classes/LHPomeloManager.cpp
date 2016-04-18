//
//  LHPomeloManager.cpp
//  LHCocosFirstGame
//
//  Created by huji on 14-12-19.
//
//

#include "LHPomeloManager.h"
#include "Dispatcher.h"

USING_NS_CC;

static std::vector<LHPomeloManager*> _managers;
static LHPomeloManager* managerByClient(pc_client_t *client){
    auto it = _managers.begin();
    while (it!=_managers.end()) {
        if ((*it)->pomeloClient==client) {
            return (*it);
        }
        ++it;
    }
    return nullptr;
}

void onSendCallback(pc_request_t *req, int status, json_t *resp)
{
    
}

// disconnect event callback.
static void on_close(pc_client_t *client, const char *event, void *data)
{
    CCLOG("client closed: %d.\n", client->state);
}

static void onChatCallback(pc_client_t *client, const char *event, void *data)
{
    json_t* json = (json_t* )data;
    LHPomeloManager *pm = managerByClient(client);
    if (pm) {
        json_incref(json);
        Dispatcher::executeMain([json,pm](){
            if(pm->onMessage) pm->onMessage(json);
            json_decref(json);
        });
    }
}

static void onAddCallback(pc_client_t *client, const char *event, void *data)
{
    json_t* json = (json_t* )data;
    LHPomeloManager *pm = managerByClient(client);
    if (pm) {
        json_incref(json);
        Dispatcher::executeMain([json,pm](){
            if(pm->onAdd) pm->onAdd(json);
            json_decref(json);
        });
    }
}

static void onLeaveCallback(pc_client_t *client, const char *event, void *data)
{
    json_t* json = (json_t* )data;
    LHPomeloManager *pm = managerByClient(client);
    if (pm) {
        json_incref(json);
        Dispatcher::executeMain([json,pm](){
            if(pm->onLeave) pm->onLeave(json);
            json_decref(json);
        });
    }
    return;
}

static void onDisconnectCallback(pc_client_t *client, const char *event, void *data)
{
    CCLOG("%s", event);
}

static void requstConnectorCallback(pc_request_t *req, int status, json_t *resp)
{
//    if(status == -1) {
//        CCLOG("Fail to send request to server.\n");
//    } else if(status == 0) {
//        char *json_str = json_dumps(resp, 0);
//        CCLOG("server response: %s \n", json_str);
//        json_t* users = json_object_get(resp,"users");
//        if(json_object_get(resp, "error") != NULL) {
//            CCLOG("connect error %s", json_str);
//            free(json_str);
//            return;
//        }
//        pomelo_client = req->client;
//        for (unsigned int i=0; i<json_array_size(users); i++) {
//            json_t* val = json_array_get(users,i);
//            userQueue->addObject(CCString::create(json_string_value(val)));
//        }
//        
//    }
    LHPomeloManager *pm = managerByClient(req->client);
    json_incref(resp);
    Dispatcher::executeMain([pm,resp,status](){
        if(pm->onEnterChannel) pm->onEnterChannel(status,resp);
        json_decref(resp);
    });
    
    // release relative resource with pc_request_t
    json_t *msg = req->msg;
    pc_client_t *client = req->client;
    json_decref(msg);
    pc_request_destroy(req);
}

static void requstGateCallback(pc_request_t *req, int status, json_t *resp)
{
    if(status == -1) {
        CCLOG("Fail to send request to server.\n");
    } else if(status == 0) {
        auto connectorHost = json_string_value(json_object_get(resp, "host"));
        auto connectorPort = json_number_value(json_object_get(resp, "port"));
        
        if (connectorHost!=NULL) {
            pc_client_t *client = pc_client_new();
            
            struct sockaddr_in address;
            
            memset(&address, 0, sizeof(struct sockaddr_in));
            address.sin_family = AF_INET;
            address.sin_port = htons(connectorPort);
            address.sin_addr.s_addr = inet_addr(connectorHost);
            
            // add pomelo events listener
            void (*on_disconnect)(pc_client_t *client, const char *event, void *data) = &onDisconnectCallback;
            void (*on_chat)(pc_client_t *client, const char *event, void *data) = &onChatCallback;
            void (*on_add)(pc_client_t *client, const char *event, void *data) = &onAddCallback;
            void (*on_leave)(pc_client_t *client, const char *event, void *data) = &onLeaveCallback;
            
            pc_add_listener(client, "disconnect", on_disconnect);
            pc_add_listener(client, "onChat", on_chat);
            pc_add_listener(client, "onAdd", on_add);
            pc_add_listener(client, "onLeave", on_leave);
            
            // try to connect to server.
            if(pc_client_connect(client, &address)) {
                CCLOG("fail to connect server.\n");
                pc_client_destroy(client);
                return ;
            }
            
            LHPomeloManager *pm = managerByClient(req->client);
            if (pm) {
                pm->pomeloClient = client;
                const std::string& username = pm->getUserName();
                const std::string& channel = pm->getChannel();
                
                const char *route = "connector.entryHandler.enter";
                json_t *msg = json_object();
                json_t *str = json_string(username.c_str());
                json_t *channel_str = json_string(channel.c_str());
                json_object_set(msg, "username", str);
                json_object_set(msg, "rid", channel_str);
                // decref for json object
                json_decref(str);
                json_decref(channel_str);
                
                pc_request_t *request = pc_request_new();
                void (*connect_cb)(pc_request_t *req, int status, json_t *resp )= &requstConnectorCallback;
                pc_request(client, request, route, msg, connect_cb);
            }
        }
    }
    
    // release relative resource with pc_request_t
    json_t *pc_msg = req->msg;
    pc_client_t *pc_client = req->client;
    json_decref(pc_msg);
    pc_request_destroy(req);
    
    pc_client_stop(pc_client);
}

//static LHPomeloManager *_instance = nullptr;
//LHPomeloManager* LHPomeloManager::getInstance(){
//    if(_instance==nullptr){
//        _instance = new LHPomeloManager();
//    }
//    return _instance;
//}

LHPomeloManager::LHPomeloManager(){
    _managers.push_back(this);
}

LHPomeloManager::~LHPomeloManager(){
    auto it = _managers.begin();
    for(;it!=_managers.end();++it){
        if ((*it)==this) {
            break;
        }
    }
    if (it!=_managers.end()) {
        _managers.erase(it);
    }
}

void LHPomeloManager::addListener(const char *event, const std::function<void (pc_client_t *, const char *, void *)>& eventCallBack){
    
}

void LHPomeloManager::disconnect(){
    if (pomeloClient) {
        pc_client_disconnect(pomeloClient);
        pc_client_destroy(pomeloClient);
    }
}

bool LHPomeloManager::send(const std::string &content,const std::string& target){
    if (pomeloClient==nullptr) {
        return false;
    }
    const char *route = "chat.chatHandler.send";
    json_t *msg = json_object();
    json_t *str = json_string(content.c_str());
    json_object_set(msg, "content", str);
    json_object_set(msg, "rid", json_string(_channel.c_str()));
    json_object_set(msg, "from", json_string(_username.c_str()));
    json_object_set(msg, "target", json_string(target.c_str()));
    
    pc_request_t *request = pc_request_new();
    void (*on_send_cb)(pc_request_t * req, int status, json_t * resp) = onSendCallback;
    int res = pc_request(pomeloClient, request, route, msg, on_send_cb);
    return res==0;
}

bool LHPomeloManager::connect(const std::string& username,const std::string& channel){
    pc_client_t *client = pc_client_new();
    
    struct sockaddr_in address;
    
    memset(&address, 0, sizeof(struct sockaddr_in));
    address.sin_family = AF_INET;
    address.sin_port = htons(Pomelo_Port);
    address.sin_addr.s_addr = inet_addr(Pomelo_Host);
    
    // try to connect to server.
    if(pc_client_connect(client, &address)) {
        printf("fail to connect server.\n");
        pc_client_destroy(client);
        return false;
    }
    
    _username = username;
    _channel = channel;
    
    // add some event callback.
    pc_add_listener(client, PC_EVENT_DISCONNECT, on_close);
    
    pomeloClient = client;
    
    const char *route = "gate.gateHandler.queryEntry";
    json_t *msg = json_object();
    json_t *str = json_string(username.c_str());
    json_object_set(msg, "uid", str);
    // decref for json object
    json_decref(str);
    
    pc_request_t *request = pc_request_new();
    void (*on_request_gate_cb)(pc_request_t *req, int status, json_t *resp) = &requstGateCallback;
    pc_request(client, request, route, msg, on_request_gate_cb);
    
    // main thread has nothing to do and wait until child thread return.
    pc_client_join(client);
    
    // release the client
    pc_client_destroy(client);
    
    return true;
}