# st-app



## Setup

#### Prerequisites 

1. Node version +4.1.x (not sure it works with 5.x.x yet)
2. Ionic & Cordova npm modules (global)
	1. Run `npm install -g cordova ionic ios-sim ios-deploy`
3. Android SDK
	1. Download, unzip: http://developer.android.com/sdk/installing/index.html?pkg=tools
	2. Add paths, Mac example:
	```
	export ANDROID_SDK=$HOME/Development/android-sdk_r24.3.4
	export ANDROID_NDK=$HOME/Development/android-ndk-r10e
	export ANDROID_HOME="$ANDROID_SDK"
	export ANDROID_PLATFORM_TOOLS="$ANDROID_SDK/platform-tools"
	export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_PLATFORM_TOOLS
	```		

#### Project Installs

1. Git Clone
2. Run `npm install`
3. Run `Bower Install`
4. Run `ionic resources`


### Run DEV: Android

1. `ionic run android -l -c -s`


### Run DEV: iOS

1. `ionic run ios -l -c -s`

