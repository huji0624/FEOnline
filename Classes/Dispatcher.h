#ifndef __DISPATCHER_H__
#define __DISPATCHER_H__

#include "cocos2d.h"

class Dispatcher
{
public:
    /**
     * @brief バックグランドでタスクを実行する
     * @param task タスク
     */
    static void executeBackground(const std::function<void ()> &task);

    /**
     * @brief メインスレッドでタスクを実行する
     * @param task タスク
     */
    static void executeMain(const std::function<void ()> &task);
};

#endif // __DISPATCHER_H__
