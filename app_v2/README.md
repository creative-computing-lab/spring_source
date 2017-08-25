#eumbook
============

##Installing
* npm install -g ionic
* npm install
* npm install @types/lodash --save-dev --save-exact

* npm install ng2-translate --save

##Run
* ionic serve
* ionic serve --lab

##Generating

# ionic g page <PageName>
ex)ionic g page myPage

##Build
* ionic plugin add cordova-plugin-x-toast
* ionic build android

* gulp component --name http --parent ../common
* gulp component --name [화면이름] 
 ex) gulp component --name register
* gulp component --name [화면이름] --folder [메인폴더]
  ex) gulp component  --folder bill --name register
  
##Release
* [android]
* ionic build android --release -- --keystore="keystore/soulware-key.keystore" --storePassword=nextage20
20 --alias=soulware-key
* ionic build android --release --buildConfig=AndroidBuildConfig.json

* [iOS]
* ionic build ios --release

##Build New(2017.05.19)
##Ionic -v
##3.1.2
##cordova -v
##7.0.1
* ionic serve
* cordova platform add android
* cordova build android

* [iOS]
* cordova platform add ios
* cordova build ios
* GoogleService-Info.plist -> [APP]/Spring/Resources copy
* xocde build

##Release New(2017.05.19)
##Ionic -v
##3.1.2
##cordova -v
##7.0.1
* [android]
* cordova build android --release --buildConfig=AndroidBuildConfig.json