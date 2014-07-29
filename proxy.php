<?php

//
// basic basic proxy
//
function getUrl($url) {
  error_log("Fetch:" . $url);
  $handle = fopen($url, "rb");
  $ret = stream_get_contents($handle);
  fclose($handle);

  //error_log("ret:\n $ret \n");
  echo $ret;
}


//
//
if (isset($_GET['url']) ) {
  getUrl($_GET['url']);
} 
else {
  error_log("Err: missing the url to fetch for you.");
  echo "Dude, you must send a 'url' so the proxy will work on something...";
}
