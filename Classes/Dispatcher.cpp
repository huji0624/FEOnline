#include "Dispatcher.h"

/** 共有資源をスレッドで使う時に必要 */
static std::mutex mutex;

void Dispatcher::executeMain(const std::function<void ()> &task)
{
    auto scheduler = cocos2d::Director::getInstance()->getScheduler();
    scheduler->performFunctionInCocosThread([=] {
        std::lock_guard<std::mutex> lock(mutex);
        task();
    });
}

void Dispatcher::executeBackground(const std::function<void ()> &task)
{
    std::thread([=] {
        std::lock_guard<std::mutex> lock(mutex);
        task();
    }).detach();
}
