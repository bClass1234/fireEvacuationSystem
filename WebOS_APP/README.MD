# WebOS App for Fire Evacuation 

## Setup
* File Structure
  - /fire folder : web os application files folder 
  - /fire/weOSjs-0.1.0 : javascript engine for webOS
  - /fire/appinfo.json : application information
  - /fire/icon.png, largeIcon.png : icon image
  - /fire/index.html : entry point of the application
  - com.bclass.app_0.1.0_all.ipk : package file for web OS OSE

* index.html file consist of simple javascript (location.herf) to request Fire Evacuation server. 

* for porting on WebOS OSE device, it is need to packge source files or use package file which is already packaged. 

* For packaging, WebOS-CLI sdk tools are needed : http://webosose.org/develop/sdk-tools/cli/download-and-install/
* Packging
<pre><code>ares-package fire</code></pre>

* Setup Device (Raspberry Pi3)
<pre><code>ares-setup device -a pi3 -i "username=root" -i "ip=###.###.###.###" -i "port=22"</code></pre>

* Install
<pre><code>ares-install com.bclass.app_0.1.0_all.ipk -d pi3 </code></pre>

* Launch application 
  - You can launch application directly via WebOS OSE (press windows key then select application) or on remote via cli tools
<pre><code>ares-launch com.bclass.app -d pi3</code></pre>
