##Run

* npm run init 
* npm run run 
    
##Generating

* gulp component --name [menu]

** 메인메뉴
 -> gulp component --name main --parent main
** 메뉴
    gulp component --name denied --parent main
    gulp component --name chgpwd --parent main
    gulp component --name store_item --parent store
    
    gulp component --name timeline_list --parent timeline
** common의 메뉴
 -> gulp component --name http --parent ../common
