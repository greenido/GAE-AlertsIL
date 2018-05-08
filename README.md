AlertsIL
========

AlertsIL is a mobile web app that give you all "Tezeva Adom" alerts in real time.
It also contain the main media sources (in Hebrew) and fetch them to one location.
It's a mobile first web application that should work great on any mobile device.

* Live Version: https://alerts-il.appspot.com/
* More details: https://greenido.wordpress.com/2014/07/09/israels-alerts-mobile-web-app-example/

![](http://greenido.files.wordpress.com/2014/07/screenshot-2014-07-09-16-28-35.png?w=247&h=300)

Main Goal
=========
A mobile web application that give the user all the relevant information on EVERY mobile device.
I hope we won't need to use it. This app is fetching Tzeva-Adom alerts in real time (3sec intervals)
and bring all the main news feed from Israel.

Objectives
==========
* Fresh data and alerts in real time.
* Be able to run on most of the mobile devices out there.

Features
========
* Tweets
  * refresh them every 60sec.

* APIs for Tzeva Adom alerts in real time
  * http://www.oref.org.il/WarningMessages/alerts.json
  * http://tzeva-adom.com/alerts.php?fmt=html&limit=2


Resources
=========
* Foundation CSS framework.
It's a mobile first framework with a powerful grid system and much more.

ToDos
=====
###Server
* Save the alerts/news in a cloud solution (firebase, Google CloudSQL)
* Expose an API to query the news and graph trends.
* Check a better deployment than: appcfg.py -A alerts-il update app.yaml --noauth_local_webserver

###Client
* Allow customization of the news/alerts sources.
* Add service worker support + push notifications.

(!) Please feel free to fork or open issues.

[![Analytics](https://ga-beacon.appspot.com/UA-65622529-1/AGE-AlertIL/main)](https://github.com/igrigorik/ga-beacon)


