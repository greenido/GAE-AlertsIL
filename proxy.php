<?php
//
// basic proxy
// @author: Ido Green | @greenido
//

//
// Fetch a url and echo it back to stdout
// 
function getUrl($url) {
  //error_log("Fetch:" . $url);
  $handle = fopen($url, "rb");
  $ret = stream_get_contents($handle);
  fclose($handle);
  //error_log("ret:\n $ret \n");
  echo $ret;
}

//
// Start the party
//
if (isset($_GET['url']) ) {
  getUrl($_GET['url']);
} 
else {
  error_log("Err: yo! you are missing the url to fetch for you.");
  echo "You must send a 'url' so the proxy will work on something...";
}
