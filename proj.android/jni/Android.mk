LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

$(call import-add-path,$(LOCAL_PATH)/../../cocos2d)
$(call import-add-path,$(LOCAL_PATH)/../../cocos2d/external)
$(call import-add-path,$(LOCAL_PATH)/../../cocos2d/cocos)
$(call import-add-path,$(LOCAL_PATH)/../..)

LOCAL_MODULE := cocos2dcpp_shared

LOCAL_MODULE_FILENAME := libcocos2dcpp

LOCAL_SRC_FILES := hellocpp/main.cpp \
../../Classes/AppDelegate.cpp \
../../Classes/DeveloperInfoScence.cpp \
../../Classes/GameOverScene.cpp \
../../Classes/HelloWorldScene.cpp \
../../Classes/LHLeaderBoard.cpp \
../../Classes/LHPauseScene.cpp \
../../Classes/LHShareButton.cpp \
../../Classes/LocalizedString.cpp \
../../Classes/NDKHelper/NDKCallbackNode.cpp \
../../Classes/NDKHelper/NDKHelper.cpp \
../../Classes/PlayScene.cpp \
../../Classes/ThirdPartyHelper.cpp \
../../Classes/LHGameLayer.cpp

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes \
					$(LOCAL_PATH)/../../Classes/NDKHelper \
					$(LOCAL_PATH)/../../libpomelo \
					$(LOCAL_PATH)/../../cocos2d/cocos/ui


LOCAL_WHOLE_STATIC_LIBRARIES := cocos2dx_static
LOCAL_WHOLE_STATIC_LIBRARIES += cocosdenshion_static
LOCAL_WHOLE_STATIC_LIBRARIES += pomelo_static
LOCAL_WHOLE_STATIC_LIBRARIES += cocos_ui_static
# LOCAL_WHOLE_STATIC_LIBRARIES += box2d_static
# LOCAL_WHOLE_STATIC_LIBRARIES += cocosbuilder_static
# LOCAL_WHOLE_STATIC_LIBRARIES += spine_static
LOCAL_WHOLE_STATIC_LIBRARIES += cocostudio_static
# LOCAL_WHOLE_STATIC_LIBRARIES += cocos_network_static
# LOCAL_WHOLE_STATIC_LIBRARIES += cocos_extension_static

include $(BUILD_SHARED_LIBRARY)

$(call import-module,.)
$(call import-module,audio/android)
$(call import-module,editor-support/cocostudio)
$(call import-module,libpomelo)
